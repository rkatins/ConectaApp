import axios from "../utils/axios";
import { getToken } from "./tokenService";

export async function obtenerCategorias() {
  const token = await getToken();
  let url = "/categorias";
  let categorias = [];
  while (url) {
    const {data} = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (data.data){
        categorias = categorias.concat(data.data)
    }
    url = data.next_page_url ? data.next_page_url.replace(data.path, "") : null;
  }
  return categorias;
}