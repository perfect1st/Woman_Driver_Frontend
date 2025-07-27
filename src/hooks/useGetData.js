import baseURL, { config } from "../Api/baseURL";



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
    },
  };

  const res = await baseURL.get(url, tokenConfig);
  return res.data;
};
