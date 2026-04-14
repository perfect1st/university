import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { VERIFY_ONLINE_PAYMENT } from '../../graphql/transactionQueries';
import { Box, Typography, Button, Paper, CircularProgress, useTheme } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useTranslation } from 'react-i18next';

export default function SuccessPaymentPage() {
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get('paymentId');
    const navigate = useNavigate();
    const theme = useTheme();
    const { t } = useTranslation();

    const [verifyOnlinePayment, { loading }] = useMutation(VERIFY_ONLINE_PAYMENT);
    const [status, setStatus] = useState('processing');

    useEffect(() => {
        if (paymentId) {
            verifyOnlinePayment({ variables: { paymentId } })
                .then((res) => {
                    const statusStr = res?.data?.verifyOnlinePayment?.myfatoorah_transaction_status;
                    if (statusStr === 'SUCCESS' || statusStr === 'Captured' || statusStr === 'Authorized') {
                        setStatus('success');
                    } else {
                        setStatus('failed');
                    }
                })
                .catch(() => {
                    setStatus('failed');
                });
        } else {
             setStatus('failed');
        }
    }, [paymentId, verifyOnlinePayment]);

    if (loading || status === 'processing') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 15, mb: 15 }}>
                <CircularProgress size={60} sx={{ mb: 3 }} />
                <Typography variant="h6">{t('admissions.verifyingPayment', 'Verifying payment, please wait...')}</Typography>
            </Box>
        );
    }

    if (status === 'success') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: 15 }}>
                <Paper elevation={3} sx={{ p: 5, textAlign: 'center', maxWidth: 500, borderRadius: 3 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 80, color: theme.palette.success?.main || '#4caf50', mb: 2 }} />
                    <Typography variant="h4" gutterBottom>{t('admissions.paymentSuccess', 'Payment Successful')}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        {t('admissions.paymentSuccessDesc', 'Your payment has been successfully processed. Thank you!')}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => navigate('/login')}>
                        {t('admissions.goToLogin', 'Go to Login')}
                    </Button>
                </Paper>
            </Box>
        );
    }

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
