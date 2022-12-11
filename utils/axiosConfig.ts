import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.DOMAIN_ROOT,
    withCredentials: true,
});

if (process.env.API_SECRET != undefined) {
    axiosInstance.defaults.headers.common['WWW-Authorization'] = process.env.API_SECRET
}

export default axiosInstance;