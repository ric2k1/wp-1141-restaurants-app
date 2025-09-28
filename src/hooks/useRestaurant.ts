import { useContext } from 'react';
import { RestaurantContext } from '../contexts/RestaurantContext';
import type { MenuItem, ComboOption } from '../utils/menuData';

// 定義 Context 的類型
export interface RestaurantContextType {
  // 菜單相關狀態
  menuItems: MenuItem[];
  categories: string[];
  selectedCategory: string;
  selectedItem: MenuItem | ComboOption | null;
  
  // 購物車相關狀態
  cartItems: (MenuItem | ComboOption)[];
  
  // 方法
  setSelectedCategory: (category: string) => void;
  setSelectedItem: (item: MenuItem | ComboOption | null) => void;
  handleCategoryChange: (event: React.SyntheticEvent, newValue: string) => void;
  handleItemSelect: (item: MenuItem | ComboOption) => void;
  handleAddToCart: (item: MenuItem | ComboOption) => void;
  getCurrentItems: () => (MenuItem | ComboOption)[];
}

/**
 * Custom hook to access restaurant context
 * @returns RestaurantContextType - The restaurant context value
 * @throws Error if used outside of RestaurantProvider
 */
export const useRestaurant = (): RestaurantContextType => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
