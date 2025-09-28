import React, { useCallback } from 'react';
import {
  Typography,
  Box,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Remove as RemoveIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import type { CartItem } from '../contexts/RestaurantContext';
import { COLORS } from '../utils/constants';
import { 
  getCartButtonStyles, 
  getCartItemStyles, 
  getQuantityDisplayStyles 
} from '../utils/styleUtils';

interface CartItemComponentProps {
  cartItem: CartItem;
  onQuantityChange: (cartItemId: string, newQuantity: number) => void;
}

const CartItemComponent: React.FC<CartItemComponentProps> = ({ 
  cartItem, 
  onQuantityChange 
}) => {
  const handleDecrease = useCallback(() => {
    onQuantityChange(cartItem.id, Math.max(0, cartItem.quantity - 1));
  }, [cartItem.id, cartItem.quantity, onQuantityChange]);

  const handleIncrease = useCallback(() => {
    onQuantityChange(cartItem.id, cartItem.quantity + 1);
  }, [cartItem.id, cartItem.quantity, onQuantityChange]);

  return (
    <Paper elevation={1} sx={getCartItemStyles(!!cartItem.isImmutable, cartItem.quantity)}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold',
                color: cartItem.isImmutable ? COLORS.IMMUTABLE_TEXT_COLOR : 'inherit',
                textDecoration: cartItem.quantity === 0 ? 'line-through' : 'none',
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
            onClick={handleDecrease}
            disabled={cartItem.isImmutable}
            sx={getCartButtonStyles(!!cartItem.isImmutable)}
          >
            <RemoveIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            sx={getQuantityDisplayStyles(!!cartItem.isImmutable)}
          >
            {cartItem.quantity}
          </Typography>
          
          <IconButton
            onClick={handleIncrease}
            disabled={cartItem.isImmutable}
            sx={getCartButtonStyles(!!cartItem.isImmutable)}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default CartItemComponent;
