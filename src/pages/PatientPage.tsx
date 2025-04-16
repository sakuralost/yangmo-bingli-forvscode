import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientForm from '../components/PatientForm';
import { createRecord } from '../services/api';
import type { Record } from '../types';

const PatientPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFormSubmit = async (data: Omit<Record, '_id' | 'createTime' | 'lastDiagnosisTime'>) => {
        try {
            setIsSubmitting(true);
            setError(null);
            await createRecord(data);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : '创建病例失败');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="patient-page">
            <h1>新增病例</h1>
            {error && <div className="error-message">{error}</div>}
            <PatientForm
                onSave={handleFormSubmit}
                onCancel={() => navigate('/')}
                disabled={isSubmitting}
            />
        </div>
    );
};

export default PatientPage;