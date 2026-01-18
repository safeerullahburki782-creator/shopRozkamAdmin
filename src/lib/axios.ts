import axios from "axios";

const apiClient = axios.create({
  // baseURL: "http://192.168.200.45:5000",
  baseURL: "http://192.168.18.133:7001",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
