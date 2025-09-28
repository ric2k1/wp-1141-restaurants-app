import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { UI_CONSTANTS } from '../utils/constants';

interface OrderConfirmationPopupProps {
  open: boolean;
  onContinueOrdering: () => void;
}

const OrderConfirmationPopup: React.FC<OrderConfirmationPopupProps> = ({ 
  open, 
  onContinueOrdering 
}) => {
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
          訂單確認
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 'bold', mb: 2 }}>
            訂單已送出，正在為您準備餐點當中...
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            感謝您的訂購！我們會盡快為您準備餐點。
          </Typography>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center' }}>
        <Button
          onClick={onContinueOrdering}
          variant="contained"
          sx={{
            px: 4,
            py: 1,
            fontWeight: 'bold',
          }}
        >
          繼續點餐
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderConfirmationPopup;
