

import React, { useEffect } from 'react';
import { Box, useMediaQuery, useTheme, Typography } from '@mui/material';
import Header from '../../components/PageHeader/header';
import FilterComponent from '../../components/FilterComponent/FilterComponent';
import TableComponent from '../../components/TableComponent/TableComponent';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPassengers } from '../../redux/slices/passenger/thunk';
import PaginationFooter from '../PaginationFooter/PaginationFooter';
import LoadingPage from '../../components/LoadingComponent';

const PassengersPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const keyword = searchParams.get('keyword') || '';
  const status = searchParams.get('status') || '';

  const { passengers = {}, loading } = useSelector((state) => state.passenger);
  const { users = [], currentPage = 1, totalPages = 1, totalUsers = 0 } = passengers;

  console.log("loading",loading)
  useEffect(() => {
    const query = `page=${page}&limit=${limit}` +
                  (keyword ? `&keyword=${keyword}` : '') +
                  (status ? `&status=${status}` : '');
    dispatch(getAllPassengers({ query }));
  }, [dispatch, page, limit, status, keyword]);

  const updateParams = (updates) => {
    const params = Object.fromEntries(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params[key] = value;
      else delete params[key];
    });
    setSearchParams(params);
  };

  const handleSearch = (filters) => updateParams({ ...filters, page: 1 });
  const handleLimitChange = (e) => updateParams({ limit: e.target.value, page: 1 });
  const handlePageChange = (_, value) => updateParams({ page: value });

  const rows = users.map((u) => ({
    id: u._id,
    riderId: u._id.slice(-6).toUpperCase(),
    name: u.fullname,
    phone: u.phone_number,
    rate: u.rate || 'N/A',
    trips: u.trips || 0,
    accountStatus:
      u.status === 'active' ? 'Available' : u.status === 'pending' ? 'Pending' : 'Rejected',
  }));

  const columns = [
    { key: 'riderId', label: t('Rider ID') },
    { key: 'name', label: t('Rider name') },
    { key: 'phone', label: t('Phone Number') },
    { key: 'rate', label: t('Rate') },
    { key: 'trips', label: t('Trips number') },
    { key: 'accountStatus', label: t('Account Status') },
  ];

  useEffect(() => {
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    return () => {
      document.documentElement.style.overflowX = 'auto';
      document.body.style.overflowX = 'auto';
    };
  }, []);

  useEffect(() => {
    if (loading) {

    window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [loading]);
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <Box
      component="main"
      sx={{
        p: isSmall ? 2 : 3,
        width: '100%',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header
        title={t('Rider')}
        subtitle={t('Riders Details')}
        i18n={i18n}
        isExcel
        isPdf
        isPrinter
      />

      <Box sx={{ my: 2 }}>
        <FilterComponent
          onSearch={handleSearch}
          initialFilters={{ keyword, status }}
          statusOptions={['Available', 'Pending', 'Rejected']}
        />
      </Box>

      <TableComponent
        columns={columns}
        data={rows}
        onViewDetails={(r) => navigate(`/riderDetails/${r.id}`)}
        loading={loading}
        sx={{ flex: 1, overflow: 'auto', boxShadow: 1, borderRadius: 1 }}
      />

      <PaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </Box>
  );
};

export default PassengersPage;
