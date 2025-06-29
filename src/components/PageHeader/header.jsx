import React from 'react';
import Typography from '@mui/material/Typography';

const Header = ({ title, subtitle }) => (
  <header>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
      {subtitle}
    </Typography>
  </header>
);

export default Header;