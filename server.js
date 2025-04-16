const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 数据库连接
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB 连接成功'))
    .catch(err => console.error('MongoDB 连接失败:', err));

// 引入 Record 模型
const { Record } = require('./src/models/Record');

// 配置 multer 用于处理文件上传
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('只允许上传图片文件！'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 限制文件大小为5MB
    }
});

// 中间件
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 确保uploads文件夹存在
(async () => {
    try {
        await fs.access('uploads');
    } catch {
        await fs.mkdir('uploads');
    }
})();

// API路由
// 获取所有记录
app.get('/api/records', async (req, res) => {
    try {
        const records = await Record.find().sort({ lastDiagnosisTime: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: '获取记录失败' });
    }
});

// 获取单个记录
app.get('/api/records/:id', async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);
        if (record) {
            res.json(record);
        } else {
            res.status(404).json({ error: '记录未找到' });
        }
    } catch (error) {
        res.status(500).json({ error: '获取记录失败' });
    }
});

// 创建新记录
app.post('/api/records', async (req, res) => {
    try {
        const newRecord = new Record(req.body);
        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ error: '创建记录失败' });
    }
});

// 更新记录
app.put('/api/records/:id', async (req, res) => {
    try {
        const record = await Record.findByIdAndUpdate(
            req.params.id,
            { ...req.body, lastDiagnosisTime: new Date() },
            { new: true }
        );
        if (record) {
            res.json(record);
        } else {
            res.status(404).json({ error: '记录未找到' });
        }
    } catch (error) {
        res.status(500).json({ error: '更新记录失败' });
    }
});

// 上传图片
app.post('/api/upload', upload.array('images', 10), (req, res) => {
    try {
        const files = req.files;
        const fileUrls = files.map(file => `/uploads/${file.filename}`);
        res.json({ urls: fileUrls });
    } catch (error) {
        res.status(500).json({ error: '上传图片失败' });
    }
});

// 搜索记录
app.get('/api/search', async (req, res) => {
    try {
        const { query } = req.query;
        const records = await Record.find({
            $or: [
                { caseName: new RegExp(query, 'i') },
                { symptom: new RegExp(query, 'i') }
            ]
        }).sort({ lastDiagnosisTime: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: '搜索失败' });
    }
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});