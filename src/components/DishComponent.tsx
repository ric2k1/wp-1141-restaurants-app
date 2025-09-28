import React from 'react';
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

const DishComponent: React.FC = () => {
  // Use restaurant context for global state
  const { selectedItem } = useRestaurant();

  // Use custom hook for dish display logic
  const {
    imageLoading,
    imageError,
    buttonLoading,
    showSuccessMessage,
    currentImage,
    handleImageLoad,
    handleImageError,
    handleAddToCartClick,
    setShowSuccessMessage,
  } = useDishDisplay();

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
                  <Typography variant="h6">圖片載入失敗</Typography>
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
                onClick={handleAddToCartClick}
                disabled={buttonLoading}
                startIcon={buttonLoading ? <CircularProgress size={20} color="inherit" /> : <AddShoppingCartIcon />}
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
                  '&:disabled': {
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                {buttonLoading ? '加入中...' : '加入購物車'}
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
        autoHideDuration={2000}
        onClose={() => setShowSuccessMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessMessage(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {selectedItem?.name} 已加入購物車！
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DishComponent;
