import React from 'react';
import { Box, Typography, Button, Paper, useTheme } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function FailedPaymentPage() {
    const navigate = useNavigate();
    const theme = useTheme();
    const { t } = useTranslation();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 15 }}>
            <Paper elevation={3} sx={{ p: 5, textAlign: 'center', maxWidth: 500, borderRadius: 3 }}>
                <ErrorOutlineIcon sx={{ fontSize: 80, color: theme.palette.error?.main || '#f44336', mb: 2 }} />
                <Typography variant="h4" gutterBottom>{t('admissions.paymentFailed', 'Payment Failed')}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    {t('admissions.paymentFailedDesc', 'There was an issue processing your payment. Please try again.')}
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
                    {t('admissions.goToLogin', 'Go to Login')}
                </Button>
            </Paper>
        </Box>
    );
}
