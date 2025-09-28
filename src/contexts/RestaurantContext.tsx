import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { 
  parseMenuData, 
  getCategories, 
  getItemsByCategory, 
  type MenuItem
} from '../utils/menuData';
import { 
  generateCartItemId, 
  extractItemIdFromCartId, 
  calculateTotalItems, 
  calculateTotalAmount,
  isValidQuantity 
} from '../utils/cartUtils';
import { DEFAULT_VALUES, ERROR_MESSAGES } from '../utils/constants';

// 購物車項目類型
export interface CartItem {
  id: string; // 唯一 ID
  item: MenuItem;
  quantity: number;
}

// 定義 Context 的類型
export interface RestaurantContextType {
  // 菜單相關狀態
  menuItems: MenuItem[];
  categories: string[];
  selectedCategory: string;
  selectedItem: MenuItem | null;
  
  // 購物車相關狀態
  cartItems: CartItem[];
  totalItems: number;
  totalAmount: number;
  
  // 方法
  setSelectedCategory: (category: string) => void;
  setSelectedItem: (item: MenuItem | null) => void;
  handleCategoryChange: (event: React.SyntheticEvent, newValue: string) => void;
  handleItemSelect: (item: MenuItem) => void;
  handleAddToCart: (item: MenuItem) => string;
  updateCartItemQuantity: (cartItemId: string, quantity: number, item?: MenuItem) => void;
  removeCartItem: (cartItemId: string) => void;
  getCurrentItems: () => MenuItem[];
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
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_VALUES.INITIAL_CATEGORY);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 載入菜單數據
  useEffect(() => {
    fetch('/data/dish-data.csv')
      .then(response => response.text())
      .then(csvText => {
        const items = parseMenuData(csvText);
        setMenuItems(items);
        setCategories(getCategories(items));
        
        // 自動選擇前菜分類的第一個項目
        const appetizerItems = getItemsByCategory(items, DEFAULT_VALUES.INITIAL_CATEGORY);
        if (appetizerItems.length > 0) {
          setSelectedItem(appetizerItems[0]);
        }
      })
      .catch(error => {
        console.error(ERROR_MESSAGES.MENU_LOAD_FAILED, error);
      });
  }, []);

  // 獲取當前分類的項目
  const getCurrentItems = (): MenuItem[] => {
    return getItemsByCategory(menuItems, selectedCategory);
  };

  // 處理分類選擇
  const handleCategoryChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
    
    // 獲取新分類的第一個項目
    const currentItems = getItemsByCategory(menuItems, newValue);
    if (currentItems.length > 0) {
      setSelectedItem(currentItems[0]);
    } else {
      setSelectedItem(null);
    }
  };

  // 處理項目選擇
  const handleItemSelect = (item: MenuItem) => {
    setSelectedItem(item);
  };

  // 使用 useMemo 優化計算
  const totalItems = useMemo(() => calculateTotalItems(cartItems), [cartItems]);
  const totalAmount = useMemo(() => calculateTotalAmount(cartItems), [cartItems]);

  // 添加到購物車 - 每次都創建新的購物車項目
  const handleAddToCart = useCallback((item: MenuItem): string => {
    const cartItemId = generateCartItemId(item.id);
    setCartItems(prev => [...prev, { id: cartItemId, item, quantity: DEFAULT_VALUES.INITIAL_QUANTITY }]);
    return cartItemId;
  }, []);

  // 更新購物車項目數量
  const updateCartItemQuantity = useCallback((cartItemId: string, quantity: number, item?: MenuItem) => {
    // 驗證數量
    if (!isValidQuantity(quantity)) {
      console.error(ERROR_MESSAGES.INVALID_QUANTITY, quantity);
      return;
    }

    setCartItems(prev => {
      if (quantity <= 0) {
        return prev.filter(cartItem => cartItem.id !== cartItemId);
      } else {
        const existingItem = prev.find(cartItem => cartItem.id === cartItemId);
        
        if (existingItem) {
          // 更新現有項目
          return prev.map(cartItem =>
            cartItem.id === cartItemId
              ? { ...cartItem, quantity }
              : cartItem
          );
        } else if (item) {
          // 添加新項目（如果提供了 item 參數）
          return [...prev, { id: cartItemId, item, quantity }];
        } else {
          // 嘗試從 cartItemId 中提取 itemId 並重新創建
          const itemId = extractItemIdFromCartId(cartItemId);
          const foundItem = menuItems.find(i => i.id === itemId);
          
          if (foundItem) {
            return [...prev, { id: cartItemId, item: foundItem, quantity }];
          }
          return prev;
        }
      }
    });
  }, [menuItems]);

  // 移除購物車項目
  const removeCartItem = useCallback((cartItemId: string) => {
    setCartItems(prev => prev.filter(cartItem => cartItem.id !== cartItemId));
  }, []);

  const value: RestaurantContextType = {
    menuItems,
    categories,
    selectedCategory,
    selectedItem,
    cartItems,
    totalItems,
    totalAmount,
    setSelectedCategory,
    setSelectedItem,
    handleCategoryChange,
    handleItemSelect,
    handleAddToCart,
    updateCartItemQuantity,
    removeCartItem,
    getCurrentItems,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

