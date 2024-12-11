import axios from "axios";

const useAxios = () => {
    return axios.create({
        baseURL: "http://localhost:8080",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
}

export default useAxios;