import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

export default function RouteMap({ fromLat, fromLng, toLat, toLng }) {
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAGlpOmeTxThm0dIpuEZ4WaZEhQ5IJwEc0', // 🔥 Replace with your key
  });

  useEffect(() => {
    if (isLoaded) {
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
    }
  }, [isLoaded, fromLat, fromLng, toLat, toLng]);

  if (!isLoaded) return <Box>Loading Map...</Box>;

  return (
    <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: (fromLat + toLat) / 2, lng: (fromLng + toLng) / 2 }}
        zoom={13}
      >
        {!directions && (
          <>
            <Marker position={{ lat: fromLat, lng: fromLng }} label="A" />
            <Marker position={{ lat: toLat, lng: toLng }} label="B" />
          </>
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </Box>
  );
}
