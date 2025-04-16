const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// 连接到 MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('已连接到 MongoDB'))
    .catch(err => {
        console.error('MongoDB 连接失败:', err);
        process.exit(1);
    });

// 引入 Record 模型
const { Record } = require('../src/models/Record');

async function migrateData() {
    try {
        // 读取现有的 JSON 文件
        const data = await fs.readFile(
            path.join(__dirname, '../data/records.json'),
            'utf8'
        );
        const records = JSON.parse(data);

        // 检查是否已经有数据
        const existingCount = await Record.countDocuments();
        if (existingCount > 0) {
            console.log('数据库中已有数据，跳过迁移');
            process.exit(0);
        }

        // 插入所有记录
        await Record.insertMany(records);
        console.log('数据迁移成功！');
    } catch (error) {
        console.error('数据迁移失败:', error);
    } finally {
        mongoose.disconnect();
    }
}

migrateData();