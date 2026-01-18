import axios from "axios";
import { baseURL } from "./auth";

export const getPasswordList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/password`, {
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

export const createPassword = async (data: any, token: any) => {
  try {
    const res = await axios.post(`${baseURL}/password/bulk-add`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updatePassword = async (data: any, token: string) => {
  try {
    const res = await axios.patch(`${baseURL}/password/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
