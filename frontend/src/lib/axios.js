import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://10.10.10.42:5000/api",
  withCredentials: true,
});

export default axiosInstance;