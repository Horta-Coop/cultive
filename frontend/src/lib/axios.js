import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://scaling-umbrella-p44jxqp7wxrf94gj-4000.app.github.dev/api",
  withCredentials: true,
});

export default axiosInstance;