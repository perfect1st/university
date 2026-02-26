import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Stack 
} from '@mui/material';
import LockPersonIcon from '@mui/icons-material/LockPerson'; // Professional restricted icon
import HomeIcon from '@mui/icons-material/Home';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const NoPermissionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        {/* Visual Icon Section */}
        <Box 
          sx={{ 
            bgcolor: 'error.light', 
            borderRadius: '50%', 
            p: 3, 
            mb: 4,
            opacity: 0.8 
          }}
        >
          <LockPersonIcon sx={{ fontSize: 80, color: 'error.main' }} />
        </Box>

        {/* Text Content */}
        <Typography variant="h3" fontWeight="bold" color="text.primary" gutterBottom>
          {t('no_permission.title')}
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ maxWidth: 500, mb: 5, lineHeight: 1.6 }}
        >
          {t('no_permission.description')}
        </Typography>

        {/* Action Buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{ 
              px: 4, 
              py: 1.5, 
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            {t('no_permission.back_home')}
          </Button>

          <Button
            variant="outlined"
            size="large"
            color="secondary"
            startIcon={<SupportAgentIcon />}
            onClick={() => navigate('/support')}
            sx={{ 
              px: 4, 
              py: 1.5, 
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            {t('no_permission.support')}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default NoPermissionPage;