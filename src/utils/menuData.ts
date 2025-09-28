// 菜單數據類型定義
export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  dietaryTags: string;
  spiciness: string;
  price: number;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

// 套餐選項
export interface ComboOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

// 解析 CSV 數據
export function parseMenuData(csvText: string): MenuItem[] {
  const lines = csvText.trim().split('\n');
  
  return lines.slice(1).map((line, index) => {
    // 使用更智能的 CSV 解析，處理包含逗號的引號字段
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim()); // 添加最後一個字段
    
    return {
      id: values[0] || `item-${index}`,
      category: values[1] || '',
      name: values[2] || '',
      description: values[3] || '',
      dietaryTags: values[4] || '',
      spiciness: values[5] || '',
      price: parseInt(values[6]) || 0
    };
  });
}

// 獲取所有分類
export function getCategories(menuItems: MenuItem[]): string[] {
  const categories = new Set<string>();
  categories.add('套餐組合'); // 添加套餐組合分類
  
  menuItems.forEach(item => {
    categories.add(item.category);
  });
  
  categories.add('素食'); // 添加素食分類
  
  return Array.from(categories);
}

// 根據分類獲取菜品
export function getItemsByCategory(menuItems: MenuItem[], category: string): MenuItem[] {
  if (category === '套餐組合') {
    return []; // 套餐組合會單獨處理
  }
  
  if (category === '素食') {
    return menuItems.filter(item => 
      item.dietaryTags.includes('素') || item.dietaryTags.includes('純素')
    );
  }
  
  return menuItems.filter(item => item.category === category);
}

// 套餐選項數據
export const comboOptions: ComboOption[] = [
  {
    id: 'combo-1',
    name: '單人套餐',
    description: '主菜 + 湯品 + 飲品',
    price: 299
  },
  {
    id: 'combo-2',
    name: '雙人套餐',
    description: '主菜 x2 + 前菜 + 湯品 + 飲品 x2',
    price: 599
  },
  {
    id: 'combo-3',
    name: '三人套餐',
    description: '主菜 x3 + 前菜 x2 + 湯品 + 飲品 x3',
    price: 899
  },
  {
    id: 'combo-4',
    name: '四人套餐',
    description: '主菜 x4 + 前菜 x3 + 湯品 + 飲品 x4',
    price: 1199
  }
];

// 隨機獲取食物圖片
export function getRandomFoodImage(): string {
  const imageNumbers = ['01', '02', '03', '04', '05', '06', '07'];
  const randomIndex = Math.floor(Math.random() * imageNumbers.length);
  const imageNumber = imageNumbers[randomIndex];
  return `/data/sample-${imageNumber}.jpg`;
}
