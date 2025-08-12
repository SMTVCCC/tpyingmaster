// 打字练习配置文件
// 整合所有练习模式的配置信息
// 使用全局变量以便在浏览器中直接使用

// 练习模式配置（整合版）
window.CONTENT_MODES = {
  words_junior: { name: '初中词汇', description: 'Junior High • Basic Vocabulary' },
  words_high: { name: '高中词汇', description: 'High School • Advanced Vocabulary' },
  words_toefl: { name: '托福词汇', description: 'TOEFL • Academic Vocabulary' },
  sentences: { name: '句子练习', description: 'English • Sentences' },
  quotes: { name: '名言警句', description: 'English • Famous Quotes' },
  code: { name: '代码练习', description: 'Programming • Code Snippets' },
  custom: { name: '自定义文本', description: 'Custom • Your Text' },
  test: { name: '打字测试', description: 'Typing Test • 1 Minute' }
};

// 文件加载顺序说明
// 1. content-config.js (本文件) - 基础配置
// 2. content-words.js - 单词练习内容
// 3. content-sentences.js - 句子练习内容
// 4. content-quotes.js - 名言警句内容
// 5. content-code.js - 代码练习内容
// 6. content-custom.js - 自定义文本内容
// 7. content-test.js - 打字测试配置