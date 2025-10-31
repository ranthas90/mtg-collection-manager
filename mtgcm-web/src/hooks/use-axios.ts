import axios from "axios";

export function useAxios() {
  return axios.create({
    baseURL: "http://localhost:8081",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
}
