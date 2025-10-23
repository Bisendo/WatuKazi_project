// src/services/Authservices.jsx

const API_BASE_URL = 'https://api.watukazi.com/api/v1';

const authService = {
  async sendPasswordResetEmail(identifier) {
    try {
      console.log('🔐 Sending reset request for:', identifier);
      
      // Clean and format the identifier
      let formattedIdentifier = identifier.trim();
      
      // If it's a phone number without country code, add +255 (Tanzania)
      if (/^0\d{9}$/.test(formattedIdentifier)) {
        formattedIdentifier = '+255' + formattedIdentifier.substring(1);
        console.log('📞 Formatted phone number:', formattedIdentifier);
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          identifier: formattedIdentifier
        }),
      });

      console.log('📡 Response status:', response.status);
      
      // Get the response text first to see what we're dealing with
      const responseText = await response.text();
      console.log('📄 Raw response:', responseText);

      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}`);
      }

      // Check if response is not successful
      if (!response.ok) {
        console.error('❌ API Error Response:', responseData);
        
        // Extract meaningful error message
        const errorMessage = responseData.message || 
                            responseData.error || 
                            responseData.details ||
                            `Request failed with status ${response.status}`;
        
        // Provide user-friendly messages
        if (response.status === 404) {
          throw new Error('Mtumiaji hajapatikana. Hakikisha umeweka barua pepe au namba ya simu sahihi.');
        } else if (response.status === 400) {
          throw new Error('Taarifa ulizoingiza si sahihi. Tafadhali angalia tena.');
        } else if (response.status === 429) {
          throw new Error('Umefanya majaribio mengi. Tafadhali subiri kidogo kabla ya kujaribu tena.');
        } else if (response.status === 500) {
          throw new Error('Shida ya server. Tafadhali jaribu tena baadaye.');
        } else {
          throw new Error(errorMessage);
        }
      }

      // If response is ok
      console.log('✅ API Success Response:', responseData);
      return responseData;
      
    } catch (error) {
      console.error('💥 Send OTP error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Shida ya muunganisho wa mtandao. Tafadhali angalia internet yako na ujaribu tena.');
      }
      
      throw error;
    }
  },

  async resetPassword(identifier, otp, newPassword) {
    try {
      console.log('🔄 Resetting password for:', identifier);
      
      // Clean and format the identifier
      let formattedIdentifier = identifier.trim();
      
      // If it's a phone number without country code, add +255 (Tanzania)
      if (/^0\d{9}$/.test(formattedIdentifier)) {
        formattedIdentifier = '+255' + formattedIdentifier.substring(1);
        console.log('📞 Formatted phone number:', formattedIdentifier);
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          identifier: formattedIdentifier,
          otp: otp.toString().trim(), // Ensure OTP is string and trimmed
          newPassword: newPassword.trim()
        }),
      });

      console.log('📡 Reset password response status:', response.status);
      
      // Get the response text first
      const responseText = await response.text();
      console.log('📄 Raw reset response:', responseText);

      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}`);
      }

      // Check if response is not successful
      if (!response.ok) {
        console.error('❌ Reset Password Error Response:', responseData);
        
        // Extract meaningful error message
        const errorMessage = responseData.message || 
                            responseData.error || 
                            responseData.details ||
                            `Request failed with status ${response.status}`;
        
        // Provide user-friendly messages for common reset password errors
        if (response.status === 400) {
          if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('otp')) {
            throw new Error('OTP si sahihi au imekwisha muda. Tafadhali omba OTP mpya.');
          } else if (errorMessage.toLowerCase().includes('password')) {
            throw new Error('Nenosiri si sahihi. Hakikisha lina herufi angalau 6.');
          } else {
            throw new Error('Taarifa ulizoingiza si sahihi. Tafadhali angalia tena.');
          }
        } else if (response.status === 404) {
          throw new Error('Mtumiaji hajapatikana. Tafadhali hakikisha umeweka barua pepe au namba ya simu sahihi.');
        } else if (response.status === 410) {
          throw new Error('OTP imekwisha muda. Tafadhali omba OTP mpya.');
        } else {
          throw new Error(errorMessage);
        }
      }

      // If response is ok
      console.log('✅ Reset password success:', responseData);
      return responseData;
      
    } catch (error) {
      console.error('💥 Reset password error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Shida ya muunganisho wa mtandao. Tafadhali angalia internet yako na ujaribu tena.');
      }
      
      throw error;
    }
  },

  // Optional: Verify OTP before resetting password
  async verifyOtp(identifier, otp) {
    try {
      console.log('🔍 Verifying OTP for:', identifier);
      
      // Clean and format the identifier
      let formattedIdentifier = identifier.trim();
      
      // If it's a phone number without country code, add +255 (Tanzania)
      if (/^0\d{9}$/.test(formattedIdentifier)) {
        formattedIdentifier = '+255' + formattedIdentifier.substring(1);
        console.log('📞 Formatted phone number:', formattedIdentifier);
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          identifier: formattedIdentifier,
          otp: otp.toString().trim()
        }),
      });

      console.log('📡 Verify OTP response status:', response.status);
      
      // Get the response text first
      const responseText = await response.text();
      console.log('📄 Raw verify OTP response:', responseText);

      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}`);
      }

      // Check if response is not successful
      if (!response.ok) {
        console.error('❌ Verify OTP Error Response:', responseData);
        
        // Extract meaningful error message
        const errorMessage = responseData.message || 
                            responseData.error || 
                            responseData.details ||
                            `Request failed with status ${response.status}`;
        
        throw new Error(errorMessage);
      }

      // If response is ok
      console.log('✅ Verify OTP success:', responseData);
      return responseData;
      
    } catch (error) {
      console.error('💥 Verify OTP error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Shida ya muunganisho wa mtandao. Tafadhali angalia internet yako na ujaribu tena.');
      }
      
      throw error;
    }
  },

  // Test API connectivity
  async testConnection() {
    try {
      console.log('🧪 Testing API connection...');
      const response = await fetch(`${API_BASE_URL}/auth/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Connection test status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
};

// Named exports
export const sendPasswordResetEmail = authService.sendPasswordResetEmail;
export const resetPassword = authService.resetPassword;
export const verifyOtp = authService.verifyOtp;
export const testConnection = authService.testConnection;

// Default export
export default authService;