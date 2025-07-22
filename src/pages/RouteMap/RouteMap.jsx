import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

export default function RouteMap({ fromLat, fromLng, toLat, toLng }) {
  const theme = useTheme();
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAGlpOmeTxThm0dIpuEZ4WaZEhQ5IJwEc0', 
  });

  useEffect(() => {
    if (!isLoaded) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: { lat: fromLat, lng: fromLng },
        destination: { lat: toLat, lng: toLng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
        }
      }
    );
  }, [isLoaded, fromLat, fromLng, toLat, toLng]);

  if (!isLoaded) return <Box>Loading Map...</Box>;

  const center = {
    lat: (fromLat + toLat) / 2,
    lng: (fromLng + toLng) / 2,
  };

  return (
    <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        {/* Start Point - Solid Black Square */}
        <Marker
          position={{ lat: fromLat, lng: fromLng }}
          // icon={{
          //   path: 'M -8,-8 8,-8 8,8 -8,8 z',  // Corrected square path
          //   fillColor: '#000000',
          //   fillOpacity: 1,
          //   strokeWeight: 0,
          //   scale: 1.5,  // Increased size for better visibility
          // }}
        />
        
        {/* End Point - Themed Circle */}
        <Marker
          position={{ lat: toLat, lng: toLng }}
          // icon={{
          //   path: window.google.maps.SymbolPath.CIRCLE,
          //   fillColor: theme.palette.primary.main,
          //   fillOpacity: 1,
          //   strokeWeight: 0,
          //   scale: 8,
          // }}
        />
        
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </Box>
  );
}