import axios from "axios";
import { baseURL } from "./auth";

export const addDomains = async (data: any, token: any) => {
  try {
    const res = await axios.post(`${baseURL}/domain`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getDomainsList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/domain`, {
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

export const updateDomains = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/domain/?uuid=${data.uuid}`,
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

export const deleteDomains = async (uuid: any, token: string) => {
  try {
    const res = await axios.delete(`${baseURL}/domain/?uuid=${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const reorderDomains = async (data: any, token: string) => {
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
