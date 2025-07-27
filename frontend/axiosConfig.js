import axios from "axios";
const instance = axios.create({
  baseURL: "https://task-management-system-2v4b.onrender.com",
});
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default instance;
