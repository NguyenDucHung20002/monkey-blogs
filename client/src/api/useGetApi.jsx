/* eslint-disable react-hooks/rules-of-hooks */
import useSWR from "swr";
import axios from "axios";

const useGetApi = (apiUrl, method, body = {}) => {
  const token = localStorage.getItem("token");
  if (!token) return { error: "token not found" };
  const cacheKey = apiUrl;
  async function fetcher() {
    const response = await axios[`${method.toLowerCase()}`](apiUrl, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.data) return response.data;
  }

  const { data, error } = useSWR(cacheKey, fetcher, {
    refreshInterval: 5000,
  });

  if (!data && error) return { error: "token not found" };

  return { data, error };
};

export default useGetApi;
