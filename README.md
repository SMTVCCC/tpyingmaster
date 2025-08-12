<div align="center">
  <img src="logo.svg" alt="智能打字练习系统" width="80" height="80">
  <h1>🎯 智能打字练习系统</h1>
  <p><em>现代化的在线打字练习平台</em></p>
</div>

一个功能丰富、界面优雅的在线打字练习平台，专为提升英文打字速度与准确率而设计。支持多种练习模式，提供实时统计分析，让打字练习变得更加高效和有趣。

![打字练习](https://img.shields.io/badge/打字练习-智能化-blue?style=for-the-badge)
![技术栈](https://img.shields.io/badge/技术栈-HTML5%20%7C%20CSS3%20%7C%20JavaScript-green?style=for-the-badge)
![浏览器兼容](https://img.shields.io/badge/浏览器兼容-Chrome%20%7C%20Firefox%20%7C%20Safari-orange?style=for-the-badge)
![开源协议](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## ✨ 核心特性

### 🎮 多样化练习模式
- **📝 单词练习** - 常用英文单词训练，提升基础打字能力
- **📖 句子练习** - 完整句子练习，包含标点符号和大小写
- **💭 名言警句** - 经典名人名言，在练习中获得启发
- **💻 代码练习** - 编程代码片段，专为开发者设计
- **✏️ 自定义文本** - 支持用户自定义练习内容，灵活多样

### 🎵 沉浸式体验
- **🔊 音效反馈** - 键盘音效与电子音效双重选择
- **🎨 现代化界面** - 简洁优雅的卡片式设计
- **📱 响应式布局** - 完美适配各种设备屏幕
- **🌈 视觉反馈** - 实时高亮显示当前输入状态

### 📊 智能统计分析
- **⚡ 实时WPM** - 每分钟字数统计
- **🎯 准确率监控** - 精确到字符的准确率计算
- **⏱️ 练习时长** - 自动记录练习时间
- **📈 进度追踪** - 可视化练习进度条

### 🛠️ 高级功能
- **📝 预设模板** - 多种练习模板一键加载
- **🔧 文本格式化** - 智能清理与格式优化
- **📋 快捷操作** - 支持粘贴、清空等便捷功能
- **🔍 实时预览** - 练习文本预览与统计信息

## 🚀 快速开始

### 💻 本地运行
1. **直接运行**：双击 `index.html` 文件即可在浏览器中打开
2. **HTTP服务器**（推荐）：使用本地服务器获得更好的体验

```bash
# 方式1: 使用Python
python -m http.server 8000
# 然后访问 http://localhost:8000

# 方式2: 使用Node.js
npx serve .
# 然后访问显示的本地地址

# 方式3: 使用Live Server (VS Code扩展)
# 右键index.html -> Open with Live Server
```

### 📋 系统要求
- 现代浏览器（Chrome 60+, Firefox 55+, Safari 12+, Edge 79+）
- 无需安装任何依赖或插件
- 支持音效播放（可选）

## 🎯 使用指南

### 🎮 练习模式选择
1. **单词练习** - 点击"单词练习"卡片，练习常用英文单词
2. **句子练习** - 点击"句子练习"卡片，练习完整句子和标点
3. **名言警句** - 点击"名言警句"卡片，在练习中获得启发
4. **代码练习** - 点击"代码练习"卡片，专为程序员设计
5. **自定义文本** - 点击"自定义文本"卡片，输入自己的练习内容

### 📝 练习流程
1. **选择模式** - 在主页选择想要的练习类型
2. **开始练习** - 根据屏幕显示的文本进行输入
3. **实时反馈** - 查看当前的WPM、准确率和进度
4. **完成练习** - 练习结束后查看详细统计报告

### ⚙️ 功能特性
- **音效反馈** - 支持键盘音效和电子音效
- **实时统计** - WPM（每分钟字数）、准确率、练习时长
- **视觉反馈** - 已完成、当前输入、待输入文字的不同颜色显示
- **错误提示** - 输入错误时的即时反馈

## 🏗️ 技术架构

### 前端技术栈
- **HTML5** - 语义化结构设计
- **CSS3** - 现代化样式与动画
- **Vanilla JavaScript** - 原生JS实现，无框架依赖
- **Web Audio API** - 音效播放与管理

### 核心模块
```
📁 项目结构
├── 📄 index.html          # 主页面结构
├── 🎨 styles.css          # 样式定义
├── ⚙️ app.js              # 核心应用逻辑
├── 📁 content/            # 练习内容文件夹
│   ├── 📚 content-config.js   # 练习模式配置
│   ├── 📝 content-words.js    # 单词练习内容
│   ├── 📝 content-sentences.js # 句子练习内容
│   ├── 📝 content-quotes.js   # 名言警句内容
│   ├── 📝 content-code.js     # 代码练习内容
│   ├── 📝 content-custom.js   # 自定义文本内容
│   └── 📝 content-test.js     # 打字测试配置
├── 🎵 F.mp3               # 键盘音效文件
├── 🎵 T.mp3               # 电子音效文件
├── 🖼️ logo.svg            # 项目Logo
├── 📖 README.md           # 项目文档
├── 📋 CONTENT_README.md   # 内容管理说明
└── 📁 .trae/              # 开发工具配置
```

### 浏览器兼容性
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🌟 项目特色

### 🎯 专业的打字训练
- 科学的练习内容分级，从单词到句子再到代码
- 实时的WPM和准确率统计，帮助用户了解进步
- 智能的错误提示和视觉反馈系统

### 🎨 优雅的用户体验
- 简洁现代的卡片式界面设计
- 流畅的动画效果和交互反馈
- 响应式布局，适配各种设备屏幕

### 🔧 灵活的内容管理
- 模块化的内容管理系统
- 易于扩展和自定义的练习内容
- 支持用户自定义文本练习

## 🔧 自定义配置

### 管理练习内容
所有练习内容现在按模块分离到独立文件中管理，便于维护和更新：

- `content-words.js` - 单词练习内容
- `content-sentences.js` - 句子练习内容  
- `content-quotes.js` - 名言警句内容
- `content-code.js` - 代码练习内容
- `content-custom.js` - 自定义文本模板
- `content-test.js` - 打字测试配置
- `content-config.js` - 整体配置文件

```javascript
// 添加新单词
window.CONTENT_WORDS = `现有单词... 新单词1 新单词2`
  .split(/\s+/);

// 添加新句子
window.CONTENT_SENTENCES = [
  "现有句子...",
  "这是一个新的练习句子。"
];

// 添加新名言
window.CONTENT_QUOTES = [
  "现有名言...",
  "新的名言内容。 - 作者姓名"
];

// 添加新代码片段
window.CONTENT_CODE_SNIPPETS = [
  "现有代码...",
  "const newFunction = () => { console.log('新代码'); };"
];
```

### 修改音效文件
替换项目根目录下的 `F.mp3`（键盘音效）和 `T.mp3`（电子音效）文件即可更换音效。

### 自定义样式
在 `styles.css` 中修改CSS变量来快速调整主题色彩：
```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    /* 更多变量... */
}
```

### 详细内容管理
查看 `CONTENT_README.md` 文件获取完整的内容管理指南。

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献
1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 贡献类型
- 🐛 Bug修复
- ✨ 新功能开发
- 📝 文档改进
- 🎨 界面优化
- 🔧 性能提升

## 📄 开源协议

本项目采用 MIT 协议开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

<div align="center">

**🎯 让打字练习变得更加智能和有趣！**

💡 **提示**：定期练习是提升打字速度的关键 | 🎯 **目标**：准确率优先，速度其次

</div>