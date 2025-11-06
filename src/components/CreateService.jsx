// src/components/CreateService.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const CreateService = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    budgetType: 'fixed',
    urgency: 'medium',
    location: '',
    preferredDate: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // API base URL
  const API_BASE_URL = 'https://api.watukazi.com/api/v1'; 

  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem('token') || 
           localStorage.getItem('authToken') ||
           sessionStorage.getItem('token') ||
           sessionStorage.getItem('authToken');
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const authToken = getAuthToken();
        
        const response = await axios.get(
          `${API_BASE_URL}/categories`,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`
            },
            timeout: 5000
          }
        );
        
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
          console.log('Found categories:', response.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Geocoding function to convert location text to coordinates
  const geocodeLocation = async (locationText) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}&limit=1`,
        {
          timeout: 5000
        }
      );

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        // Ensure coordinates are valid numbers within ranges
        const latitude = Math.max(-90, Math.min(90, parseFloat(lat)));
        const longitude = Math.max(-180, Math.min(180, parseFloat(lon)));
        
        return {
          latitude: latitude,
          longitude: longitude
        };
      } else {
        console.warn('Location not found, using default coordinates');
        return {
          latitude: -6.7924, // Dar es Salaam latitude
          longitude: 39.2083 // Dar es Salaam longitude
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      return {
        latitude: -6.7924,
        longitude: 39.2083
      };
    }
  };

  // Map urgency levels to deadlines
  const getDeadline = (urgency, preferredDate) => {
    if (!preferredDate) {
      const today = new Date();
      switch (urgency) {
        case 'urgent':
          return new Date(today.setDate(today.getDate() + 1)).toISOString();
        case 'high':
          return new Date(today.setDate(today.getDate() + 3)).toISOString();
        case 'medium':
          return new Date(today.setDate(today.getDate() + 7)).toISOString();
        case 'low':
          return new Date(today.setDate(today.getDate() + 14)).toISOString();
        default:
          return new Date(today.setDate(today.getDate() + 7)).toISOString();
      }
    }

    const preferred = new Date(preferredDate);
    switch (urgency) {
      case 'urgent':
        return new Date(preferred.setDate(preferred.getDate() + 1)).toISOString();
      case 'high':
        return new Date(preferred.setDate(preferred.getDate() + 3)).toISOString();
      case 'medium':
        return new Date(preferred.setDate(preferred.getDate() + 7)).toISOString();
      case 'low':
        return new Date(preferred.setDate(preferred.getDate() + 14)).toISOString();
      default:
        return new Date(preferred.setDate(preferred.getDate() + 7)).toISOString();
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setError('');

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please upload only image files (JPEG, PNG, GIF)');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (validFiles.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setImages(prev => [...prev, ...validFiles]);
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    
    URL.revokeObjectURL(newPreviews[index]);
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Upload images to cloud service
  const uploadImages = async (imageFiles) => {
    const uploadedImageUrls = [];
    
    console.log('Using placeholder images for development');
    for (let i = 0; i < imageFiles.length; i++) {
      uploadedImageUrls.push(`https://picsum.photos/800/600?random=${Date.now()}-${i}`);
    }
    return uploadedImageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check authentication first
    const authToken = getAuthToken();
    if (!authToken) {
      setError('Authentication required. Please log in to create a service.');
      setLoading(false);
      return;
    }

    // Basic validation
    if (!formData.title || !formData.description || !formData.budget || !formData.location || !formData.preferredDate) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      console.log('Starting service creation process...');

      // Step 1: Geocode location to get coordinates
      console.log('Geocoding location:', formData.location);
      const coordinates = await geocodeLocation(formData.location);
      console.log('Coordinates obtained:', coordinates);

      // Validate coordinates are within valid ranges
      if (coordinates.latitude < -90 || coordinates.latitude > 90 || 
          coordinates.longitude < -180 || coordinates.longitude > 180) {
        throw new Error('Invalid coordinates received from geocoding service');
      }

      // Step 2: Upload images if any
      let imageUrls = [];
      if (images.length > 0) {
        console.log('Uploading images...');
        imageUrls = await uploadImages(images);
        console.log('Images uploaded:', imageUrls);
      }

      // Step 3: Prepare the CORRECT request payload according to API requirements
      const payload = {
        type: "client_request", // Must be either "provider_service" or "client_request"
        title: formData.title,
        description: formData.description,
        location: formData.location,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        images: imageUrls,
        tags: [formData.category, formData.budgetType, formData.urgency].filter(Boolean),
        status: "active",
        featured: false,
        clientRequest: {
          budget: parseInt(formData.budget) || 0, // Budget must be inside clientRequest
          budgetType: formData.budgetType,
          urgency: formData.urgency,
          preferredDate: new Date(formData.preferredDate).toISOString(),
          deadline: getDeadline(formData.urgency, formData.preferredDate),
          maxApplications: 15,
          expiresAt: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
        }
      };

      // Only include subcategoryId if we have a valid category selected
      if (formData.category && categories.length > 0) {
        const selectedCategory = categories.find(cat => cat.name === formData.category);
        if (selectedCategory && selectedCategory.id) {
          payload.subcategoryId = selectedCategory.id;
        }
      }

      console.log('Sending payload to API:', payload);
      console.log('API URL:', `${API_BASE_URL}/services`);

      // Step 4: Send request to API
      const response = await axios.post(
        `${API_BASE_URL}/services`, 
        payload, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          timeout: 15000
        }
      );

      console.log('Service created successfully:', response.data);
      
      if (onSuccess) {
        onSuccess(response.data);
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        budget: '',
        budgetType: 'fixed',
        urgency: 'medium',
        location: '',
        preferredDate: ''
      });
      setImages([]);
      setImagePreviews([]);

    } catch (err) {
      console.error('Error creating service:', err);
      
      let errorMessage = 'Failed to create service. Please try again.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to create services.';
      } else if (err.response?.status === 400) {
        // Handle specific validation errors
        const errorData = err.response.data;
        
        if (errorData?.message?.includes('type must be one of')) {
          errorMessage = 'Invalid service type. Please contact support.';
        } else if (errorData?.message?.includes('budget should not exist')) {
          errorMessage = 'Budget configuration error. Please try again.';
        } else if (errorData?.message?.includes('latitude') || errorData?.message?.includes('longitude')) {
          errorMessage = 'Invalid location coordinates. Please try a different location.';
        } else if (errorData?.message?.includes('subcategory')) {
          errorMessage = 'Invalid category selected. Please choose a different category or leave it empty.';
        } else {
          errorMessage = errorData?.message || 'Invalid data provided. Please check your inputs.';
        }
      } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-2xl mx-auto"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Create Service Request</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Need car mechanic"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your service needs in detail..."
            required
          />
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images (Max 5 - Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full"
              disabled={images.length >= 5 || loading}
            />
            <p className="text-sm text-gray-500 mt-2">
              Upload up to 5 images. Supported formats: JPG, PNG, GIF. Max size: 5MB per image.
            </p>
            
            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={loading}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 disabled:bg-gray-400"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type (Optional)
            </label>
            {loadingCategories ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 animate-pulse">
                Loading categories...
              </div>
            ) : (
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category (Optional)</option>
                {categories.map((category) => (
                  <option key={category.id || category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Category selection is optional
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget (TSh) *
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="50000"
              min="0"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Type *
            </label>
            <select
              name="budgetType"
              value={formData.budgetType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="fixed">Fixed</option>
              <option value="negotiable">Negotiable</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency *
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date *
            </label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your location (e.g., Gongolamboto, Dar es Salaam)"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            We'll automatically detect coordinates for your location
          </p>
        </div>

        <div className="flex space-x-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex-1 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Service...' : 'Create Service Request'}
          </button>
          <button
            type="button"
            onClick={() => onSuccess && onSuccess()}
            disabled={loading}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateService;