import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Header = ({ title, subtitle, i18n }) => (
  <Box
    component="header"
    sx={{
      direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
      p: 4,
    }}
  >
    <Typography variant="h6">{title}</Typography>
    <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
      {subtitle}
    </Typography>
  </Box>
);

export default Header;
