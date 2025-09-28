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

interface EmptyCartMessagePopupProps {
  open: boolean;
  onClose: () => void;
}

const EmptyCartMessagePopup: React.FC<EmptyCartMessagePopupProps> = ({ 
  open, 
  onClose 
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
          購物車是空的
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
            您的購物車是空的！
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            請先選擇一些餐點再送出訂單。
          </Typography>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            px: 4,
            py: 1,
            fontWeight: 'bold',
          }}
        >
          確定
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmptyCartMessagePopup;
