import baseURL from "../Api/baseURL";
const loggedUser=JSON.parse(localStorage.getItem('user')); 



export const useInsertData=async(url,params)=>{
    let configInsert={
        headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
    
    };
    const res=await baseURL.post(url,params,configInsert);
    return res.data;
}



export const useInsertDataWithImage=async(url,params)=>{
    let configInsert={
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${localStorage.getItem("token")}`,
          },
    
    };
    const res=await baseURL.post(url,params,configInsert);
    return res;
}