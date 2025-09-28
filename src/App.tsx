import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Badge,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Restaurant as RestaurantIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { RestaurantProvider } from './contexts/RestaurantContext';
import { useRestaurant } from './hooks/useRestaurant';
import MenuComponent from './components/MenuComponent';
import DishComponent from './components/DishComponent';
import CartListPopup from './components/CartListPopup';
import OrderConfirmationPopup from './components/OrderConfirmationPopup';
import EmptyCartMessagePopup from './components/EmptyCartMessagePopup';

// 創建主題
const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#e74c3c',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
});

// 內部組件，使用 Context
const AppContent: React.FC = () => {
  const { totalItems, totalAmount, submitOrder, cartItems, cleanZeroQuantityItems } = useRestaurant();
  const [cartListOpen, setCartListOpen] = useState(false);
  const [orderConfirmationOpen, setOrderConfirmationOpen] = useState(false);
  const [emptyCartMessageOpen, setEmptyCartMessageOpen] = useState(false);

  const handleCartClick = () => {
    // 在打開購物車清單之前，先清理數量為 0 的項目
    cleanZeroQuantityItems();
    setCartListOpen(true);
  };

  const handleSubmitOrder = () => {
    // 檢查是否有非零數量的項目
    const hasNonZeroItems = cartItems.some(item => item.quantity > 0);
    
    if (hasNonZeroItems) {
      submitOrder();
      setOrderConfirmationOpen(true);
    } else {
      // 如果購物車為空，顯示空購物車訊息
      setEmptyCartMessageOpen(true);
    }
  };

  const handleContinueOrdering = () => {
    setOrderConfirmationOpen(false);
  };

  const handleCloseEmptyCartMessage = () => {
    setEmptyCartMessageOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        {/* 頂部導航欄 */}
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <RestaurantIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Ric's Diner
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {totalAmount > 0 && (
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ${totalAmount}
                </Typography>
              )}
              <IconButton color="inherit" onClick={handleCartClick}>
                <Badge badgeContent={totalItems > 0 ? totalItems : undefined} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', gap: 3, height: '80vh' }}>
            {/* 左側菜單組件 */}
            <MenuComponent />
            
            {/* 右側菜品詳情組件 */}
            <DishComponent />
          </Box>
        </Container>

        {/* 購物車清單彈出視窗 */}
        <CartListPopup
          open={cartListOpen}
          onClose={() => setCartListOpen(false)}
          onSubmitOrder={handleSubmitOrder}
        />

        {/* 訂單確認彈出視窗 */}
        <OrderConfirmationPopup
          open={orderConfirmationOpen}
          onContinueOrdering={handleContinueOrdering}
        />

        {/* 空購物車訊息彈出視窗 */}
        <EmptyCartMessagePopup
          open={emptyCartMessageOpen}
          onClose={handleCloseEmptyCartMessage}
        />
      </Box>
    </ThemeProvider>
  );
};

// 主 App 組件，提供 Context
function App() {
  return (
    <RestaurantProvider>
      <AppContent />
    </RestaurantProvider>
  );
}

export default App;
