import baseURL, { config } from "../Api/baseURL";

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

export const useGetData = async (url, params) => {
  const res = await baseURL.get(url, config); // No token for this request
  return res.data;
};

export const useGetDataToken = async (url, params) => {
  // Clone the existing config and add the token
  const tokenConfig = {
    ...config,
    headers: {
      ...config.headers,
      reservation_token: getToken(), 
    },
  };

  const res = await baseURL.get(url, tokenConfig);
  return res.data;
};
