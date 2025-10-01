import baseURL from "../Api/baseURL";
import { getToken } from "./authCookies";



const token = getToken();


export const useInsertData=async(url,params)=>{
    let configInsert={
        headers: {
            Authorization: `Bearer ${token}`,
        },
    
    };
    const res=await baseURL.post(url,params,configInsert);
    return res.data;
}



export const useInsertDataWithImage=async(url,params)=>{
    let configInsert={
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
    
    };
    const res=await baseURL.post(url,params,configInsert);
    return res;
}