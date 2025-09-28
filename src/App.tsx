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
  const [selectedCategory, setSelectedCategory] = useState('前菜');
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
        
        // 自動選擇前菜分類的第一個項目
        const appetizerItems = getItemsByCategory(items, '前菜');
        if (appetizerItems.length > 0) {
          setSelectedItem(appetizerItems[0]);
        }
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
    
    // 獲取新分類的第一個項目
    const currentItems = newValue === '套餐組合' ? comboOptions : getItemsByCategory(menuItems, newValue);
    if (currentItems.length > 0) {
      setSelectedItem(currentItems[0]);
    } else {
      setSelectedItem(null);
    }
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
            {/* 左側菜單區域 - 30% 寬度 */}
            <Box sx={{ width: '30%', minWidth: '300px' }}>
              <Paper elevation={2} sx={{ height: '100%', overflow: 'hidden' }}>
                {/* 分類標籤 */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{ 
                      px: 1,
                      '& .MuiTab-root': {
                        minWidth: 'auto',
                        fontSize: '0.875rem',
                        px: 1.5,
                      }
                    }}
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
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              py: 2,
                              px: 2,
                              '&.Mui-selected': {
                                backgroundColor: 'primary.light',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'primary.main',
                                },
                              },
                            }}
                          >
                            {/* 第一行：品名和價格 */}
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              width: '100%',
                              mb: 1
                            }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flex: 1 }}>
                                {item.name}
                              </Typography>
                              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', ml: 2 }}>
                                NT$ {item.price}
                              </Typography>
                            </Box>
                            
                            {/* 第二行：描述 */}
                            <Typography 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ 
                                mb: 1,
                                lineHeight: 1.4,
                                fontSize: '0.875rem'
                              }}
                            >
                              {item.description}
                            </Typography>
                            
                            {/* 第三行：標籤 */}
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {'dietaryTags' in item && item.dietaryTags && (
                                <Chip
                                  label={item.dietaryTags}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem', height: '24px' }}
                                />
                              )}
                              {'spiciness' in item && item.spiciness && (
                                <Chip
                                  label={item.spiciness}
                                  size="small"
                                  color="warning"
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem', height: '24px' }}
                                />
                              )}
                            </Box>
                          </ListItemButton>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              </Paper>
            </Box>

            {/* 右側菜品詳情區域 - 70% 寬度 */}
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
                      <CardMedia
                        component="img"
                        image={getRandomFoodImage()}
                        alt={selectedItem.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
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
                        onClick={() => handleAddToCart(selectedItem)}
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
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
