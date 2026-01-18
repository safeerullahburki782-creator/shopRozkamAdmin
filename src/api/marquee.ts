import axios from "axios";
import { baseURL } from "./auth";

export const addMarquee = async (data: any, token: any) => {
  try {
    const res = await axios.post(`${baseURL}/marquee/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getMarqueeList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/marquee/`, {
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

export const updateMarquee = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/marquee/?uuid=${data.uuid}`,
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

export const deleteMarquee = async (uuid: any, token: string) => {
  try {
    const res = await axios.delete(`${baseURL}/marquee/?uuid=${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const reorderMarquee = async (data: any, token: string) => {
  try {
    const res = await axios.patch(`${baseURL}/marquee/reorder`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};
