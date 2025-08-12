// 自定义文本练习内容数据文件
// 包含自定义文本练习模式的文本内容
// 使用全局变量以便在浏览器中直接使用

// 自定义文本模板
window.CONTENT_TEMPLATES = {
  article: `Technology has revolutionized the way we communicate, work, and live. From smartphones that connect us instantly to people across the globe, to artificial intelligence that helps us solve complex problems, we are living in an era of unprecedented innovation. The digital transformation has not only changed how businesses operate but also how we learn, shop, and entertain ourselves. As we move forward, it's important to embrace these changes while being mindful of their impact on society and our daily lives.`,
  
  dialogue: `"Good morning, Sarah! How was your weekend?" asked Tom as he entered the office.\n\n"It was wonderful, thank you for asking," Sarah replied with a smile. "I went hiking with my family and we discovered a beautiful trail near the lake. The weather was perfect, and we even saw some deer along the way."\n\n"That sounds amazing! I've been meaning to explore more outdoor activities myself," Tom said. "Would you recommend that trail for beginners?"\n\n"Absolutely! It's not too challenging, and the scenery is breathtaking. I can send you the location if you're interested."`,
  
  technical: `RESTful APIs require careful consideration of HTTP methods, status codes, and resource naming conventions. When designing endpoints, developers should follow the principle of statelessness, ensuring that each request contains all necessary information. Authentication mechanisms such as JWT tokens or OAuth 2.0 provide secure access control. Error handling should be consistent and informative, returning appropriate status codes like 404 for not found, 401 for unauthorized, and 500 for server errors. Proper documentation using tools like Swagger or OpenAPI specifications enhances API usability and adoption.`,
  
  numbers: `Invoice #2024-001: Total amount $1,234.56. Payment due: 30 days. Account: 4532-1234-5678-9012. Reference: TXN-789456123. Quantity: 25 units @ $49.38 each. Tax rate: 8.25%. Shipping: $15.00. Discount: 10% ($123.46). Net total: $1,111.10. Phone: (555) 123-4567. ZIP: 90210. Order date: 03/15/2024. Customer ID: C-98765. Product codes: SKU-001, SKU-002, SKU-003.`
};

// 自定义文本练习模式配置
window.CONTENT_MODES_CUSTOM = {
  custom: { name: '自定义文本', description: 'Custom • Your Text' }
};