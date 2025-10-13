import axios from 'axios'

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_SISFIN_BACKEND_URL_MAINTENANCE
});

export default axiosInstance;
