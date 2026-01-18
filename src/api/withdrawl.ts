import axios from "axios";
import { baseURL } from "./auth";

export const getWithdrawlsStats = async (token: string, filters: any) => {
  const queryParams = new URLSearchParams();
  if (filters.startDate) queryParams.append("startDate", filters.startDate);
  if (filters.endDate) queryParams.append("endDate", filters.endDate);

  const res = await axios.get(
    `${baseURL}/withdrawal/stats?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
  return res.data;
};

export const getAllWithdrawls = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/withdrawal/all`, {
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

export const withdrawlUpdate = async (data: any, token: string) => {
  try {
    const res = await axios.patch(`${baseURL}/withdrawal/handle`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const withdrawlBonusUpdate = async (data: any, token: string) => {
  try {
    const res = await axios.patch(`${baseURL}/withdrawal/bonus`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const withdrawlReferralBonusUpdate = async (
  data: any,
  token: string
) => {
  try {
    const res = await axios.patch(
      `${baseURL}/withdrawal/handle-referral-bonus-withdrawal`,
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

export const getAllWithdrawlsBonus = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/withdrawal/bonus/all`, {
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
