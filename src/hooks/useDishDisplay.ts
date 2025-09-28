import { useState, useEffect, useCallback } from 'react';
import { useRestaurant } from './useRestaurant';
import { getRandomFoodImage } from '../utils/menuData';
import { ERROR_MESSAGES } from '../utils/constants';

export interface DishDisplayState {
  imageLoading: boolean;
  imageError: boolean;
  showSuccessMessage: boolean;
  currentImage: string;
}

export interface DishDisplayActions {
  handleImageLoad: () => void;
  handleImageError: () => void;
  setShowSuccessMessage: (show: boolean) => void;
}

export interface UseDishDisplayReturn extends DishDisplayState, DishDisplayActions {}

/**
 * Hook for managing dish display functionality including image loading and cart operations
 */
export const useDishDisplay = (): UseDishDisplayReturn => {
  // Local states for dish display
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const { selectedItem } = useRestaurant();

  // Update image when selected item changes
  useEffect(() => {
    if (selectedItem) {
      setImageLoading(true);
      setImageError(false);
      try {
        setCurrentImage(getRandomFoodImage());
      } catch (error) {
        console.error(ERROR_MESSAGES.IMAGE_LOAD_FAILED, error);
        setImageError(true);
        setImageLoading(false);
      }
    }
  }, [selectedItem]);

  // Handle image load events
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    console.error(ERROR_MESSAGES.IMAGE_LOAD_FAILED);
    setImageLoading(false);
    setImageError(true);
  }, []);

  return {
    // State
    imageLoading,
    imageError,
    showSuccessMessage,
    currentImage,
    
    // Actions
    handleImageLoad,
    handleImageError,
    setShowSuccessMessage,
  };
};
