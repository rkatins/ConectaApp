import axios from "../utils/axios";
import { getToken } from "./tokenService";

export async function registroEvento(eventoDatos) {
  try {
    const token = await getToken();
    const { data } = await axios.post("/evento", eventoDatos, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log("Error en registro con token:", error.response?.data || error.message);
    throw error;
  }
}