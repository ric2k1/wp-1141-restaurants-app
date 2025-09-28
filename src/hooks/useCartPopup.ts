import { useState, useEffect, useCallback } from 'react';
import { useRestaurant } from './useRestaurant';
import type { MenuItem, ComboOption } from '../utils/menuData';
import { isValidQuantity } from '../utils/cartUtils';
import { DEFAULT_VALUES } from '../utils/constants';

export interface UseCartPopupProps {
  open: boolean;
  item: MenuItem | ComboOption;
  cartItemId: string;
  onClose: () => void;
}

export interface UseCartPopupReturn {
  quantity: number;
  handleQuantityChange: (newQuantity: number) => void;
  handleConfirm: () => void;
  handleCancel: () => void;
}

/**
 * Hook for managing cart popup functionality
 */
export const useCartPopup = ({ 
  open, 
  item, 
  cartItemId, 
  onClose 
}: UseCartPopupProps): UseCartPopupReturn => {
  const { updateCartItemQuantity, removeCartItem } = useRestaurant();
  const [quantity, setQuantity] = useState<number>(DEFAULT_VALUES.INITIAL_QUANTITY);

  // 當彈出視窗打開時，重置數量為初始值
  useEffect(() => {
    if (open) {
      setQuantity(DEFAULT_VALUES.INITIAL_QUANTITY);
      // 確保購物車中有這個項目
      updateCartItemQuantity(cartItemId, DEFAULT_VALUES.INITIAL_QUANTITY, item);
    }
  }, [open, cartItemId, updateCartItemQuantity, item]);

  const handleQuantityChange = useCallback((newQuantity: number) => {
    if (isValidQuantity(newQuantity)) {
      setQuantity(newQuantity);
      // 直接調用更新函數，不依賴 useEffect
      updateCartItemQuantity(cartItemId, newQuantity, item);
    }
  }, [cartItemId, updateCartItemQuantity, item]);

  const handleConfirm = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleCancel = useCallback(() => {
    // 移除當前購物車項目
    removeCartItem(cartItemId);
    onClose();
  }, [cartItemId, removeCartItem, onClose]);

  return {
    quantity,
    handleQuantityChange,
    handleConfirm,
    handleCancel,
  };
};
