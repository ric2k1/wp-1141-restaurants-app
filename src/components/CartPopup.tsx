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
} from '@mui/material';
import {
  Remove as RemoveIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useCartPopup } from '../hooks/useCartPopup';
import type { MenuItem, ComboOption } from '../utils/menuData';
import { UI_CONSTANTS } from '../utils/constants';

interface CartPopupProps {
  open: boolean;
  onClose: () => void;
  item: MenuItem | ComboOption;
  cartItemId: string;
}

const CartPopup: React.FC<CartPopupProps> = ({ open, onClose, item, cartItemId }) => {
  const {
    quantity,
    handleQuantityChange,
    handleConfirm,
    handleCancel,
  } = useCartPopup({ open, onClose, item, cartItemId });

  return (
    <Dialog
      open={open}
      onClose={() => {}} // 禁用點擊外部關閉
      maxWidth="sm"
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
          調整數量
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
            {item.name}
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
            ${item.price}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <IconButton
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 0}
              sx={{
                backgroundColor: quantity <= 0 ? 'grey.300' : 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: quantity <= 0 ? 'grey.300' : 'primary.dark',
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
              variant="h4"
              sx={{
                minWidth: 60,
                fontWeight: 'bold',
                color: 'primary.main',
                backgroundColor: 'white',
                borderRadius: 2,
                py: 1,
                px: 2,
                border: '2px solid',
                borderColor: 'primary.light',
              }}
            >
              {quantity}
            </Typography>
            
            <IconButton
              onClick={() => handleQuantityChange(quantity + 1)}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" sx={{ mt: 3, fontWeight: 'bold', color: 'success.main' }}>
            小計: ${item.price * quantity}
          </Typography>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          sx={{ mr: 1 }}
        >
          取消
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            px: 4,
            py: 1,
            fontWeight: 'bold',
          }}
        >
          確認
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartPopup;
