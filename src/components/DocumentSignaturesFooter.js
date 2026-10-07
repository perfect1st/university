import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_SEQUENCE_TRANS_BY_TICKET } from '../graphql/supportTicketQueries';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { baseURL } from '../Api/apolloClient';

const DocumentSignaturesFooter = ({ ticketId, compact = false, render }) => {
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

    if (render) {
        return render(approvedSteps);
    }

    return (
        <Box 
            className="document-footer-signatures" 
            sx={{ 
                display: 'flex', 
                flexDirection: 'row',
                justifyContent: 'center', 
                gap: compact ? 0.5 : 4,
                marginTop: compact ? '2px' : '40px', 
                borderTop: compact ? 'none' : '2px solid #000', 
                paddingTop: compact ? '2px' : '20px',
                flexWrap: 'wrap',
                width: '100%'
            }}
        >
            {approvedSteps.map((step) => (
                <Box key={step.id} className="signature-block" sx={{ textAlign: 'center', minWidth: compact ? '60px' : '160px', flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0, fontSize: compact ? '0.55rem' : '1.1rem', lineHeight: 1.2, color: '#000' }}>
                        {step.type_sequence_id?.job_title_id?.name_ar || step.type_sequence_id?.job_title_id?.name_en || 'المسؤول'}
                    </Typography>

                    {step.user_id?.signature ? (
                        <Box sx={{ height: compact ? '22px' : '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', my: compact ? 0.5 : 2 }}>
                            <img
                                src={step.user_id.signature.startsWith('http') ? step.user_id.signature : `${baseURL}${step.user_id.signature.startsWith('/') ? '' : '/'}${step.user_id.signature}`}
                                alt="Signature"
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                        </Box>
                    ) : (
                        <Box sx={{ height: compact ? '22px' : '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: compact ? '0.5rem' : '0.85rem' }}>
                                {t('No Signature')}
                            </Typography>
                        </Box>
                    )}

                    {/* <Typography variant="body1" sx={{ fontWeight: 600, fontSize: compact ? '0.55rem' : '1.1rem', lineHeight: 1.2, color: '#000' }}>
                        {step.user_id?.fullname}
                    </Typography> */}
                </Box>
            ))}
        </Box>
    );
};

export default DocumentSignaturesFooter;
