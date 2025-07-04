import axios from "axios";
const publicAxios = axios.create({
  baseURL: `${
    import.meta.env.VITE_MODE === "Production"
      ? import.meta.env.VITE_BACKEND_PROD
      : import.meta.env.VITE_BACKEND_DEV
  }/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log(publicAxios.interceptors);
export default publicAxios;
