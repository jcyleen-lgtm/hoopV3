import axios from 'axios';

// Ganti dengan URL Google Apps Script lo yang ada di AdminDashboard.jsx tadi
const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;

export const getRekapan = async (params) => {
  try {
    // Vite dan Axios jauh lebih rapi dibanding JSONP
    const response = await axios.get(SCRIPT_URL, {
      params: {
        action: 'getRekapan',
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error("Gagal ambil data:", error);
    throw error;
  }
};