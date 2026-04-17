import axios from "axios";

const baseURL = "https://api.deezer.com"

const axiosServer = axios.create({
    baseURL
})

export default axiosServer;




