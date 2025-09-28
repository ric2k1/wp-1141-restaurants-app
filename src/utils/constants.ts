/**
 * 應用程式常數
 */

// UI 相關常數
export const UI_CONSTANTS = {
  SNACKBAR_AUTO_HIDE_DURATION: 2000,
  DIALOG_BORDER_RADIUS: 3,
  DIALOG_BOX_SHADOW: '0 8px 32px rgba(0,0,0,0.12)',
} as const;

// 預設值
export const DEFAULT_VALUES = {
  INITIAL_QUANTITY: 1,
  INITIAL_CATEGORY: '前菜',
} as const;

// 錯誤訊息
export const ERROR_MESSAGES = {
  IMAGE_LOAD_FAILED: '圖片載入失敗',
  MENU_LOAD_FAILED: '載入菜單數據失敗',
  INVALID_QUANTITY: '數量必須為非負整數',
} as const;

// 成功訊息
export const SUCCESS_MESSAGES = {
  ITEM_ADDED_TO_CART: '已加入購物車！',
} as const;
