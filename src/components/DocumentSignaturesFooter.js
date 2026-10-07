import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_SEQUENCE_TRANS_BY_TICKET } from '../graphql/supportTicketQueries';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { baseURL } from '../Api/apolloClient';

const DocumentSignaturesFooter = ({ ticketId }) => {
    const { t } = useTranslation();
    const { data, loading } = useQuery(GET_SEQUENCE_TRANS_BY_TICKET, {
        variables: { ticketId },
        fetchPolicy: 'cache-first'
    });

    
    if (loading) return null;

    const approvedSteps = data?.getSupportTicketsSequenceTransByTicket?.filter(
        (step) => step.status === 'approved' || (step.is_approved && step.status !== 'rejected')
    ) || [];

    if (approvedSteps.length === 0) return null;

    return (
        <Box className="document-footer-signatures" sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '50px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
            {approvedSteps.map((step) => (
                <Box key={step.id} className="signature-block" sx={{ textAlign: 'center', width: '200px' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {step.type_sequence_id?.job_title_id?.name_ar || step.type_sequence_id?.job_title_id?.name_en || 'المسؤول'}
                    </Typography>

                    {step.user_id?.signature ? (
                        <img
                            src={step.user_id.signature.startsWith('/') ? `${baseURL}${step.user_id.signature}` : step.user_id.signature}
                            alt="Signature"
                            style={{ width: '150px', height: 'auto', maxHeight: '100px', objectFit: 'contain', margin: '10px auto' }}
                        />
                    ) : (
                        <Box sx={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2" color="textSecondary">
                                {t('No Signature')}
                            </Typography>
                        </Box>
                    )}

                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {step.user_id?.fullname}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default DocumentSignaturesFooter;
