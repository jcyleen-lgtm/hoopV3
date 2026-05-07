import axios from 'axios';

// Ganti dengan URL Google Apps Script lo yang ada di AdminDashboard.jsx tadi
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxH61RwntWOKccbZ2Y24OpD3pN4ya5Rh_Law1955LvMvq_Mns3lT8LINGFXs3mCB06h/exec';

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