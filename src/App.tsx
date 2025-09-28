import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CardMedia,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  Chip,
  IconButton,
  Badge,
  Paper,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Restaurant as RestaurantIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  parseMenuData, 
  getCategories, 
  getItemsByCategory, 
  comboOptions, 
  getRandomFoodImage,
  type MenuItem,
  type ComboOption 
} from './utils/menuData';

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

function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('套餐組合');
  const [selectedItem, setSelectedItem] = useState<MenuItem | ComboOption | null>(null);
  const [cartItems, setCartItems] = useState<(MenuItem | ComboOption)[]>([]);

  // 載入菜單數據
  useEffect(() => {
    fetch('/data/dish-data.csv')
      .then(response => response.text())
      .then(csvText => {
        const items = parseMenuData(csvText);
        setMenuItems(items);
        setCategories(getCategories(items));
      })
      .catch(error => {
        console.error('載入菜單數據失敗:', error);
      });
  }, []);

  // 獲取當前分類的項目
  const getCurrentItems = (): (MenuItem | ComboOption)[] => {
    if (selectedCategory === '套餐組合') {
      return comboOptions;
    }
    return getItemsByCategory(menuItems, selectedCategory);
  };

  // 處理分類選擇
  const handleCategoryChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
    setSelectedItem(null);
  };

  // 處理項目選擇
  const handleItemSelect = (item: MenuItem | ComboOption) => {
    setSelectedItem(item);
  };

  // 添加到購物車
  const handleAddToCart = (item: MenuItem | ComboOption) => {
    setCartItems(prev => [...prev, item]);
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
            <IconButton color="inherit">
              <Badge badgeContent={cartItems.length} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', gap: 3, height: '80vh' }}>
            {/* 左側菜單區域 */}
            <Box sx={{ flex: 1 }}>
              <Paper elevation={2} sx={{ height: '100%', overflow: 'hidden' }}>
                {/* 分類標籤 */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ px: 2 }}
                  >
                    {categories.map((category) => (
                      <Tab key={category} label={category} value={category} />
                    ))}
                  </Tabs>
                </Box>

                {/* 菜品列表 */}
                <Box sx={{ height: 'calc(100% - 48px)', overflow: 'auto' }}>
                  <List>
                    {getCurrentItems().map((item, index) => (
                      <React.Fragment key={item.id || index}>
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() => handleItemSelect(item)}
                            selected={selectedItem?.id === item.id}
                            sx={{
                              '&.Mui-selected': {
                                backgroundColor: 'primary.light',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'primary.main',
                                },
                              },
                            }}
                          >
                            <ListItemText
                              primary={item.name}
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {item.description}
                                  </Typography>
                                  <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                    {'dietaryTags' in item && item.dietaryTags && (
                                      <Chip
                                        label={item.dietaryTags}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                      />
                                    )}
                                    {'spiciness' in item && item.spiciness && (
                                      <Chip
                                        label={item.spiciness}
                                        size="small"
                                        color="warning"
                                        variant="outlined"
                                      />
                                    )}
                                  </Box>
                                </Box>
                              }
                            />
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                              NT$ {item.price}
                            </Typography>
                          </ListItemButton>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              </Paper>
            </Box>

            {/* 右側菜品詳情區域 */}
            <Box sx={{ flex: 1 }}>
              <Paper elevation={2} sx={{ height: '100%', p: 3 }}>
                {selectedItem ? (
                  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* 菜品圖片 */}
                    <Box sx={{ flex: 1, mb: 2 }}>
                      <CardMedia
                        component="img"
                        height="300"
                        image={getRandomFoodImage()}
                        alt={selectedItem.name}
                        sx={{
                          borderRadius: 2,
                          objectFit: 'cover',
                        }}
                      />
                    </Box>

                    {/* 菜品詳情 */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {selectedItem.name}
                      </Typography>
                      
                      <Typography variant="body1" color="text.secondary" paragraph>
                        {selectedItem.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        {'dietaryTags' in selectedItem && selectedItem.dietaryTags && (
                          <Chip
                            label={selectedItem.dietaryTags}
                            color="secondary"
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                        )}
                        {'spiciness' in selectedItem && selectedItem.spiciness && (
                          <Chip
                            label={selectedItem.spiciness}
                            color="warning"
                            variant="outlined"
                          />
                        )}
                      </Box>

                      <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
                        NT$ {selectedItem.price}
                      </Typography>

                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={() => handleAddToCart(selectedItem)}
                        sx={{
                          py: 1.5,
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
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
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
