import axios from "axios";

const PrivateAxios = axios.create({
  baseURL: `${
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV
  }/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Required for sending cookies with requests
});

PrivateAxios.interceptors.request.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized. Possibly invalid or expired session.");
      // Optional: redirect to login or clear local app state
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default PrivateAxios;
