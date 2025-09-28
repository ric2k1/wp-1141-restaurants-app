import React, { useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import { useRestaurant } from '../hooks/useRestaurant';
import { UI_CONSTANTS, COLORS } from '../utils/constants';
import { getSubmitButtonStyles } from '../utils/styleUtils';
import CartItemComponent from './CartItemComponent';

interface CartListPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmitOrder: () => void;
}

const CartListPopup: React.FC<CartListPopupProps> = ({ open, onClose, onSubmitOrder }) => {
  const { cartItems, updateCartItemQuantity, totalAmount } = useRestaurant();
  
  // 檢查是否所有項目都不可修改
  const allItemsImmutable = useMemo(() => 
    cartItems.length > 0 && cartItems.every(item => item.isImmutable),
    [cartItems]
  );

  // 檢查是否有可送出的項目（數量大於 0 且未送出的項目）
  const hasSubmittableItems = useMemo(() => 
    cartItems.some(item => item.quantity > 0 && !item.isImmutable),
    [cartItems]
  );

  const handleQuantityChange = useCallback((cartItemId: string, newQuantity: number) => {
    updateCartItemQuantity(cartItemId, newQuantity);
  }, [updateCartItemQuantity]);

  const handleSubmitOrder = useCallback(() => {
    onSubmitOrder();
    onClose();
  }, [onSubmitOrder, onClose]);

  return (
    <Dialog
      open={open}
      onClose={() => {}} // 禁用點擊外部關閉
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: UI_CONSTANTS.DIALOG_BORDER_RADIUS,
          boxShadow: UI_CONSTANTS.DIALOG_BOX_SHADOW,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          購物車清單
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        {cartItems.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center', backgroundColor: COLORS.CART_ITEM_BACKGROUND }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
              您的購物車是空的！
            </Typography>
            <Button
              onClick={onClose}
              variant="contained"
              sx={{
                px: 3,
                py: 1,
                fontWeight: 'bold',
              }}
            >
              關閉
            </Button>
          </Paper>
        ) : (
          <List sx={{ width: '100%' }}>
            {cartItems.map((cartItem, index) => (
              <React.Fragment key={cartItem.id}>
                <ListItem sx={{ px: 0 }}>
                  <CartItemComponent
                    cartItem={cartItem}
                    onQuantityChange={handleQuantityChange}
                  />
                </ListItem>
                {index < cartItems.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                總金額: ${totalAmount}
              </Typography>
            </Box>
          </List>
        )}
      </DialogContent>

      {cartItems.length > 0 && (
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            繼續點餐
          </Button>
          <Button
            onClick={handleSubmitOrder}
            variant="contained"
            disabled={allItemsImmutable || !hasSubmittableItems}
            sx={getSubmitButtonStyles(allItemsImmutable || !hasSubmittableItems)}
          >
            送出
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CartListPopup;
