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
  
  menuItems.forEach(item => {
    categories.add(item.category);
  });
  
  categories.add('素食'); // 添加素食分類
  
  return Array.from(categories);
}

// 根據分類獲取菜品
export function getItemsByCategory(menuItems: MenuItem[], category: string): MenuItem[] {
  
  if (category === '素食') {
    return menuItems.filter(item => 
      item.dietaryTags.includes('素') || item.dietaryTags.includes('純素')
    );
  }
  
  return menuItems.filter(item => item.category === category);
}


// 隨機獲取食物圖片
export function getRandomFoodImage(): string {
  const imageNumbers = ['01', '02', '03', '04', '05', '06', '07'];
  const randomIndex = Math.floor(Math.random() * imageNumbers.length);
  const imageNumber = imageNumbers[randomIndex];
  return `/data/sample-${imageNumber}.jpg`;
}
