import baseURL, { config } from "../Api/baseURL";

export const useDeleteData=async(url,params)=>{
    const res=await baseURL.delete(url,config,params);
    return res.data;
}