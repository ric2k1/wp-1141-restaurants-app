/**
 * 樣式工具函數
 */
import { COLORS } from './constants';

/**
 * 獲取購物車按鈕的樣式
 * @param isImmutable 是否為不可修改狀態
 * @returns 按鈕樣式對象
 */
export const getCartButtonStyles = (isImmutable: boolean) => ({
  backgroundColor: isImmutable ? COLORS.BUTTON_DISABLED_BACKGROUND : 'primary.main',
  color: 'white',
  '&:hover': {
    backgroundColor: isImmutable ? COLORS.BUTTON_DISABLED_BACKGROUND : 'primary.dark',
  },
  '&:disabled': {
    backgroundColor: COLORS.BUTTON_DISABLED_BACKGROUND,
    color: COLORS.BUTTON_DISABLED_COLOR,
  },
});

/**
 * 獲取購物車項目的樣式
 * @param isImmutable 是否為不可修改狀態
 * @param quantity 項目數量
 * @returns 項目樣式對象
 */
export const getCartItemStyles = (isImmutable: boolean, quantity: number = 1) => ({
  p: 2,
  width: '100%',
  backgroundColor: isImmutable ? COLORS.CART_ITEM_IMMUTABLE_BACKGROUND : COLORS.CART_ITEM_BACKGROUND,
  opacity: isImmutable ? 0.8 : (quantity === 0 ? 0.6 : 1),
  border: isImmutable ? `2px solid ${COLORS.CART_ITEM_IMMUTABLE_BORDER}` : 'none',
});

/**
 * 獲取購物車數量顯示的樣式
 * @param isImmutable 是否為不可修改狀態
 * @returns 數量顯示樣式對象
 */
export const getQuantityDisplayStyles = (isImmutable: boolean) => ({
  minWidth: 40,
  fontWeight: 'bold',
  color: isImmutable ? COLORS.IMMUTABLE_TEXT_COLOR : 'primary.main',
  backgroundColor: 'white',
  borderRadius: 1,
  py: 0.5,
  px: 1,
  border: '2px solid',
  borderColor: isImmutable ? COLORS.IMMUTABLE_BORDER_COLOR : 'primary.light',
  textAlign: 'center',
});

/**
 * 獲取送出按鈕的樣式
 * @param isDisabled 是否禁用
 * @returns 送出按鈕樣式對象
 */
export const getSubmitButtonStyles = (isDisabled: boolean) => ({
  px: 4,
  py: 1,
  fontWeight: 'bold',
  backgroundColor: isDisabled ? COLORS.BUTTON_DISABLED_BACKGROUND : 'primary.main',
  '&:hover': {
    backgroundColor: isDisabled ? COLORS.BUTTON_DISABLED_BACKGROUND : 'primary.dark',
  },
  '&:disabled': {
    backgroundColor: COLORS.BUTTON_DISABLED_BACKGROUND,
    color: COLORS.BUTTON_DISABLED_COLOR,
  },
});
