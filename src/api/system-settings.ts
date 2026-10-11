import axios from "axios";
import { baseURL } from "./auth";

export const getEmailReward = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/system-setting/email-reward`, {
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

export const addEmailReward = async (data: any, token: any) => {
  try {
    const res = await axios.post(
      `${baseURL}/system-setting/email-reward`,
      data,
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

export const updateEmailReward = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/system-setting/email-reward`,
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

// withdraw thershold
export const getWithdrawThreshold = async (token: string) => {
  try {
    const res = await axios.get(
      `${baseURL}/system-setting/withdrawal-threshold`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const addWithdrawThreshold = async (data: any, token: any) => {
  try {
    const res = await axios.post(
      `${baseURL}/system-setting/withdrawal-threshold`,
      data,
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

export const updateWithdrawThreshold = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/system-setting/withdrawal-threshold`,
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

// signup bonus
export const getSignupBonus = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/system-setting/signup-bonus`, {
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

export const addSignupBonus = async (data: any, token: any) => {
  try {
    const res = await axios.post(
      `${baseURL}/system-setting/signup-bonus`,
      data,
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

export const updateSignupBonus = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/system-setting/signup-bonus`,
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

// referral bonus
export const getReferralBonus = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/system-setting/referral-bonus`, {
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

export const addReferralBonus = async (data: any, token: any) => {
  try {
    const res = await axios.post(
      `${baseURL}/system-setting/referral-bonus`,
      data,
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

export const updateReferralBonus = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/system-setting/referral-bonus`,
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

// thresold per day
export const getThresoldPerDay = async (token: string) => {
  try {
    const res = await axios.get(
      `${baseURL}/system-setting/withdrawal-threshold-per-day`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const addThresoldPerDay = async (data: any, token: any) => {
  try {
    const res = await axios.post(
      `${baseURL}/system-setting/withdrawal-threshold-per-day`,
      data,
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

export const updateThresoldPerDay = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/system-setting/withdrawal-threshold-per-day`,
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

// thresold per week
export const getThresoldPerWeek = async (token: string) => {
  try {
    const res = await axios.get(
      `${baseURL}/system-setting/withdrawal-threshold-per-week`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const addThresoldPerWeek = async (data: any, token: any) => {
  try {
    const res = await axios.post(
      `${baseURL}/system-setting/withdrawal-threshold-per-week`,
      data,
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

export const updateThresoldPerWeek = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/system-setting/withdrawal-threshold-per-week`,
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

//  referral bonus per email
export const getReferralBonusPerEmail = async (token: string) => {
  try {
    const res = await axios.get(
      `${baseURL}/system-setting/referral-bonus-per-email`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // "ngrok-skip-browser-warning": "true",
        },
      }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const addReferralBonusPerEmail = async (data: any, token: any) => {
  try {
    const res = await axios.post(
      `${baseURL}/system-setting/referral-bonus-per-email`,
      data,
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

export const updateReferralBonusPerEmail = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/system-setting/referral-bonus-per-email`,
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

// email submission (disable/enable user email submission)
// Throws so a failed refetch keeps the last loaded setting instead of replacing it
export const getEmailSubmissionSetting = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/system-setting/email-submission`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateEmailSubmissionSetting = async (
  data: any,
  token: string
) => {
  try {
    const res = await axios.patch(
      `${baseURL}/system-setting/email-submission`,
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
