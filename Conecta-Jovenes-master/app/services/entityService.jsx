import axios from "../utils/axios";
import { getToken } from "./tokenService";

export async function obtenerEntidades() {
  const token = await getToken();
  let url = "/entidades";
  let entidades = [];
  while (url) {
    const {data} = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.data){
        entidades = entidades.concat(data.data)
    }
    url = data.next_page_url ? data.next_page_url.replace(data.path, "") : null;
  }
  return entidades;
}