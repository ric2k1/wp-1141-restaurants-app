/**
 * 購物車相關工具函數
 */

/**
 * 生成唯一的購物車項目 ID
 * @param itemId - 菜品 ID
 * @returns 唯一的購物車項目 ID
 */
export const generateCartItemId = (itemId: string): string => {
  return `${itemId}-${Date.now()}`;
};

/**
 * 從購物車項目 ID 中提取原始菜品 ID
 * @param cartItemId - 購物車項目 ID
 * @returns 原始菜品 ID
 */
export const extractItemIdFromCartId = (cartItemId: string): string => {
  return cartItemId.split('-')[0];
};

/**
 * 計算購物車項目總數
 * @param cartItems - 購物車項目數組
 * @returns 總項目數
 */
export const calculateTotalItems = (cartItems: Array<{ quantity: number }>): number => {
  return cartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
};

/**
 * 計算購物車總金額
 * @param cartItems - 購物車項目數組
 * @returns 總金額
 */
export const calculateTotalAmount = (cartItems: Array<{ quantity: number; item: { price: number } }>): number => {
  return cartItems.reduce((sum, cartItem) => sum + (cartItem.item.price * cartItem.quantity), 0);
};

/**
 * 驗證數量是否有效
 * @param quantity - 數量
 * @returns 是否有效
 */
export const isValidQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity >= 0;
};
