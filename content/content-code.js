// 代码练习内容数据文件
// 包含代码练习模式的文本内容
// 使用全局变量以便在浏览器中直接使用

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

// 代码练习模式配置
window.CONTENT_MODES_CODE = {
  code: { name: '代码练习', description: 'Programming • Code Snippets' }
};