import React from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import { useRestaurant } from '../hooks/useRestaurant';

const MenuComponent: React.FC = () => {
  // Use restaurant context for global state
  const {
    categories,
    selectedCategory,
    selectedItem,
    handleCategoryChange,
    handleItemSelect,
    getCurrentItems,
  } = useRestaurant();

  return (
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
  );
};

export default MenuComponent;
