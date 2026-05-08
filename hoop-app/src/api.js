import axios from 'axios';

// Ganti dengan URL Google Apps Script lo yang ada di AdminDashboard.jsx tadi
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyrk91DSCO3exG4DzaS4BpNdX_sQvQT04o8LowrjnU/dev';

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