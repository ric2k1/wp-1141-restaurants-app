import React, { useState } from 'react';
import {
  Box,
  Paper,
  CardMedia,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Restaurant as RestaurantIcon, AddShoppingCart as AddShoppingCartIcon } from '@mui/icons-material';
import { useRestaurant } from '../hooks/useRestaurant';
import { useDishDisplay } from '../hooks/useDishDisplay';
import CartPopup from './CartPopup';
import { generateCartItemId } from '../utils/cartUtils';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, UI_CONSTANTS } from '../utils/constants';

const DishComponent: React.FC = () => {
  // Use restaurant context for global state
  const { selectedItem } = useRestaurant();

  // Cart popup state
  const [isCartPopupOpen, setIsCartPopupOpen] = useState(false);
  const [cartItemId, setCartItemId] = useState<string>('');

  // Use custom hook for dish display logic
  const {
    imageLoading,
    imageError,
    showSuccessMessage,
    currentImage,
    handleImageLoad,
    handleImageError,
    setShowSuccessMessage,
  } = useDishDisplay();

  // Handle add to cart button click
  const handleOpenCartPopup = () => {
    if (selectedItem) {
      // 不先添加到購物車，而是直接打開彈出視窗
      // 讓 CartPopup 自己管理購物車項目
      const newCartItemId = generateCartItemId(selectedItem.id);
      setCartItemId(newCartItemId);
      setIsCartPopupOpen(true);
    }
  };

  return (
    <Box sx={{ width: '70%' }}>
      <Paper elevation={2} sx={{ height: '100%', overflow: 'hidden' }}>
        {selectedItem ? (
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative'
          }}>
            {/* 菜品圖片 - 佔滿整個區域 */}
            <Box sx={{ 
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {imageLoading && (
                <Box sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1
                }}>
                  <CircularProgress size={60} />
                </Box>
              )}
              
              {imageError ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%',
                  color: 'text.secondary'
                }}>
                  <RestaurantIcon sx={{ fontSize: 80, mb: 2 }} />
                  <Typography variant="h6">{ERROR_MESSAGES.IMAGE_LOAD_FAILED}</Typography>
                </Box>
              ) : (
                <CardMedia
                  component="img"
                  image={currentImage}
                  alt={selectedItem.name}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: imageLoading ? 0.3 : 1,
                    transition: 'opacity 0.3s ease',
                  }}
                />
              )}
            </Box>

            {/* 加入購物車按鈕 - 固定在底部 */}
            <Box sx={{ 
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.6)',
              borderRadius: 2,
              px: 2,
              py: 1
            }}>
              <Button
                variant="contained"
                size="medium"
                onClick={handleOpenCartPopup}
                startIcon={<AddShoppingCartIcon />}
                sx={{
                  py: 1,
                  px: 3,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  backgroundColor: 'primary.main',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                加入購物車
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <RestaurantIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              選擇菜品查看詳情
            </Typography>
            <Typography variant="body1" color="text.secondary">
              從左側菜單中選擇您感興趣的菜品
            </Typography>
          </Box>
        )}
      </Paper>

      {/* 成功提示 */}
      <Snackbar
        open={showSuccessMessage}
        autoHideDuration={UI_CONSTANTS.SNACKBAR_AUTO_HIDE_DURATION}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessMessage(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {selectedItem?.name} {SUCCESS_MESSAGES.ITEM_ADDED_TO_CART}
        </Alert>
      </Snackbar>

      {/* 購物車彈出視窗 */}
      {selectedItem && (
        <CartPopup
          open={isCartPopupOpen}
          onClose={() => setIsCartPopupOpen(false)}
          item={selectedItem}
          cartItemId={cartItemId}
        />
      )}
    </Box>
  );
};

export default DishComponent;
