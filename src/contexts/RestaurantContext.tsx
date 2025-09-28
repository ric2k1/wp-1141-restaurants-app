import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  parseMenuData, 
  getCategories, 
  getItemsByCategory, 
  comboOptions, 
  type MenuItem,
  type ComboOption 
} from '../utils/menuData';

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

// 創建 Context
export const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

// Provider 組件
interface RestaurantProviderProps {
  children: ReactNode;
}

export const RestaurantProvider: React.FC<RestaurantProviderProps> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('前菜');
  const [selectedItem, setSelectedItem] = useState<MenuItem | ComboOption | null>(null);
  const [cartItems, setCartItems] = useState<(MenuItem | ComboOption)[]>([]);

  // 載入菜單數據
  useEffect(() => {
    fetch('/data/dish-data.csv')
      .then(response => response.text())
      .then(csvText => {
        const items = parseMenuData(csvText);
        setMenuItems(items);
        setCategories(getCategories(items));
        
        // 自動選擇前菜分類的第一個項目
        const appetizerItems = getItemsByCategory(items, '前菜');
        if (appetizerItems.length > 0) {
          setSelectedItem(appetizerItems[0]);
        }
      })
      .catch(error => {
        console.error('載入菜單數據失敗:', error);
      });
  }, []);

  // 獲取當前分類的項目
  const getCurrentItems = (): (MenuItem | ComboOption)[] => {
    if (selectedCategory === '套餐組合') {
      return comboOptions;
    }
    return getItemsByCategory(menuItems, selectedCategory);
  };

  // 處理分類選擇
  const handleCategoryChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
    
    // 獲取新分類的第一個項目
    const currentItems = newValue === '套餐組合' ? comboOptions : getItemsByCategory(menuItems, newValue);
    if (currentItems.length > 0) {
      setSelectedItem(currentItems[0]);
    } else {
      setSelectedItem(null);
    }
  };

  // 處理項目選擇
  const handleItemSelect = (item: MenuItem | ComboOption) => {
    setSelectedItem(item);
  };

  // 添加到購物車
  const handleAddToCart = (item: MenuItem | ComboOption) => {
    setCartItems(prev => [...prev, item]);
  };

  const value: RestaurantContextType = {
    menuItems,
    categories,
    selectedCategory,
    selectedItem,
    cartItems,
    setSelectedCategory,
    setSelectedItem,
    handleCategoryChange,
    handleItemSelect,
    handleAddToCart,
    getCurrentItems,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

