import axios from "axios";
import { baseURL } from "./auth";

export const addIns = async (data: any, token: any) => {
  try {
    const res = await axios.post(`${baseURL}/instruction`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getInsList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/instruction`, {
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

export const updateIns = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/instruction/?uuid=${data.uuid}`,
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

export const deleteIns = async (uuid: any, token: string) => {
  try {
    const res = await axios.delete(`${baseURL}/instruction/?uuid=${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const reorderIns = async (data: any, token: string) => {
  try {
    const res = await axios.patch(`${baseURL}/instruction/reorder`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};
