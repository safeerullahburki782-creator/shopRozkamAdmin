import axios from "axios";
import { baseURL } from "./auth";

export const getEmailsList = async (token: string, filters: any) => {
  const queryParams = new URLSearchParams();
  if (filters.status) queryParams.append("status", filters.status);
  if (filters.username) queryParams.append("username", filters.username);
  if (filters.startDate) queryParams.append("startDate", filters.startDate);
  if (filters.endDate) queryParams.append("endDate", filters.endDate);
  if (filters.orderBy) queryParams.append("orderBy", filters.orderBy);
  
  // ✅ Add page and limit parameters
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());

  const res = await axios.get(`${baseURL}/email?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    },
  });
  return res.data;
};

export const getDuplicateEmailsList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/email/duplicate/all`, {
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

export const getEmailsStats = async (token: string, filters: any) => {
  const queryParams = new URLSearchParams();
  if (filters.startDate) queryParams.append("startDate", filters.startDate);
  if (filters.endDate) queryParams.append("endDate", filters.endDate);

  const res = await axios.get(
    `${baseURL}/email/stats?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    }
  );
  return res.data;
};

export const emailBulkUpdate = async (data: any, token: string) => {
  try {
    const res = await axios.patch(`${baseURL}/email/bulk-update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const emailBulkUpdateUuids = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/email/bulk-update-by-uuids`,
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

export const insertEmails = async (data: any, token: any) => {
  try {
    const res = await axios.post(`${baseURL}/email/bulk-insert`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const searchBulkEmails = async (data: any, token: any) => {
  try {
    const res = await axios.post(`${baseURL}/email/bulk-search`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const deleteBulkEmails = async (data: any, token: any) => {
  try {
    const res = await axios.post(`${baseURL}/email/bulk-delete`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getSupplierList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/supplier/simple-list`, {
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
