import axios from "axios";

const baseURL=axios.create({baseURL:"https://uas.edu.ye/api"});

export const config={
    headers:{
        Accept: "application/json",
        // Authorization: token ? `${token}` : "", // Use Bearer token if available
    }
};
export default baseURL;