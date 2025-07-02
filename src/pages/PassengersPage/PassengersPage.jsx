import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Header from '../../components/PageHeader/header';
import FilterComponent from '../../components/FilterComponent/FilterComponent';
import TableComponent from '../../components/TableComponent/TableComponent';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const PassengersPage = () => {
  const theme = useTheme();
  const { t , i18n } = useTranslation()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  // Initial data
  const initialPassengers = [
    {
      id: 1,
      number: 'PAX001',
      name: 'John Doe',
      city: 'New York',
      trips: 12,
      accountStatus: 'Available'
    },
    {
      id: 2,
      number: 'PAX002',
      name: 'Jane Smith',
      city: 'London',
      trips: 8,
      accountStatus: 'Pending'
    },
    {
      id: 3,
      number: 'PAX003',
      name: 'Bob Johnson',
      city: 'Paris',
      trips: 3,
      accountStatus: 'Rejected'
    },
    {
      id: 4,
      number: 'PAX004',
      name: 'Alice Williams',
      city: 'Tokyo',
      trips: 15,
      accountStatus: 'Available'
    },
    {
      id: 5,
      number: 'PAX005',
      name: 'Charlie Brown',
      city: 'Berlin',
      trips: 7,
      accountStatus: 'Pending'
    }
  ];

  const [cities, setCities] = useState([
    { _id: "1", name: "New York" },
    { _id: "2", name: "London" },
    { _id: "3", name: "Paris" },
    { _id: "4", name: "Tokyo" },
    { _id: "5", name: "Berlin" },
  ]);
  const statusOptions = ["Available", "Pending", "Rejected"];
  const handleSearch = (filters) => {
    // filters will contain:
    //   keyword: search term
    //   city: city ID (e.g. '1')
    //   status: status string (e.g. 'Available')

    console.log("Search filters:", filters);
    // Make API call with these filters
  };

  // State management
  const [passengers, setPassengers] = useState(initialPassengers);
  const [filteredPassengers, setFilteredPassengers] = useState(initialPassengers);
  
  // Table columns configuration
  const tableColumns = [
    { key: 'number', label: t('Rider ID') },
    { key: 'name', label: t('Rider name') },
    { key: 'city', label: t('City') },
    { key: 'trips', label: t('Trips number') },
    { key: 'accountStatus', label: t('Account status') }
  ];

  // Handle search/filter
  // const handleSearch = (filters) => {
  //   const filtered = passengers.filter(passenger => {
  //     const matchesSearch = !filters.search || 
  //       passenger.name.toLowerCase().includes(filters.search.toLowerCase()) || 
  //       passenger.number.toLowerCase().includes(filters.search.toLowerCase());
      
  //     const matchesCity = !filters.city || passenger.city === filters.city;
  //     const matchesStatus = !filters.status || passenger.accountStatus === filters.status;
      
  //     return matchesSearch && matchesCity && matchesStatus;
  //   });
    
  //   setFilteredPassengers(filtered);
  // };

  // Handle status changes
  const handleStatusChange = (row, newStatus) => {
    const updatedPassengers = passengers.map(p => 
      p.id === row.id ? {...p, accountStatus: newStatus} : p
    );
    
    setPassengers(updatedPassengers);
    setFilteredPassengers(updatedPassengers);
    console.log(`Status changed for ${row.name} to ${newStatus}`);
  };

  // Handle view details
  const handleViewDetails = (row) => {
    // console.log('View details for:', row);
    navigate(`/riderDetails/${row.id}`);
    // alert(`Showing details for: ${row.name}\nID: ${row.id}\nStatus: ${row.accountStatus}`);
  };

  // Prevent horizontal scrolling on the entire page
  useEffect(() => {
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    
    return () => {
      document.documentElement.style.overflowX = 'auto';
      document.body.style.overflowX = 'auto';
    };
  }, []);

  return (
    <Box 
      component="main"
      sx={{ 
        p: isSmallScreen ? 2 : 3,
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
    >
      {/* Header Section */}
      <Box sx={{ 
        width: '100%',
        flexShrink: 0,
      }}>
        <Header 
          title={t('Rider')} 
          subtitle={t('Riders Details')}
          i18n={i18n}
        />
      </Box>
      
      {/* Filter Section */}
      <Box sx={{ 
        width: '100%',
        flexShrink: 0,
        my: 2,
      }}>
        <FilterComponent 
          onSearch={handleSearch}
          cityOptions={cities}
          statusOptions={statusOptions}
        />
      </Box>
      
      {/* Table Section - Flexible container */}
      <Box sx={{ 
        flex: 1,
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}>
        <Box sx={{ 
          flex: 1,
          minHeight: 0,
          width: '100%',
          overflow: 'auto',
          // border: '1px solid #e0e0e0',
          borderRadius: 1,
          boxShadow: 1,
          '&::-webkit-scrollbar': {
            height: '6px',
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.grey[400],
            borderRadius: '4px',
          },
        }}>
          <TableComponent 
            columns={tableColumns}
            data={filteredPassengers}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PassengersPage;