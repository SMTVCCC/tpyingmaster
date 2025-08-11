# 打字练习内容管理说明

## 概述

为了方便更新和修改打字练习内容，所有的练习文本现在都集中在 `content.js` 文件中管理。这样可以让内容的维护更加简单和高效。

## 文件结构

```
├── content.js          # 所有练习内容的集中管理文件
├── app.js             # 主应用逻辑（已修改为从content.js加载内容）
├── index.html         # 主页面（已添加content.js引用）
└── CONTENT_README.md  # 本说明文件
```

## 内容文件说明

### content.js 包含以下内容：

1. **单词练习内容** (`CONTENT_WORDS`)
   - 常用英文单词列表
   - 用于基础打字练习

2. **句子练习内容** (`CONTENT_SENTENCES`)
   - 完整的英文句子
   - 包含标点符号和大小写练习

3. **名言警句内容** (`CONTENT_QUOTES`)
   - 经典名人名言
   - 带有作者署名

4. **代码练习内容** (`CONTENT_CODE_SNIPPETS`)
   - 编程代码片段
   - 涵盖多种编程语言和场景

5. **自定义模板** (`CONTENT_TEMPLATES`)
   - 文章模板
   - 对话模板
   - 技术文档模板
   - 数字练习模板

6. **练习模式配置** (`CONTENT_MODES`)
   - 各种练习模式的名称和描述

## 如何更新内容

### 1. 添加新单词

在 `content.js` 文件中找到 `window.CONTENT_WORDS` 部分，在字符串中添加新单词：

```javascript
window.CONTENT_WORDS = `现有单词... 新单词1 新单词2 新单词3`
  .split(/\s+/);
```

### 2. 添加新句子

在 `CONTENT_SENTENCES` 数组中添加新句子：

```javascript
window.CONTENT_SENTENCES = [
  "现有句子...",
  "这是一个新的练习句子。",
  "另一个新句子用于练习。"
];
```

### 3. 添加新名言

在 `CONTENT_QUOTES` 数组中添加新名言：

```javascript
window.CONTENT_QUOTES = [
  "现有名言...",
  "新的名言内容。 - 作者姓名"
];
```

### 4. 添加新代码片段

在 `CONTENT_CODE_SNIPPETS` 数组中添加新代码：

```javascript
window.CONTENT_CODE_SNIPPETS = [
  "现有代码...",
  "const newFunction = () => { console.log('新代码'); };"
];
```

### 5. 修改模板内容

在 `CONTENT_TEMPLATES` 对象中修改或添加新模板：

```javascript
window.CONTENT_TEMPLATES = {
  article: `现有文章模板...`,
  dialogue: `现有对话模板...`,
  technical: `现有技术模板...`,
  numbers: `现有数字模板...`,
  // 添加新模板
  newTemplate: `这是一个新的练习模板内容...`
};
```

## 扩展内容

`content.js` 文件还包含了扩展内容部分，可以根据需要启用：

- `EXTENDED_WORDS` - 更多单词
- `EXTENDED_SENTENCES` - 更多句子
- `EXTENDED_QUOTES` - 更多名言
- `EXTENDED_CODE_SNIPPETS` - 更多代码片段

要启用这些扩展内容，可以在 `app.js` 中修改相应的变量赋值。

## 注意事项

1. **字符转义**：在添加包含引号的内容时，注意使用反斜杠转义：
   ```javascript
   "He said, \"Hello world!\""
   ```

2. **换行符**：在对话模板中使用 `\n\n` 表示段落换行：
   ```javascript
   "第一段内容\n\n第二段内容"
   ```

3. **文件编码**：确保 `content.js` 文件使用 UTF-8 编码保存。

4. **语法检查**：修改后建议在浏览器中测试，确保没有语法错误。

## 技术实现

- 内容通过全局变量 `window.CONTENT_*` 暴露
- `app.js` 中的 `loadContentFromFile()` 函数负责加载内容
- 页面加载时自动调用内容加载函数
- 如果 `content.js` 未加载，系统会使用默认内容

## 故障排除

如果内容没有正确加载：

1. 检查浏览器控制台是否有错误信息
2. 确认 `content.js` 文件路径正确
3. 检查 `content.js` 文件语法是否正确
4. 确认 `index.html` 中正确引用了 `content.js`

## 备份建议

在修改 `content.js` 之前，建议：

1. 备份原文件
2. 使用版本控制系统（如 Git）
3. 测试修改后的内容是否正常工作

---

通过这种方式，你可以轻松地管理和更新所有的打字练习内容，而无需修改复杂的应用逻辑代码。