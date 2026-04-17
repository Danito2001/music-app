import axios from "axios";

const baseURL = "/api"

const axiosServer = axios.create({
    baseURL
})

export default axiosServer;
