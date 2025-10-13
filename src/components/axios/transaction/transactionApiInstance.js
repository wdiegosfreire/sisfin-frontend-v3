import axios from 'axios'

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_SISFIN_BACKEND_URL_TRANSACTION
});

export default axiosInstance;
