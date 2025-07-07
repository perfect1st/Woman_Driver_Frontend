import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

const Header = ({ title, subtitle, i18n, haveBtn = false, btn, btnIcon, onSubmit }) => {
  const theme = useTheme();
  const isRtl = i18n.language === 'ar';

  return (
    <Box
      component="header"
      sx={{
        direction: isRtl ? 'rtl' : 'ltr',
        display: haveBtn ? 'block': 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
      }}
    >
      {/* Titles */}
      <Box>
        <Typography variant="h6">{title}</Typography>
        {!haveBtn &&<Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
          {subtitle}
        </Typography>}
      </Box>

{haveBtn &&      <Box display="flex" justifyContent={"space-between"}>
      <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
          {subtitle}
        </Typography>
        <Button
          variant="contained"
          endIcon={btnIcon}
          onClick={onSubmit}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
            '& .MuiButton-endIcon': {
              mx: 1,  
            },
          }}
        >
          {btn}
        </Button>

      </Box>}
      

      {/* Optional action button */}
    </Box>
  );
};

export default Header;
