import { useState, useEffect } from 'react';
import { useRestaurant } from './useRestaurant';
import { getRandomFoodImage } from '../utils/menuData';

export interface DishDisplayState {
  imageLoading: boolean;
  imageError: boolean;
  buttonLoading: boolean;
  showSuccessMessage: boolean;
  currentImage: string;
}

export interface DishDisplayActions {
  handleImageLoad: () => void;
  handleImageError: () => void;
  handleAddToCartClick: () => Promise<void>;
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
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const { selectedItem, handleAddToCart } = useRestaurant();

  // Update image when selected item changes
  useEffect(() => {
    if (selectedItem) {
      setImageLoading(true);
      setImageError(false);
      setCurrentImage(getRandomFoodImage());
    }
  }, [selectedItem]);

  // Handle image load events
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Handle add to cart with loading state and success feedback
  const handleAddToCartClick = async () => {
    if (!selectedItem) return;
    
    setButtonLoading(true);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    handleAddToCart(selectedItem);
    setButtonLoading(false);
    setShowSuccessMessage(true);
  };

  return {
    // State
    imageLoading,
    imageError,
    buttonLoading,
    showSuccessMessage,
    currentImage,
    
    // Actions
    handleImageLoad,
    handleImageError,
    handleAddToCartClick,
    setShowSuccessMessage,
  };
};
