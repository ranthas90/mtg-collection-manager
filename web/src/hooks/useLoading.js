import {useContext} from "react";
import LoadingContext from "../contexts/loadingContext";

const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading hook must be used within LoadingProvider");
    }
    return context;
};

export default useLoading;