<div align="center">
  <img src="logo.svg" alt="智能打字练习系统" width="80" height="80">
  <h1>🎯 智能打字练习系统</h1>
</div>

一个现代化、功能丰富的在线打字练习平台，专为提升中文和英文打字速度与准确率而设计。

![打字练习](https://img.shields.io/badge/打字练习-智能化-blue?style=for-the-badge)
![技术栈](https://img.shields.io/badge/技术栈-HTML5%20%7C%20CSS3%20%7C%20JavaScript-green?style=for-the-badge)
![浏览器兼容](https://img.shields.io/badge/浏览器兼容-Chrome%20%7C%20Firefox%20%7C%20Safari-orange?style=for-the-badge)

## ✨ 核心特性

### 🎮 多样化练习模式
- **📚 文章练习** - 经典文学作品片段，提升阅读理解与打字能力
- **💬 对话练习** - 日常对话场景，训练实用交流技能
- **🔧 技术文档** - 编程术语与代码片段，专为开发者设计
- **🔢 数字练习** - 数字与符号输入训练，提升数据录入效率
- **✏️ 自定义文本** - 支持用户自定义练习内容

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

### 在线体验
直接打开 `index.html` 文件即可开始使用，无需安装任何依赖。

### 本地部署
```bash
# 克隆项目
git clone [项目地址]

# 进入项目目录
cd dazi

# 使用任意HTTP服务器启动
# 方式1: 使用Python
python -m http.server 8000

# 方式2: 使用Node.js
npx serve .

# 方式3: 直接双击index.html文件
```

## 🎯 使用指南

### 基础练习
1. **选择练习模式** - 点击主页上的练习卡片
2. **开始练习** - 在输入框中输入显示的文本
3. **查看统计** - 实时查看WPM、准确率等数据
4. **完成练习** - 练习结束后查看详细报告

### 自定义练习
1. **点击自定义文本卡片**
2. **选择预设模板** 或 **输入自定义内容**
3. **调整格式选项** - 选择保持原格式或清理空格
4. **开始练习** - 点击"开始练习"按钮

### 设置选项
- **音效设置** - 在设置中选择键盘音效或电子音效
- **练习偏好** - 根据个人需求调整练习参数

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
├── ⚙️ app.js              # 核心逻辑
├── 🎵 F.mp3               # 键盘音效
├── 🎵 T.mp3               # 电子音效
├── 🖼️ logo.svg            # 项目Logo
└── 📖 README.md           # 项目文档
```

### 浏览器兼容性
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🎨 界面预览

### 主界面
- 简洁的卡片式布局
- 直观的练习模式选择
- 现代化的视觉设计

### 练习界面
- 清晰的文本显示
- 实时的输入反馈
- 详细的统计信息

### 自定义文本界面
- 丰富的模板选择
- 智能的文本处理
- 便捷的操作工具

## 🔧 自定义配置

### 添加新的练习模板
```javascript
// 在app.js中的templates对象中添加
const templates = {
    // 现有模板...
    newTemplate: {
        title: "新模板",
        content: "模板内容...",
        description: "模板描述"
    }
};
```

### 修改音效文件
替换项目根目录下的 `F.mp3` 和 `T.mp3` 文件即可更换音效。

### 自定义样式
在 `styles.css` 中修改CSS变量来快速调整主题色彩：
```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    /* 更多变量... */
}
```

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

[⭐ 给个Star](https://github.com/your-repo) |
[🐛 报告Bug](https://github.com/your-repo/issues) |
[💡 功能建议](https://github.com/your-repo/issues)

</div>