
import React from 'react';
import { Grid, Box, Typography, TextField, Button, Link, useTheme } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import logo from '../../assets/Logo.png';

const LoginPage = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup.string().required(t('validation.usernameRequired')),
      password: Yup.string().min(6, t('validation.passwordMin')).required(t('validation.passwordRequired'))
    }),
    onSubmit: (values) => {
      // handle login
      console.log('Logging in:', values);
    }
  });

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box component="img" src={logo} alt="Logo" sx={{ width: 120, mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          {t('intro.title')}
        </Typography>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {t('intro.highlight')}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {t('intro.welcome')}
        </Typography>
        <Typography variant="body2" align="center">
          {t('intro.description')}
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        md={8}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ maxWidth: 600}}>
  <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
    {t('form.login')}
  </Typography>

  {/* Username Label */}
  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
    {t('form.username')}
  </Typography>
  <TextField
    fullWidth
    id="username"
    name="username"
    placeholder={t('form.usernamePlaceholder')}
    value={formik.values.username}
    onChange={formik.handleChange}
    error={formik.touched.username && Boolean(formik.errors.username)}
    helperText={formik.touched.username && formik.errors.username}
    margin="none"
    variant="outlined"
    sx={{ mb: 3 }}
  />

  {/* Password Label */}
  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
    {t('form.password')}
  </Typography>
  <TextField
    fullWidth
    id="password"
    name="password"
    type="password"
    placeholder={t('form.passwordPlaceholder')}
    value={formik.values.password}
    onChange={formik.handleChange}
    error={formik.touched.password && Boolean(formik.errors.password)}
    helperText={formik.touched.password && formik.errors.password}
    margin="none"
    variant="outlined"
    sx={{ mb: 4 }}
  />

  <Button type="submit" variant="contained" fullWidth sx={{ mt: 1, mb: 2, py: 1.5 }}>
    {t('form.loginButton')}
  </Button>

  <Link href="#" variant="body2" underline="hover" sx={{ display: 'block', textAlign: 'center' }}>
    {t('form.forgotPassword')}
  </Link>
</Box>

      </Grid>
    </Grid>
  );
};

export default LoginPage;


