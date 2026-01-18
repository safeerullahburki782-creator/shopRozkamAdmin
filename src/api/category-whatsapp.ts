import axios from "axios";
import { baseURL } from "./auth";

export const addCategoryWhatsapp = async (data: any, token: any) => {
  try {
    const res = await axios.post(`${baseURL}/category-whatsapp`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getCategoryWhatsapp = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/category-whatsapp`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateCategoryWhatsapp = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/category-whatsapp?uuid=${data.uuid}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategoryWhatsapp = async (uuid: any, token: string) => {
  try {
    const res = await axios.delete(
      `${baseURL}/category-whatsapp?uuid=${uuid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};
