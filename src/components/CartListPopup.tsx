import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Paper,
  List,
  ListItem,
  Divider,
} from '@mui/material';
import {
  Remove as RemoveIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useRestaurant } from '../hooks/useRestaurant';
import { UI_CONSTANTS } from '../utils/constants';

interface CartListPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmitOrder: () => void;
}

const CartListPopup: React.FC<CartListPopupProps> = ({ open, onClose, onSubmitOrder }) => {
  const { cartItems, updateCartItemQuantity, totalAmount } = useRestaurant();
  
  // 現在所有項目都應該有數量 > 0，因為在打開時已經清理過了
  const visibleCartItems = cartItems;
  
  // 檢查是否所有項目都不可修改
  const allItemsImmutable = cartItems.length > 0 && cartItems.every(item => item.isImmutable);

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    updateCartItemQuantity(cartItemId, newQuantity);
  };

  const handleSubmitOrder = () => {
    onSubmitOrder();
    onClose();
  };

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
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
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
            {visibleCartItems.map((cartItem, index) => (
              <React.Fragment key={cartItem.id}>
                <ListItem sx={{ px: 0 }}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      width: '100%',
                      backgroundColor: cartItem.isImmutable ? '#f0f0f0' : '#f8f9fa',
                      opacity: cartItem.isImmutable ? 0.8 : 1,
                      border: cartItem.isImmutable ? '2px solid #e0e0e0' : 'none',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 'bold',
                              color: cartItem.isImmutable ? 'grey.600' : 'inherit',
                            }}
                          >
                            {cartItem.item.name}
                          </Typography>
                          {cartItem.isImmutable && (
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                backgroundColor: 'grey.400',
                                color: 'white',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontWeight: 'bold',
                              }}
                            >
                              已送出
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                          單價: ${cartItem.item.price}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          小計: ${cartItem.item.price * cartItem.quantity}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          onClick={() => handleQuantityChange(cartItem.id, Math.max(0, cartItem.quantity - 1))}
                          disabled={cartItem.isImmutable}
                          sx={{
                            backgroundColor: cartItem.isImmutable ? 'grey.300' : 'primary.main',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: cartItem.isImmutable ? 'grey.300' : 'primary.dark',
                            },
                            '&:disabled': {
                              backgroundColor: 'grey.300',
                              color: 'grey.500',
                            },
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        
                        <Typography
                          variant="h6"
                          sx={{
                            minWidth: 40,
                            fontWeight: 'bold',
                            color: cartItem.isImmutable ? 'grey.500' : 'primary.main',
                            backgroundColor: 'white',
                            borderRadius: 1,
                            py: 0.5,
                            px: 1,
                            border: '2px solid',
                            borderColor: cartItem.isImmutable ? 'grey.300' : 'primary.light',
                            textAlign: 'center',
                          }}
                        >
                          {cartItem.quantity}
                        </Typography>
                        
                        <IconButton
                          onClick={() => handleQuantityChange(cartItem.id, cartItem.quantity + 1)}
                          disabled={cartItem.isImmutable}
                          sx={{
                            backgroundColor: cartItem.isImmutable ? 'grey.300' : 'primary.main',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: cartItem.isImmutable ? 'grey.300' : 'primary.dark',
                            },
                            '&:disabled': {
                              backgroundColor: 'grey.300',
                              color: 'grey.500',
                            },
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                </ListItem>
                {index < visibleCartItems.length - 1 && <Divider sx={{ my: 1 }} />}
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
            disabled={allItemsImmutable}
            sx={{
              px: 4,
              py: 1,
              fontWeight: 'bold',
              backgroundColor: allItemsImmutable ? 'grey.300' : 'primary.main',
              '&:hover': {
                backgroundColor: allItemsImmutable ? 'grey.300' : 'primary.dark',
              },
              '&:disabled': {
                backgroundColor: 'grey.300',
                color: 'grey.500',
              },
            }}
          >
            送出
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CartListPopup;
