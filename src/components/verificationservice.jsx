// services/verificationService.js
import axios from "axios";
const API_URL = "https://api.watukazi.com/api/v1";

export const verificationService = {
  verifyOTP: async (identifier, code, token) => {
    if (!code || code.length < 6) {
      throw new Error("OTP code must be at least 6 characters long");
    }
    if (!identifier) throw new Error("Identifier is required");

    try {
      const payload = { identifier, code };
      const headers = {
        "Content-Type": "application/json",
      };

      // If token is provided, use it. Otherwise, try without token
      if (token && !token.startsWith('temp_')) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.post(`${API_URL}/auth/verify-otp`, payload, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  resendOTP: async (identifier) => {
    if (!identifier) throw new Error("Identifier is required to resend OTP");

    try {
      const payload = { identifier };
      const response = await axios.post(`${API_URL}/auth/send-otp`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};