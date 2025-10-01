import baseURL from "../Api/baseURL";

export const useUpdateData=async(url,params)=>{
    const res=await baseURL.put(url,params);
    return res.data;
};



export const useUpdateDataWithImage=async(url,params)=>{
    const updateConfig={
        headers: {
            "Content-Type": "multipart/form-data",
          }
    };
    const res=baseURL.put(url,params,updateConfig);
    return res;
}