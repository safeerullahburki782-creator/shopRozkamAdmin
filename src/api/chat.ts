import axios from "axios";
import { baseURL } from "./auth";

export const getUsersList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/chat/users`, {
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

export const getMessages = async (uuid: any, token: string) => {
  try {
    const res = await axios.get(`${baseURL}/chat/messages?uuid=${uuid}`, {
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

export const markAllAsRead = async (data: any, token: string) => {
  try {
    const res = await axios.post(
      `${baseURL}/chat/mark-as-read?uuid=${data.uuid}`,
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
