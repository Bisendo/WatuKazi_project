// src/components/ServicePreferencesModal.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ServicePreferencesModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-md"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Service Preferences
        </h3>
        <p className="text-gray-600 mb-6">
          Set your preferences for service notifications and matching.
        </p>
        
        <div className="space-y-4">
          {/* Add your preference form fields here */}
          <div>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-700">Email notifications for new applications</span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="ml-2 text-sm text-gray-700">SMS notifications for urgent requests</span>
            </label>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onSuccess}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Save Preferences
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ServicePreferencesModal;