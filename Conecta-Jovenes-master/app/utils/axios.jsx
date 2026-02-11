import axiosLib from "axios";
import { getToken } from "../services/tokenService";
const axios = axiosLib.create({
    
    baseURL:"https://hackathon.lausnchez.es/api/v1",
    headers:{
        Accept:"application/json",
    },
});
//http://10.0.2.2:8000/api/v1
//https://hackathon.lausnchez.es/api/v1
axios.interceptors.request.use(async(res)=>{
    const token = await getToken();

    if(token !==null){
        res.headers["Authorization"]=`Bearer ${token}`;
    }

    return res;
})

export default axios;