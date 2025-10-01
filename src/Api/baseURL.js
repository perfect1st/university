import axios from "axios";

const baseURL=axios.create({baseURL:"http://178.128.38.212:3000/api"});

export const config={
    headers:{
        Accept: "application/json",
        // Authorization: token ? `${token}` : "", // Use Bearer token if available
    }
};
export default baseURL;