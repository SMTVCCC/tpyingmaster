# 打字练习内容管理说明

## 概述

为了方便更新和修改打字练习内容，所有的练习文本现在都按模块分离到独立文件中管理。这样可以让内容的维护更加简单和高效，每个练习模式都有自己的专用文件。

## 文件结构

```
├── content/               # 练习内容文件夹
│   ├── content-config.js      # 练习模式配置文件
│   ├── content-words.js       # 单词练习内容
│   ├── content-sentences.js   # 句子练习内容
│   ├── content-quotes.js      # 名言警句内容
│   ├── content-code.js        # 代码练习内容
│   ├── content-custom.js      # 自定义文本模板
│   └── content-test.js        # 打字测试配置
├── app.js                 # 主应用逻辑（已修改为从内容文件加载内容）
└── index.html             # 主页面（已添加所有内容文件引用）
```

## 各文件详细说明

### content-config.js
包含所有练习模式的基础配置信息：
- 模式名称和描述
- 文件加载顺序说明

### content-words.js
包含三个难度级别的单词练习内容：
- `window.CONTENT_WORDS_JUNIOR` - 初中词汇数组（基础常用词汇）
- `window.CONTENT_WORDS_HIGH` - 高中词汇数组（进阶学术词汇）
- `window.CONTENT_WORDS_TOEFL` - 托福词汇数组（高级学术词汇）
- `window.CONTENT_MODES_WORDS` - 单词练习模式配置（三个难度级别）
- `window.CONTENT_WORDS` - 向后兼容变量（默认为初中词汇）

### content-sentences.js
包含句子练习的内容：
- `window.CONTENT_SENTENCES` - 句子数组
- `window.CONTENT_MODES_SENTENCES` - 句子练习模式配置

### content-quotes.js
包含名言警句练习的内容：
- `window.CONTENT_QUOTES` - 名言警句数组
- `window.CONTENT_MODES_QUOTES` - 名言警句练习模式配置

### content-code.js
包含代码练习的内容：
- `window.CONTENT_CODE_SNIPPETS` - 代码片段数组
- `window.CONTENT_MODES_CODE` - 代码练习模式配置

### content-custom.js
包含自定义文本练习的内容：
- `window.CONTENT_TEMPLATES` - 自定义文本模板对象
- `window.CONTENT_MODES_CUSTOM` - 自定义文本练习模式配置

### content-test.js
包含打字测试的配置：
- `window.CONTENT_MODES_TEST` - 打字测试模式配置

## 如何修改内容

### 添加新单词
在 `content-words.js` 文件中找到 `window.CONTENT_WORDS` 部分，在字符串中添加新单词：

```javascript
window.CONTENT_WORDS = `time year people way day man thing woman life child world school state family student group country problem hand party place case week company system program question work night point home water room mother area money story fact month lot right study book eye job word business issue side kind head house service friend father power hour game line end member law car city community name president team minute idea kid body information back parent face others level office door health person art war history party result change morning reason research girl guy moment air teacher force education 新单词1 新单词2 新单词3`
  .split(/\\s+/);
```

### 添加新句子
在 `content-sentences.js` 文件中找到 `window.CONTENT_SENTENCES` 数组，添加新句子：

```javascript
window.CONTENT_SENTENCES = [
  "The quick brown fox jumps over the lazy dog.",
  "Practice makes perfect when you keep trying.",
  // ... 现有句子
  "这是一个新添加的句子。",
  "Another new sentence for practice."
];
```

### 添加新名言警句
在 `content-quotes.js` 文件中找到 `window.CONTENT_QUOTES` 数组，添加新名言：

```javascript
window.CONTENT_QUOTES = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  // ... 现有名言
  "新的名言警句 - 作者姓名"
];
```

### 添加新代码片段
在 `content-code.js` 文件中找到 `window.CONTENT_CODE_SNIPPETS` 数组，添加新代码：

```javascript
window.CONTENT_CODE_SNIPPETS = [
  "function calculateSum(a, b) { return a + b; }",
  // ... 现有代码
  "const newFunction = () => { console.log('Hello World'); };"
];
```

### 添加新自定义模板
在 `content-custom.js` 文件中找到 `window.CONTENT_TEMPLATES` 对象，添加新模板：

```javascript
window.CONTENT_TEMPLATES = {
  article: `现有文章模板...`,
  dialogue: `现有对话模板...`,
  technical: `现有技术模板...`,
  numbers: `现有数字模板...`,
  newTemplate: `这是一个新的自定义模板内容...`
};
```

## 注意事项

1. **文件顺序**：在 `index.html` 中，确保 `content-config.js` 最先加载，其他内容文件按需加载。
2. **语法检查**：修改任何内容文件后，请检查 JavaScript 语法是否正确。
3. **文件编码**：确保所有内容文件使用 UTF-8 编码保存。
4. **备份**：在修改内容前，建议先备份原文件。

## 故障排除

如果练习内容没有正确显示，请检查：

1. 浏览器控制台是否有 JavaScript 错误
2. 确认所有内容文件路径正确
3. 检查内容文件语法是否正确
4. 确认 `index.html` 中正确引用了所有内容文件

## 开发建议

在修改内容文件之前，建议：

1. 在本地环境测试修改
2. 使用浏览器开发者工具检查错误
3. 逐个文件进行修改和测试
4. 保持代码格式的一致性

## 扩展功能

如果需要添加新的练习模式：

1. 创建新的内容文件（如 `content-newmode.js`）
2. 在 `content-config.js` 中添加新模式的配置
3. 在 `index.html` 中引用新文件
4. 在 `app.js` 中添加相应的处理逻辑

这种模块化的结构使得添加新功能和维护现有内容变得更加简单和灵活。