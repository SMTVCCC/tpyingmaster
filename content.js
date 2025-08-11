// 打字练习内容数据文件
// 包含所有练习模式的文本内容
// 使用全局变量以便在浏览器中直接使用

// 单词练习内容
window.CONTENT_WORDS = `time year people way day man thing woman life child world school state family student group country problem hand party place case week company system program question work night point home water room mother area money story fact month lot right study book eye job word business issue side kind head house service friend father power hour game line end member law car city community name president team minute idea kid body information back parent face others level office door health person art war history party result change morning reason research girl guy moment air teacher force education`
  .split(/\s+/);

// 句子练习内容
window.CONTENT_SENTENCES = [
  "The quick brown fox jumps over the lazy dog.",
  "Practice makes perfect when you keep trying.",
  "Technology is advancing at an incredible pace.",
  "Learning new skills requires patience and dedication.",
  "Communication is the key to successful relationships.",
  "Every challenge is an opportunity to grow stronger.",
  "The future belongs to those who prepare today.",
  "Success comes to those who work hard consistently.",
  "Knowledge is power when applied with wisdom.",
  "Dreams become reality through persistent effort."
];

// 名言警句内容
window.CONTENT_QUOTES = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Life is what happens to you while you're busy making other plans. - John Lennon",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "It is during our darkest moments that we must focus to see the light. - Aristotle",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Your time is limited, so don't waste it living someone else's life. - Steve Jobs",
  "If life were predictable it would cease to be life, and be without flavor. - Eleanor Roosevelt",
  "In the end, we will remember not the words of our enemies, but the silence of our friends. - Martin Luther King Jr.",
  "The only impossible journey is the one you never begin. - Tony Robbins",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill"
];

// 代码练习内容
window.CONTENT_CODE_SNIPPETS = [
  "function calculateSum(a, b) { return a + b; }",
  "const users = data.filter(user => user.active);",
  "if (condition) { console.log('Hello World'); }",
  "const promise = fetch('/api/data').then(res => res.json());",
  "class Component extends React.Component { render() { return <div>Hello</div>; } }",
  "const result = array.map(item => item.value * 2);",
  "try { const data = JSON.parse(response); } catch (error) { console.error(error); }",
  "const debounce = (func, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => func.apply(null, args), delay); }; };",
  "async function fetchData() { const response = await fetch('/api'); return response.json(); }",
  "const styles = { container: { display: 'flex', justifyContent: 'center', alignItems: 'center' } };"
];

// 自定义文本模板
window.CONTENT_TEMPLATES = {
  article: `Technology has revolutionized the way we communicate, work, and live. From smartphones that connect us instantly to people across the globe, to artificial intelligence that helps us solve complex problems, we are living in an era of unprecedented innovation. The digital transformation has not only changed how businesses operate but also how we learn, shop, and entertain ourselves. As we move forward, it's important to embrace these changes while being mindful of their impact on society and our daily lives.`,
  
  dialogue: `"Good morning, Sarah! How was your weekend?" asked Tom as he entered the office.\n\n"It was wonderful, thank you for asking," Sarah replied with a smile. "I went hiking with my family and we discovered a beautiful trail near the lake. The weather was perfect, and we even saw some deer along the way."\n\n"That sounds amazing! I've been meaning to explore more outdoor activities myself," Tom said. "Would you recommend that trail for beginners?"\n\n"Absolutely! It's not too challenging, and the scenery is breathtaking. I can send you the location if you're interested."`,
  
  technical: `RESTful APIs require careful consideration of HTTP methods, status codes, and resource naming conventions. When designing endpoints, developers should follow the principle of statelessness, ensuring that each request contains all necessary information. Authentication mechanisms such as JWT tokens or OAuth 2.0 provide secure access control. Error handling should be consistent and informative, returning appropriate status codes like 404 for not found, 401 for unauthorized, and 500 for server errors. Proper documentation using tools like Swagger or OpenAPI specifications enhances API usability and adoption.`,
  
  numbers: `Invoice #2024-001: Total amount $1,234.56. Payment due: 30 days. Account: 4532-1234-5678-9012. Reference: TXN-789456123. Quantity: 25 units @ $49.38 each. Tax rate: 8.25%. Shipping: $15.00. Discount: 10% ($123.46). Net total: $1,111.10. Phone: (555) 123-4567. ZIP: 90210. Order date: 03/15/2024. Customer ID: C-98765. Product codes: SKU-001, SKU-002, SKU-003.`
};

// 练习模式配置
window.CONTENT_MODES = {
  words: { name: '单词练习', description: 'English • Random Words' },
  sentences: { name: '句子练习', description: 'English • Sentences' },
  quotes: { name: '名言警句', description: 'English • Famous Quotes' },
  code: { name: '代码练习', description: 'Programming • Code Snippets' },
  custom: { name: '自定义文本', description: 'Custom • Your Text' },
  test: { name: '打字测试', description: 'Typing Test • 1 Minute' }
};