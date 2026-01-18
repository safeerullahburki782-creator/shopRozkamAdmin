import axios from "axios";
import { baseURL } from "./auth";

export const addFaq = async (data: any, token: any) => {
  try {
    const res = await axios.post(`${baseURL}/faq`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getFAqsList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/faq`, {
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

export const updateFaq = async (data: any, token: string) => {
  try {
    const res = await axios.patch(`${baseURL}/faq/?uuid=${data.uuid}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteFaq = async (uuid: any, token: string) => {
  try {
    const res = await axios.delete(`${baseURL}/faq/?uuid=${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const reorderFaq = async (data: any, token: string) => {
  try {
    const res = await axios.patch(`${baseURL}/faq/reorder`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};
