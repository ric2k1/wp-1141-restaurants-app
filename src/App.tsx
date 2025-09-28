import React from 'react';
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
  const { totalItems, totalAmount } = useRestaurant();

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
              <IconButton color="inherit">
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
