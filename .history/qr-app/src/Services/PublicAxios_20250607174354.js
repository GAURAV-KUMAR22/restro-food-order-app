import axios from "axios";
const backendUrl =
  import.meta.env.VITE_MODE === "Production"
    ? import.meta.env.VITE_BACKEND_PROD
    : import.meta.env.VITE_BACKEND_DEV;
console.log(backendUrl);
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

export default publicAxios;
