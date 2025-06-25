import axios from "axios";

const baseURL=axios.create({baseURL:"https://osra-market-backend.onrender.com/api"});
 const loggedUser=JSON.parse(localStorage.getItem('user')); 
 const token = localStorage.getItem("reservation_token");

export const config={
    headers:{
        
        // Authorization: token ? `${token}` : "", // Use Bearer token if available
    }
};
export default baseURL;