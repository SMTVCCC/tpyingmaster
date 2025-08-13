// Typing Master - Pure Frontend English Typing Trainer
// Multi-mode practice with elegant UI and sound feedback

// Browser compatibility polyfills
(function() {
  'use strict';
  
  // Polyfill for Array.from (IE support)
  if (!Array.from) {
    Array.from = function(arrayLike) {
      return Array.prototype.slice.call(arrayLike);
    };
  }
  
  // Polyfill for Object.assign (IE support)
  if (!Object.assign) {
    Object.assign = function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  }
  
  // Safari AudioContext fix
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  
  // Safari requestAnimationFrame fix
  window.requestAnimationFrame = window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    function(callback) { return setTimeout(callback, 16); };
    
  // Safari performance.now() fix
  if (!window.performance || !window.performance.now) {
    window.performance = window.performance || {};
    window.performance.now = function() {
      return Date.now();
    };
  }
})();

// 内容加载功能
// 由于浏览器兼容性限制，这里提供了加载content.js内容的函数
function loadContentFromFile() {
  // 检查是否已经通过script标签加载了content.js
  if (typeof window.CONTENT_WORDS !== 'undefined') {
    WORDS = window.CONTENT_WORDS;
    SENTENCES = window.CONTENT_SENTENCES;
    QUOTES = window.CONTENT_QUOTES;
    CODE_SNIPPETS = window.CONTENT_CODE_SNIPPETS;
    TEMPLATES = window.CONTENT_TEMPLATES;
    MODES = window.CONTENT_MODES;
    console.log('内容已从content.js文件加载');
  } else {
    console.log('使用默认内容，建议在index.html中添加content.js的script标签');
  }
}

// Page elements
const homePage = document.getElementById('homePage');
const wordCategoryPage = document.getElementById('wordCategoryPage');
const levelSelectionPage = document.getElementById('levelSelectionPage');
const speedTestPage = document.getElementById('speedTestPage');
const typingPage = document.getElementById('typingPage');

// Browser detection and warning
function detectBrowser() {
  const userAgent = navigator.userAgent;
  const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
  const isEdge = /Edg/.test(userAgent);
  
  return {
    isChrome,
    isEdge,
    isRecommended: isChrome || isEdge
  };
}

function showBrowserWarning() {
  const browserInfo = detectBrowser();
  
  // 如果是推荐的浏览器，不显示警告
  if (browserInfo.isRecommended) {
    return;
  }
  
  // 检查是否已经显示过警告（使用sessionStorage，会话期间只显示一次）
  if (sessionStorage.getItem('browserWarningShown')) {
    return;
  }
  
  const banner = document.getElementById('browserWarningBanner');
  const closeBtn = document.getElementById('closeBrowserWarning');
  
  // 显示提示条
  banner.style.display = 'block';
  
  // 标记已显示过警告
  sessionStorage.setItem('browserWarningShown', 'true');
  
  // 5秒后自动消失
  const autoHideTimer = setTimeout(() => {
    hideBanner();
  }, 5000);
  
  function hideBanner() {
    banner.style.display = 'none';
    clearTimeout(autoHideTimer);
  }
  
  // 关闭按钮事件
  closeBtn.addEventListener('click', hideBanner);
}

// 页面加载完成后检测浏览器
document.addEventListener('DOMContentLoaded', () => {
  // 延迟1秒显示，让页面先完全加载
  setTimeout(showBrowserWarning, 1000);
});
const practiceCards = document.querySelectorAll('.practice-card');
const backBtn = document.getElementById('backBtn');

// Typing elements
const textEl = document.getElementById('text');
const hintEl = document.getElementById('hint');
const stageEl = document.getElementById('stage');
const restartBtn = document.getElementById('restartBtn');
const soundBtn = document.getElementById('soundBtn');
const soundOnIcon = document.getElementById('soundOn');
const soundOffIcon = document.getElementById('soundOff');
const promptMeta = document.getElementById('promptMeta');

// Stats elements
const totalWPMEl = document.getElementById('totalWPM');
const totalAccuracyEl = document.getElementById('totalAccuracy');
const totalSessionsEl = document.getElementById('totalSessions');
const totalTimeEl = document.getElementById('totalTime');

const accEl = document.getElementById('accuracy');
const wpmEl = document.getElementById('wpm');
const kpmEl = document.getElementById('kpm');
const progressEl = document.getElementById('progress');

// 导入练习内容
// 注意：由于浏览器兼容性，这里使用动态导入或直接包含内容
// 如果需要模块化，可以考虑使用构建工具或将content.js作为script标签引入

// 临时解决方案：直接引用content.js中的内容
// 在实际部署时，建议使用模块打包工具或将content.js作为独立script引入

// Content banks for different practice modes - 现在从content.js文件管理
// 这些变量将在content.js加载后被重新赋值
// 内容变量 - 从content文件中加载
let WORDS, SENTENCES, QUOTES, CODE_SNIPPETS;

// Settings and state
let enableSound = true;
let enableVisualEffects = false; // 默认关闭视觉效果
let currentMode = 'words';
let customText = '';

// 关卡系统相关变量
let currentWordType = ''; // 当前选择的词汇类型 (junior/high/toefl)
let currentLevel = 1; // 当前关卡
let wordsPerLevel = 20; // 每个关卡的单词数量
let completedWordsInLevel = 0; // 当前关卡已完成的单词数量
let currentLevelWords = []; // 当前关卡的单词列表
let currentWordIndex = 0; // 当前单词在关卡中的索引

// 将currentMode暴露到window对象上以便调试
window.currentMode = currentMode;

// Practice modes configuration - 现在从content.js文件管理
// 默认配置，如果content文件未加载则使用
let MODES = {
  words: { name: '单词练习', description: 'English • Random Words' },
  words_junior: { name: '初中词汇', description: 'Junior High • Basic Vocabulary' },
  words_high: { name: '高中词汇', description: 'High School • Advanced Vocabulary' },
  words_toefl: { name: '托福词汇', description: 'TOEFL • Academic Vocabulary' },
  sentences: { name: '句子练习', description: 'English • Sentences' },
  quotes: { name: '名言警句', description: 'English • Famous Quotes' },
  code: { name: '代码练习', description: 'Programming • Code Snippets' },
  custom: { name: '自定义文本', description: 'Custom • Your Text' },
  test: { name: '打字测试', description: 'Typing Test • 1 Minute' }
};

// 立即检查并更新MODES配置
if (window.CONTENT_MODES) {
  MODES = window.CONTENT_MODES;
}

// 当content文件加载后，再次更新MODES配置
window.addEventListener('DOMContentLoaded', function() {
  if (window.CONTENT_MODES) {
    MODES = window.CONTENT_MODES;
    console.log('MODES updated from CONTENT_MODES:', MODES);
  }
});

// Statistics storage
function getStats() {
  const stats = localStorage.getItem('typingStats');
  return stats ? JSON.parse(stats) : {
    totalSessions: 0,
    totalTime: 0,
    totalWPM: 0,
    totalAccuracy: 0,
    sessions: []
  };
}

function saveStats(sessionData) {
  const stats = getStats();
  stats.sessions.push(sessionData);
  stats.totalSessions = stats.sessions.length;
  stats.totalTime += sessionData.duration;
  
  // Calculate averages
  const validSessions = stats.sessions.filter(s => s.wpm > 0);
  if (validSessions.length > 0) {
    stats.totalWPM = Math.round(validSessions.reduce((sum, s) => sum + s.wpm, 0) / validSessions.length);
    stats.totalAccuracy = Math.round(validSessions.reduce((sum, s) => sum + s.accuracy, 0) / validSessions.length);
  }
  
  localStorage.setItem('typingStats', JSON.stringify(stats));
  updateStatsDisplay();
}

function updateStatsDisplay() {
  const stats = getStats();
  if (totalWPMEl) totalWPMEl.textContent = stats.totalWPM;
  if (totalAccuracyEl) totalAccuracyEl.textContent = stats.totalAccuracy + '%';
  if (totalSessionsEl) totalSessionsEl.textContent = stats.totalSessions;
  if (totalTimeEl) {
    const minutes = Math.round(stats.totalTime / 60);
    totalTimeEl.textContent = minutes + '分钟';
  }
}

// Page navigation
function showHomePage() {
  if (homePage) homePage.style.display = 'block';
  if (wordCategoryPage) wordCategoryPage.style.display = 'none';
  if (levelSelectionPage) levelSelectionPage.style.display = 'none';
  if (speedTestPage) speedTestPage.style.display = 'none';
  if (typingPage) typingPage.style.display = 'none';
  updateStatsDisplay();
}

function showWordCategoryPage() {
  if (homePage) homePage.style.display = 'none';
  if (wordCategoryPage) wordCategoryPage.style.display = 'block';
  if (levelSelectionPage) levelSelectionPage.style.display = 'none';
  if (speedTestPage) speedTestPage.style.display = 'none';
  if (typingPage) typingPage.style.display = 'none';
}

function showLevelSelectionPage(wordType) {
  currentWordType = wordType;
  if (homePage) homePage.style.display = 'none';
  if (wordCategoryPage) wordCategoryPage.style.display = 'none';
  if (speedTestPage) speedTestPage.style.display = 'none';
  if (levelSelectionPage) levelSelectionPage.style.display = 'block';
  if (typingPage) typingPage.style.display = 'none';
  
  // 更新关卡选择页面的信息
  updateLevelSelectionPage();
}

function showSpeedTestPage() {
  if (homePage) homePage.style.display = 'none';
  if (wordCategoryPage) wordCategoryPage.style.display = 'none';
  if (levelSelectionPage) levelSelectionPage.style.display = 'none';
  if (speedTestPage) speedTestPage.style.display = 'block';
  if (typingPage) typingPage.style.display = 'none';
}

function showTypingPage(mode) {
  currentMode = mode;
  window.currentMode = mode; // 同步更新window.currentMode
  
  // 检查是否为测速模式
  isSpeedTestMode = (mode === 'test' || mode.includes('speed'));
  
  if (homePage) homePage.style.display = 'none';
  if (wordCategoryPage) wordCategoryPage.style.display = 'none';
  if (levelSelectionPage) levelSelectionPage.style.display = 'none';
  if (speedTestPage) speedTestPage.style.display = 'none';
  if (typingPage) typingPage.style.display = 'block';
  
  // 初始化计时器元素
  initTimerElements();
  
  // Update lesson title
  if (promptMeta) {
    promptMeta.textContent = MODES[mode].description;
  }
  
  // Generate content based on mode
  generateContent(mode);
  reset();
  
  // 确保隐藏输入框获得焦点，以便捕获用户输入
  setTimeout(() => {
    const hiddenInput = document.getElementById('hiddenInput');
    if (hiddenInput) {
      hiddenInput.focus();
      console.log('Hidden input focused in showTypingPage');
      
      // 确保输入框可以接收输入
      hiddenInput.style.pointerEvents = 'auto';
      hiddenInput.removeAttribute('readonly');
      
      // 重置输入值
      hiddenInput.value = '';
      lastInputValue = '';
    } else {
      console.error('Hidden input not found in showTypingPage');
    }
  }, 150);
}

function generateContent(mode) {
  currentMode = mode; // 确保当前模式被正确设置
  window.currentMode = mode; // 同步更新window.currentMode
  
  switch (mode) {
    case 'words':
      text = randWords(80);
      break;
    case 'words_junior':
      // 单词模式：只显示一个单词
      const juniorWords = window.CONTENT_WORDS_JUNIOR || ['word'];
      text = juniorWords[Math.floor(Math.random() * juniorWords.length)];
      break;
    case 'words_high':
      // 单词模式：只显示一个单词
      const highWords = window.CONTENT_WORDS_HIGH || ['word'];
      text = highWords[Math.floor(Math.random() * highWords.length)];
      break;
    case 'words_toefl':
      // 单词模式：只显示一个单词
      const toeflWords = window.CONTENT_WORDS_TOEFL || ['word'];
      text = toeflWords[Math.floor(Math.random() * toeflWords.length)];
      break;
    case 'sentences':
      text = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
      break;
    case 'quotes':
      text = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      break;
    case 'code':
      text = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
      break;
    case 'custom':
      text = customText || randWords(80);
      break;
    case 'test':
      text = randWords(100); // Fixed length for test
      break;
    default:
      text = randWords(80);
  }
  
  // Update prompt meta
  if (promptMeta) {
    promptMeta.textContent = MODES[mode] ? `${MODES[mode].description}` : 'English • Random Words';
  }
}

// 关卡系统相关函数
function getWordsByType(wordType) {
  switch (wordType) {
    case 'junior':
      return window.CONTENT_WORDS_JUNIOR || ['word'];
    case 'high':
      return window.CONTENT_WORDS_HIGH || ['word'];
    case 'toefl':
      return window.CONTENT_WORDS_TOEFL || ['word'];
    default:
      return ['word'];
  }
}

function getTotalLevels(wordType) {
  const words = getWordsByType(wordType);
  return Math.ceil(words.length / wordsPerLevel);
}

// 简单的伪随机数生成器，基于种子确保结果可重现
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 使用种子打乱数组，确保相同种子产生相同结果
function shuffleArrayWithSeed(array, seed) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getLevelWords(wordType, level) {
  const words = getWordsByType(wordType);
  const startIndex = (level - 1) * wordsPerLevel;
  const endIndex = Math.min(startIndex + wordsPerLevel, words.length);
  
  // 获取该关卡的固定单词
  const levelWords = words.slice(startIndex, endIndex);
  
  // 使用关卡号和词汇类型作为种子，确保每个关卡的单词顺序固定但随机
  const seed = (wordType + level).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // 返回打乱顺序但固定的单词列表
  return shuffleArrayWithSeed(levelWords, seed);
}

function getLevelProgress(wordType) {
  const stats = getStats();
  const levelKey = `${wordType}_levels`;
  return stats[levelKey] || {};
}

function saveLevelProgress(wordType, level, completed = false) {
  const stats = getStats();
  const levelKey = `${wordType}_levels`;
  if (!stats[levelKey]) {
    stats[levelKey] = {};
  }
  stats[levelKey][level] = {
    completed: completed,
    lastPlayed: Date.now()
  };
  localStorage.setItem('typingStats', JSON.stringify(stats));
}

function isLevelUnlocked(wordType, level) {
  if (level === 1) return true; // 第一关总是解锁的
  
  const progress = getLevelProgress(wordType);
  const previousLevel = level - 1;
  return progress[previousLevel] && progress[previousLevel].completed;
}

function updateLevelSelectionPage() {
  const levelDescription = document.querySelector('.level-description h3');
  const levelDescriptionText = document.querySelector('.level-description p');
  const progressText = document.querySelector('.progress-text');
  const progressFill = document.querySelector('.progress-fill');
  const levelGrid = document.querySelector('.level-grid');
  
  if (!levelDescription || !levelGrid) return;
  
  // 更新页面标题和描述
  const typeNames = {
    'junior': '初中词汇练习',
    'high': '高中词汇练习', 
    'toefl': '托福词汇练习'
  };
  
  levelDescription.textContent = typeNames[currentWordType] || '词汇练习';
  if (levelDescriptionText) {
    levelDescriptionText.textContent = '每个关卡包含20个单词，完成当前关卡后解锁下一关卡。';
  }
  
  // 计算进度
  const totalLevels = getTotalLevels(currentWordType);
  const progress = getLevelProgress(currentWordType);
  const completedLevels = Object.keys(progress).filter(level => progress[level].completed).length;
  const progressPercentage = totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;
  
  // 更新进度显示
  if (progressText) {
    progressText.textContent = `进度: ${completedLevels}/${totalLevels} 关卡`;
  }
  if (progressFill) {
    progressFill.style.width = `${progressPercentage}%`;
  }
  
  // 生成关卡网格
  levelGrid.innerHTML = '';
  
  for (let level = 1; level <= totalLevels; level++) {
    const levelCard = document.createElement('div');
    levelCard.className = 'level-card';
    
    const isUnlocked = isLevelUnlocked(currentWordType, level);
    const isCompleted = progress[level] && progress[level].completed;
    
    if (!isUnlocked) {
      levelCard.classList.add('locked');
    } else if (isCompleted) {
      levelCard.classList.add('completed');
    }
    
    const levelWords = getLevelWords(currentWordType, level);
    
    levelCard.innerHTML = `
      <div class="level-number">${level}</div>
      <div class="level-title">关卡 ${level}</div>
      <div class="level-words">${levelWords.length} 个单词</div>
      <div class="level-status ${isCompleted ? 'completed' : (isUnlocked ? 'available' : 'locked')}">
        ${isCompleted ? '已完成' : (isUnlocked ? '可练习' : '未解锁')}
      </div>
    `;
    
    if (isUnlocked) {
      levelCard.setAttribute('data-level', level);
    }
    
    levelGrid.appendChild(levelCard);
  }
}

function startLevelPractice(wordType, level) {
  currentLevel = level;
  currentWordType = wordType;
  completedWordsInLevel = 0; // 重置单词计数器
  currentWordIndex = 0; // 重置单词索引
  currentLevelWords = getLevelWords(wordType, level); // 获取关卡的固定单词列表
  
  // 设置当前模式
  const modeMap = {
    'junior': 'words_junior',
    'high': 'words_high',
    'toefl': 'words_toefl'
  };
  
  currentMode = modeMap[wordType];
  
  // 从关卡的第一个单词开始
  text = currentLevelWords[currentWordIndex] || 'word';
  
  // 显示打字页面
  showTypingPage(currentMode);
}

// Audio: generate click sounds using WebAudio to avoid asset files
let audioCtx = null;
let soundType = 'keyboard'; // 'electronic' or 'keyboard'
let keyboardSounds = {}; // Store keyboard sound audio elements
let audioPool = { correct: [], error: [] }; // Audio pool for Safari optimization
const AUDIO_POOL_SIZE = 5; // Number of audio instances in pool
let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Expose variables to global scope for debugging and testing
window.audioPool = audioPool;
window.keyboardSounds = keyboardSounds;
window.isSafari = isSafari;
window.soundType = soundType;
window.AUDIO_POOL_SIZE = AUDIO_POOL_SIZE;

function initAudio() {
  if (!audioCtx) {
    try {
      // Enhanced browser compatibility for AudioContext
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Safari requires user interaction to start audio context
      if (audioCtx.state === 'suspended') {
        const resumeAudio = function() {
          audioCtx.resume().then(() => {
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('touchstart', resumeAudio);
            document.removeEventListener('keydown', resumeAudio);
          }).catch(e => console.warn('Audio resume failed:', e));
        };
        
        document.addEventListener('click', resumeAudio, { once: true });
        document.addEventListener('touchstart', resumeAudio, { once: true });
        document.addEventListener('keydown', resumeAudio, { once: true });
      }
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }
  
  // Load keyboard sounds with Safari optimization
  if (!keyboardSounds.correct) {
    try {
      // Create main audio instances
      keyboardSounds.correct = new Audio('T.mp3');
      keyboardSounds.error = new Audio('F.mp3');
      keyboardSounds.correct.volume = 0.5;
      keyboardSounds.error.volume = 0.5;
      
      // Enhanced preloading with error handling
      keyboardSounds.correct.preload = 'auto';
      keyboardSounds.error.preload = 'auto';
      
      // Safari audio loading optimization
      keyboardSounds.correct.load();
      keyboardSounds.error.load();
      
      // Handle audio loading errors
      keyboardSounds.correct.addEventListener('error', function() {
        console.warn('Failed to load correct sound');
      });
      
      keyboardSounds.error.addEventListener('error', function() {
        console.warn('Failed to load error sound');
      });
      
    } catch (audioError) {
      console.warn('Keyboard sounds not available:', audioError);
    }
  }
  
  // Safari-specific optimizations (separate from main audio loading)
  if (isSafari && audioPool.correct.length === 0) {
    try {
      // Reduce volume slightly for Safari to prevent distortion
      if (keyboardSounds.correct) {
        keyboardSounds.correct.volume = 0.4;
        keyboardSounds.error.volume = 0.4;
      }
      
      // Create audio pool for Safari to prevent lag
      for (let i = 0; i < AUDIO_POOL_SIZE; i++) {
        const correctAudio = new Audio('T.mp3');
        const errorAudio = new Audio('F.mp3');
        
        correctAudio.volume = 0.4;
        errorAudio.volume = 0.4;
        correctAudio.preload = 'auto';
        errorAudio.preload = 'auto';
        
        audioPool.correct.push(correctAudio);
        audioPool.error.push(errorAudio);
        
        // Preload audio files
        correctAudio.load();
        errorAudio.load();
      }
      
      console.log('Safari audio pool created with', AUDIO_POOL_SIZE, 'instances');
    } catch (safariError) {
      console.warn('Safari audio optimization failed:', safariError);
    }
  }
}

function playClick(type='ok') {
  if (!enableSound) return;
  
  if (soundType === 'keyboard') {
    // Play keyboard sounds with Safari-optimized approach
    try {
      if (isSafari && audioPool.correct.length > 0) {
        // Use audio pool for Safari to prevent lag and stuttering
        const pool = type === 'ok' ? audioPool.correct : audioPool.error;
        
        // Find an available audio instance
        let availableAudio = pool.find(audio => audio.paused || audio.ended);
        
        if (!availableAudio) {
          // If no available audio, use the first one and reset it
          availableAudio = pool[0];
        }
        
        if (availableAudio) {
          availableAudio.currentTime = 0;
          availableAudio.play().catch(e => {
            // Fallback to cloning if pool fails
            console.warn('Pool audio failed, using fallback:', e);
            playAudioFallback(type);
          });
        }
      } else {
        // Standard approach for non-Safari browsers
        playAudioFallback(type);
      }
    } catch (e) {
      console.warn('Keyboard sound playback failed:', e);
    }
  } else {
    // Play electronic sounds with enhanced browser compatibility
    if (!audioCtx) return;
    
    try {
      // Check if audio context is suspended (Safari)
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(e => console.warn('Audio context resume failed:', e));
        return;
      }
      
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'square';
      // two tones: ok (higher, short), err (lower, slightly longer)
      o.frequency.value = type === 'ok' ? 340 : 180;
      g.gain.value = 0.0001;
      o.connect(g).connect(audioCtx.destination);
      o.start();
      const now = audioCtx.currentTime;
      // small attack then quick decay
      g.gain.exponentialRampToValueAtTime(0.2, now + 0.005);
      g.gain.exponentialRampToValueAtTime(0.00001, now + (type === 'ok' ? 0.06 : 0.12));
      o.stop(now + 0.15);
      
      // Clean up oscillator after use
      o.onended = function() {
        o.disconnect();
        g.disconnect();
      };
      
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }
}

// Fallback audio playback function
function playAudioFallback(type) {
  const sound = type === 'ok' ? keyboardSounds.correct : keyboardSounds.error;
  if (sound) {
    // Enhanced Safari compatibility: clone audio for overlapping sounds
    if (sound.currentTime > 0 && !sound.paused) {
      const clonedAudio = sound.cloneNode();
      clonedAudio.volume = sound.volume;
      clonedAudio.play().catch(e => console.warn('Cloned audio playback failed:', e));
    } else {
      sound.currentTime = 0; // Reset to beginning
      sound.play().catch(e => console.warn('Keyboard sound playback failed:', e));
    }
  }
}

function randWords(targetChars=80){
  let out = '';
  while (out.length < targetChars) {
    const w = WORDS[(Math.random()*WORDS.length)|0];
    out += (out ? ' ' : '') + w;
  }
  return out;
}

function randWordsFromBank(wordBank, targetChars=80){
  let out = '';
  while (out.length < targetChars) {
    const w = wordBank[(Math.random()*wordBank.length)|0];
    out += (out ? ' ' : '') + w;
  }
  return out;
}

let text = '';
let index = 0;
let startedAt = null;
let keystrokes = 0;
let wrong = 0;
let sessionStartTime = null;
// 用于跟踪错误字符的状态
let errorCharacters = new Set(); // 存储错误字符的位置
let correctedCharacters = new Set(); // 存储已修正的字符位置

// 计时器相关变量
let isSpeedTestMode = false; // 是否为测速模式
let countdownTimer = null; // 倒计时定时器
let practiceTimer = null; // 练习计时器
let countdownSeconds = 3; // 倒计时秒数
let practiceStartTime = null; // 练习开始时间（用于严格计时）
let practiceEndTime = null; // 练习结束时间
let timerContainer = null; // 计时器容器元素
let timerValue = null; // 计时器显示元素
let countdownOverlay = null; // 倒计时覆盖层
let countdownNumber = null; // 倒计时数字显示

// 计时器相关函数
function initTimerElements() {
  timerContainer = document.getElementById('timerContainer');
  timerValue = document.getElementById('timerValue');
  countdownOverlay = document.getElementById('countdownOverlay');
  countdownNumber = document.getElementById('countdownNumber');
}

function showTimer() {
  if (timerContainer) {
    timerContainer.style.display = 'flex';
  }
}

function hideTimer() {
  if (timerContainer) {
    timerContainer.style.display = 'none';
  }
}

function startCountdown() {
  if (!isSpeedTestMode) return;
  
  countdownSeconds = 3;
  
  // 显示全屏倒计时覆盖层
  if (countdownOverlay) {
    countdownOverlay.style.display = 'flex';
  }
  
  function updateCountdown() {
    if (countdownNumber) {
      // 移除之前的样式类
      countdownNumber.classList.remove('final', 'go');
      
      if (countdownSeconds > 0) {
        countdownNumber.textContent = countdownSeconds.toString();
        
        // 为最后一秒添加特殊样式
        if (countdownSeconds === 1) {
          countdownNumber.classList.add('final');
        }
        
        // 重新触发动画
        countdownNumber.style.animation = 'none';
        countdownNumber.offsetHeight; // 触发重排
        countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
        
        countdownSeconds--;
        countdownTimer = setTimeout(updateCountdown, 1000);
      } else {
        // 显示"开始！"
        countdownNumber.textContent = '开始！';
        countdownNumber.classList.add('go');
        
        setTimeout(() => {
          // 隐藏倒计时覆盖层
          if (countdownOverlay) {
            countdownOverlay.style.display = 'none';
          }
          
          // 显示顶部计时器并开始练习计时
          showTimer();
          startPracticeTimer();
          
          if (hintEl) hintEl.textContent = '开始打字！';
          setTimeout(() => {
            if (hintEl) hintEl.textContent = '';
          }, 1000);
        }, 800);
      }
    }
  }
  
  updateCountdown();
}

function startPracticeTimer() {
  if (!isSpeedTestMode) return;
  
  practiceStartTime = Date.now();
  
  function updateTimer() {
    if (!practiceStartTime || practiceEndTime) return;
    
    const elapsed = Math.floor((Date.now() - practiceStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    if (timerValue) {
      timerValue.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    practiceTimer = setTimeout(updateTimer, 1000);
  }
  
  updateTimer();
}

function stopPracticeTimer() {
  if (countdownTimer) {
    clearTimeout(countdownTimer);
    countdownTimer = null;
  }
  
  if (practiceTimer) {
    clearTimeout(practiceTimer);
    practiceTimer = null;
  }
  
  if (practiceStartTime && !practiceEndTime) {
    practiceEndTime = Date.now();
  }
  
  if (timerContainer) {
    timerContainer.classList.remove('timer-countdown');
  }
}

function resetTimer() {
  stopPracticeTimer();
  practiceStartTime = null;
  practiceEndTime = null;
  countdownSeconds = 3;
  
  // 隐藏倒计时覆盖层
  if (countdownOverlay) {
    countdownOverlay.style.display = 'none';
  }
  
  if (timerValue) {
    timerValue.textContent = '00:00';
  }
  
  if (isSpeedTestMode) {
    hideTimer();
  }
}

function render(){
  if (currentMode === 'words' || currentMode === 'words_junior' || currentMode === 'words_high' || currentMode === 'words_toefl') {
    renderWordMode();
  } else {
    renderNormalMode();
  }
  
  // 更新统计信息
  progressEl.textContent = Math.round((index / text.length) * 100) + '%';
  const acc = keystrokes ? Math.max(0, Math.round((1 - wrong/keystrokes) * 100)) : 0;
  accEl.textContent = acc + '%';
  let mins = 0;
  let wpm = 0;
  
  if (isSpeedTestMode && practiceStartTime) {
    // 测速模式：严格按照计时器时间计算
    const currentTime = practiceEndTime || Date.now();
    mins = (currentTime - practiceStartTime) / 60000;
    wpm = mins > 0 ? Math.round((index/5) / mins) : 0; // 5 chars per word
  } else if (startedAt) {
    // 普通模式：使用原来的计算方式
    mins = (Date.now() - startedAt) / 60000;
    wpm = mins > 0 ? Math.round((index/5) / mins) : 0; // 5 chars per word
  }
  wpmEl.textContent = String(wpm);
  kpmEl.textContent = mins > 0 ? String(Math.round(keystrokes / mins)) : '0';
}

function renderWordMode() {
  // 在单词模式下，text就是当前单词
  const currentWord = text;
  const currentWordIndex = index; // 在当前单词中的位置
  
  let wordHtml = '';
  for (let i = 0; i < currentWord.length; i++) {
    const char = currentWord[i];
    
    if (i < currentWordIndex) {
      // 已完成的字符
      if (correctedCharacters.has(i)) {
        wordHtml += `<span class="corrected">${escapeHtml(char)}</span>`;
      } else {
        wordHtml += `<span class="done">${escapeHtml(char)}</span>`;
      }
    } else if (i === currentWordIndex) {
      // 当前字符
      if (errorCharacters.has(i)) {
        wordHtml += `<span class="current error">${escapeHtml(char || ' ')}</span>`;
      } else {
        wordHtml += `<span class="current">${escapeHtml(char || ' ')}</span>`;
      }
    } else {
      // 未完成的字符
      wordHtml += `<span class="pending">${escapeHtml(char)}</span>`;
    }
  }
  
  // 获取中文翻译
  const translation = window.getWordTranslation ? window.getWordTranslation(currentWord, currentMode) : '暂无翻译';
  
  textEl.innerHTML = `
    <div class="word-mode">
      <div class="word-display">${wordHtml}</div>
      <div class="word-translation">${translation}</div>
    </div>
  `;
}

function renderNormalMode() {
  let html = '';
  
  // 渲染已完成的字符
  for (let i = 0; i < index; i++) {
    const char = text[i];
    if (correctedCharacters.has(i)) {
      html += `<span class="corrected">${escapeHtml(char)}</span>`;
    } else {
      html += `<span class="done">${escapeHtml(char)}</span>`;
    }
  }
  
  // 渲染当前字符
  if (index < text.length) {
    const currentChar = text[index];
    if (errorCharacters.has(index)) {
      html += `<span class="current error">${escapeHtml(currentChar || ' ')}</span>`;
    } else {
      html += `<span class="current">${escapeHtml(currentChar || ' ')}</span>`;
    }
  }
  
  // 渲染未完成的字符
  for (let i = index + 1; i < text.length; i++) {
    const char = text[i];
    html += `<span class="pending">${escapeHtml(char)}</span>`;
  }
  
  textEl.innerHTML = html;
}

function escapeHtml(s){
  return s.replace(/[&<>"]|\n/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\n':'<br>'}[ch]));
}

function reset(){
  generateContent(currentMode);
  index = 0; keystrokes = 0; wrong = 0; startedAt = null; sessionStartTime = null;
  // 清空错误字符跟踪
  errorCharacters.clear();
  correctedCharacters.clear();
  // 重置计时器
  resetTimer();
  if (stageEl) stageEl.classList.remove('pop');
  if (hintEl) {
    if (isSpeedTestMode) {
      hintEl.textContent = '准备开始，3秒后开始计时';
    } else {
      hintEl.textContent = '按任意键开始';
    }
  }
  render();
  
  // 如果是测速模式，启动倒计时
  if (isSpeedTestMode) {
    setTimeout(() => {
      startCountdown();
    }, 1000);
  }
}

function finishSession() {
  // 停止计时器
  if (isSpeedTestMode) {
    stopPracticeTimer();
  }
  
  if ((!startedAt || !sessionStartTime) && !isSpeedTestMode) return;
  if (isSpeedTestMode && !practiceStartTime) return;
  
  let duration, mins, wpm;
  
  if (isSpeedTestMode && practiceStartTime) {
    // 测速模式：使用严格计时
    duration = (practiceEndTime - practiceStartTime) / 1000; // seconds
    mins = duration / 60;
    wpm = mins > 0 ? Math.round((index/5) / mins) : 0;
  } else {
    // 普通模式：使用原来的计算方式
    duration = (Date.now() - sessionStartTime) / 1000; // seconds
    mins = duration / 60;
    wpm = mins > 0 ? Math.round((index/5) / mins) : 0;
  }
  
  const accuracy = keystrokes ? Math.max(0, Math.round((1 - wrong/keystrokes) * 100)) : 0;
  
  const sessionData = {
    mode: currentMode,
    duration: duration,
    wpm: wpm,
    accuracy: accuracy,
    characters: index,
    keystrokes: keystrokes,
    errors: wrong,
    timestamp: Date.now()
  };
  
  saveStats(sessionData);
  
  // 如果是关卡模式且完成了练习，保存关卡进度
  if (currentWordType && currentLevel && completedWordsInLevel >= wordsPerLevel) {
    // 只有在准确率达到80%以上时才算完成关卡
    const levelCompleted = accuracy >= 80;
    saveLevelProgress(currentWordType, currentLevel, levelCompleted);
  }
}

function showLevelCompletionModal() {
  // 先清理已存在的模态框
  const existingModal = document.querySelector('.modal-overlay');
  if (existingModal) {
    existingModal.remove();
  }
  
  const duration = (Date.now() - sessionStartTime) / 1000;
  const mins = duration / 60;
  const wpm = mins > 0 ? Math.round((completedWordsInLevel * 5) / mins) : 0;
  const accuracy = keystrokes ? Math.max(0, Math.round((1 - wrong/keystrokes) * 100)) : 0;
  
  const levelCompleted = accuracy >= 80;
  const nextLevel = currentLevel + 1;
  const hasNextLevel = nextLevel <= getTotalLevels(currentWordType);
  
  let modalContent = `
    <div class="level-completion-modal">
      <div class="modal-content">
        <h2>${levelCompleted ? '🎉 关卡完成！' : '⚠️ 关卡未完成'}</h2>
        <div class="completion-stats">
          <div class="stat-item">
            <span class="stat-label">完成单词</span>
            <span class="stat-value">${completedWordsInLevel}/${wordsPerLevel}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">准确率</span>
            <span class="stat-value">${accuracy}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">速度</span>
            <span class="stat-value">${wpm} WPM</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">用时</span>
            <span class="stat-value">${Math.round(duration)}秒</span>
          </div>
        </div>
        ${levelCompleted ? 
          `<p class="completion-message">恭喜！您已成功完成关卡 ${currentLevel}！</p>` :
          `<p class="completion-message">需要达到80%准确率才能完成关卡，请再试一次！</p>`
        }
        <div class="modal-actions">
          <button id="retryLevel" class="btn btn-secondary">重试关卡</button>
          ${levelCompleted && hasNextLevel ? 
            `<button id="nextLevel" class="btn btn-primary">下一关卡</button>` : ''
          }
          <button id="backToLevels" class="btn btn-success">返回关卡</button>
        </div>
      </div>
    </div>
  `;
  
  // 创建并显示模态框
  const modalDiv = document.createElement('div');
  modalDiv.className = 'modal-overlay';
  modalDiv.innerHTML = modalContent;
  document.body.appendChild(modalDiv);
  
  // 添加事件监听器
  const retryBtn = modalDiv.querySelector('#retryLevel');
  const nextBtn = modalDiv.querySelector('#nextLevel');
  const backBtn = modalDiv.querySelector('#backToLevels');
  
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      modalDiv.remove();
      startLevelPractice(currentWordType, currentLevel);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      modalDiv.remove();
      startLevelPractice(currentWordType, nextLevel);
    });
  }
  
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      modalDiv.remove();
      showLevelSelectionPage(currentWordType);
    });
  }
}

// 旧的onKey函数已被新的输入系统替代

function flashWrong(){
  const cur = textEl.querySelector('.current');
  if (!cur) return;
  cur.classList.add('wrong');
  setTimeout(()=>cur.classList.remove('wrong'), 140);
}

// 新的输入系统：使用隐藏输入框捕获用户输入
let hiddenInput = null;
let lastInputValue = '';

// 检查是否处于打字模式
function isTypingMode() {
  return typingPage && typingPage.style.display !== 'none';
}

function setupInputSystem() {
  hiddenInput = document.getElementById('hiddenInput');
  if (!hiddenInput) {
    console.error('Hidden input element not found!');
    return;
  }
  
  console.log('Setting up input system...');
  
  // 监听input事件
  hiddenInput.addEventListener('input', handleTextInput);
  
  // 监听键盘事件以处理特殊键（如Backspace、Enter）
  hiddenInput.addEventListener('keydown', handleSpecialKeys);
  
  // 确保输入框在打字模式下始终有焦点
  document.addEventListener('click', function() {
    if (isTypingMode() && hiddenInput) {
      console.log('Document clicked, refocusing hidden input');
      hiddenInput.focus();
    }
  });
  
  // 防止输入框失去焦点
  hiddenInput.addEventListener('blur', function() {
    if (isTypingMode()) {
      console.log('Hidden input lost focus, refocusing...');
      setTimeout(() => {
        if (hiddenInput && isTypingMode()) {
          hiddenInput.focus();
        }
      }, 10);
    }
  });
  
  // 添加调试信息
  hiddenInput.addEventListener('focus', function() {
    console.log('Hidden input gained focus');
  });
  
  hiddenInput.addEventListener('keypress', function(e) {
    console.log('Keypress event:', e.key, e.charCode, e.keyCode);
  });
  
  console.log('Input system setup complete');
}

function handleTextInput(e) {
  if (!isTypingMode()) {
    console.log('Not in typing mode, ignoring input');
    return;
  }
  
  const currentValue = e.target.value;
  console.log('Input event:', { currentValue, lastInputValue });
  
  // 检测是否有新字符输入
  if (currentValue.length > lastInputValue.length) {
    // 有新字符输入
    const newChar = currentValue.slice(lastInputValue.length);
    console.log('New character detected:', newChar);
    processCharacterInput(newChar);
  } else if (currentValue.length < lastInputValue.length) {
    // 字符被删除（Backspace）
    console.log('Backspace detected');
    processBackspace();
  }
  
  // 更新最后输入值
  lastInputValue = currentValue;
  
  // 清空输入框以准备下一次输入（延迟执行以避免干扰）
  setTimeout(() => {
    if (e.target && e.target.value) {
      e.target.value = '';
      lastInputValue = '';
      console.log('Input cleared');
    }
  }, 10);
}

function handleSpecialKeys(e) {
  if (!isTypingMode()) return;
  
  if (e.key === 'Enter') {
    e.preventDefault();
    processEnterKey();
  }
}

function processCharacterInput(char) {
  // 在测速模式下，如果计时器还没开始，忽略输入
  if (isSpeedTestMode && !practiceStartTime) {
    return;
  }
  
  if (!startedAt) { 
    startedAt = Date.now(); 
    sessionStartTime = Date.now();
    if (hintEl) hintEl.textContent = '';
    
    // Initialize audio context on first user interaction
    if (enableSound && !audioCtx) {
      initAudio();
    }
  }
  
  // 调试信息
  console.log('Processing character input:', {
    char: char,
    expected: text[index],
    index: index
  });
  
  keystrokes++;
  const expected = text[index];
  const isCorrect = char === expected;
  
  if (isCorrect) {
    // 如果之前这个位置有错误，现在修正了，标记为已修正
    if (errorCharacters.has(index)) {
      errorCharacters.delete(index);
      correctedCharacters.add(index);
    }
    
    index++;
    
    // 在单词模式下，如果完成了一个单词（下一个字符是空格或到达末尾），自动跳到下一个单词
    if (currentMode === 'words' && (index >= text.length || text[index] === ' ')) {
      // 跳过空格到下一个单词
      while (index < text.length && text[index] === ' ') {
        index++;
      }
    }
    
    playClick('ok');
    if (stageEl && enableVisualEffects) {
      console.log('Triggering visual effect - enableVisualEffects:', enableVisualEffects);
      stageEl.classList.remove('pop');
      void stageEl.offsetWidth; // restart animation
      stageEl.classList.add('pop');
      console.log('Pop class added to stageEl');
    } else {
      console.log('Visual effect skipped - enableVisualEffects:', enableVisualEffects, 'stageEl:', !!stageEl);
    }
    
    // Check if finished
    if (index >= text.length) {
      // 在测速模式下，立即停止计时
      if (isSpeedTestMode) {
        stopPracticeTimer();
      }
      
      // 在单词模式下，完成一个单词后自动切换到下一个单词
      if (currentMode === 'words_junior' || currentMode === 'words_high' || currentMode === 'words_toefl') {
        completedWordsInLevel++; // 增加已完成单词计数
        currentWordIndex++; // 移动到下一个单词
        
        // 检查是否完成了关卡（20个单词）
        if (completedWordsInLevel >= wordsPerLevel) {
          // 关卡完成
          finishSession();
          showLevelCompletionModal();
        } else {
          // 使用关卡中的下一个单词
          if (currentWordIndex < currentLevelWords.length) {
            text = currentLevelWords[currentWordIndex];
          } else {
            // 如果超出了关卡单词列表，重新开始（理论上不应该发生）
            currentWordIndex = 0;
            text = currentLevelWords[currentWordIndex];
          }
          index = 0;
          // 清空错误字符跟踪
          errorCharacters.clear();
          correctedCharacters.clear();
          // 显示提示信息
          if (hintEl) hintEl.textContent = `单词完成！进度: ${completedWordsInLevel}/${wordsPerLevel}`;
          setTimeout(() => {
            if (hintEl) hintEl.textContent = '';
          }, 1500);
          render(); // 重新渲染页面
        }
      } else {
        finishSession();
        if (currentMode === 'words') {
          // For words mode, continue with more content
          text += ' ' + randWords(40);
        } else {
          // For other modes, show completion
          if (hintEl) hintEl.textContent = '练习完成！按重打键继续';
        }
      }
    }
  } else {
    // 标记错误字符位置
    errorCharacters.add(index);
    wrong++;
    playClick('err');
    flashWrong();
  }
  render();
}

function processBackspace() {
  if (index > 0) {
    index--;
    // 清除当前位置的错误和修正标记
    errorCharacters.delete(index);
    correctedCharacters.delete(index);
    render();
    playClick('backspace');
  }
}

function processEnterKey() {
  const nextSpace = text.indexOf(' ', index);
  index = nextSpace === -1 ? text.length : nextSpace + 1;
  render();
}

// 旧的setupKeyboardEvents函数已被新的输入系统替代

// 旧的handleKeyDown及相关函数已被新的输入系统替代

// 旧的键盘事件处理函数已被新的输入系统替代

// 新的输入系统将在页面加载时初始化

// Typing page events
if (restartBtn) {
  restartBtn.addEventListener('click', reset);
}

if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    enableSound = !enableSound;
    if (soundOnIcon) soundOnIcon.style.display = enableSound ? '' : 'none';
    if (soundOffIcon) soundOffIcon.style.display = enableSound ? 'none' : '';
    
    // Initialize audio context on first user interaction
    if (enableSound && !audioCtx) {
      initAudio();
    }
  });
}

if (backBtn) {
  backBtn.addEventListener('click', showHomePage);
}

// Word category page events
const categoryBackBtn = document.getElementById('categoryBackBtn');
const categoryCards = document.querySelectorAll('.category-card');

// Level selection page events
const levelBackBtn = document.getElementById('levelBackBtn');
const speedTestBackBtn = document.getElementById('speedTestBackBtn');

if (categoryBackBtn) {
  categoryBackBtn.addEventListener('click', showHomePage);
}

if (levelBackBtn) {
  levelBackBtn.addEventListener('click', showWordCategoryPage);
}

if (speedTestBackBtn) {
  speedTestBackBtn.addEventListener('click', showHomePage);
}

// 速度测试卡片点击事件
const speedTestCards = document.querySelectorAll('.speed-test-card');
speedTestCards.forEach(card => {
  card.addEventListener('click', () => {
    const testType = card.dataset.testType;
    if (testType === 'level-assessment' && !card.classList.contains('disabled')) {
      // 启动等级评估测试
      showTypingPage('test');
    }
    // 匹配挑战暂时不处理，因为卡片是禁用状态
  });
});

// 关卡卡片点击事件（使用事件委托）
const levelGrid = document.getElementById('levelGrid');
if (levelGrid) {
  levelGrid.addEventListener('click', (e) => {
    const levelCard = e.target.closest('.level-card');
    if (levelCard && !levelCard.classList.contains('locked')) {
      const level = parseInt(levelCard.dataset.level);
      startLevelPractice(currentWordType, level);
    }
  });
}

categoryCards.forEach(card => {
  card.addEventListener('click', () => {
    const wordType = card.dataset.wordType;
    // 映射旧的wordType到新的关卡系统类型
    let levelWordType;
    switch(wordType) {
      case 'basic':
        levelWordType = 'junior';
        break;
      case 'highschool':
        levelWordType = 'high';
        break;
      case 'toefl':
        levelWordType = 'toefl';
        break;
      default:
        levelWordType = 'junior';
    }
    showLevelSelectionPage(levelWordType);
  });
});

if (stageEl) {
  stageEl.addEventListener('click', () => stageEl.focus());
}

// Home page events
practiceCards.forEach(card => {
  card.addEventListener('click', () => {
    const mode = card.dataset.mode;
    if (mode === 'custom') {
      // Show custom text modal instead of prompt
      showCustomTextModal();
    } else if (mode === 'words') {
      // Show word category selection page
      showWordCategoryPage();
    } else if (mode === 'speed-test') {
      // Show speed test page
      showSpeedTestPage();
    } else {
      showTypingPage(mode);
    }
  });
});

// Settings modal functionality
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const soundTypeRadios = document.querySelectorAll('input[name="soundType"]');

if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    if (settingsModal) {
      settingsModal.style.display = 'flex';
    }
  });
}

if (closeSettings) {
  closeSettings.addEventListener('click', () => {
    if (settingsModal) {
      settingsModal.style.display = 'none';
    }
  });
}

// Close modal when clicking outside
if (settingsModal) {
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.style.display = 'none';
    }
  });
}

// Handle sound type changes
soundTypeRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    soundType = e.target.value;
    
    // Initialize audio when switching to keyboard sounds
    if (soundType === 'keyboard' && !keyboardSounds.correct) {
      initAudio();
    }
    
    // Save preference to localStorage
    localStorage.setItem('soundType', soundType);
  });
});

// Load saved sound type preference
const savedSoundType = localStorage.getItem('soundType');
if (savedSoundType) {
  soundType = savedSoundType;
  const radioToCheck = document.querySelector(`input[name="soundType"][value="${savedSoundType}"]`);
  if (radioToCheck) {
    radioToCheck.checked = true;
  }
}

// Handle screen shake toggle
const screenShakeToggle = document.getElementById('screenShakeToggle');

function updateToggleButton() {
  if (screenShakeToggle) {
    const toggleText = screenShakeToggle.querySelector('.toggle-text');
    if (enableVisualEffects) {
      screenShakeToggle.classList.add('active');
      toggleText.textContent = '开启';
    } else {
      screenShakeToggle.classList.remove('active');
      toggleText.textContent = '关闭';
    }
  }
}

if (screenShakeToggle) {
  screenShakeToggle.addEventListener('click', () => {
    enableVisualEffects = !enableVisualEffects;
    localStorage.setItem('enableVisualEffects', enableVisualEffects.toString());
    updateToggleButton();
    console.log('Visual effects toggled:', enableVisualEffects);
  });
}

// Load saved visual effects preference
const savedVisualEffects = localStorage.getItem('enableVisualEffects');
if (savedVisualEffects !== null) {
  enableVisualEffects = savedVisualEffects === 'true';
}
updateToggleButton();

// Custom Text Modal Functionality
const customTextModal = document.getElementById('customTextModal');
const closeCustomText = document.getElementById('closeCustomText');
const cancelCustomText = document.getElementById('cancelCustomText');
const customTextInput = document.getElementById('customTextInput');
const textPreview = document.getElementById('textPreview');
const startCustomPractice = document.getElementById('startCustomPractice');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const estimatedTime = document.getElementById('estimatedTime');
const clearText = document.getElementById('clearText');
const pasteText = document.getElementById('pasteText');
const preserveFormatting = document.getElementById('preserveFormatting');
const removeExtraSpaces = document.getElementById('removeExtraSpaces');
const templateBtns = document.querySelectorAll('.template-btn');

// Template texts
// Template texts - 现在从content.js文件管理
// 使用 window.CONTENT_TEMPLATES 替代本地 TEMPLATES 定义

function showCustomTextModal() {
  if (customTextModal) {
    customTextModal.style.display = 'flex';
    // Reset form
    if (customTextInput) customTextInput.value = '';
    updateTextStats();
    updatePreview();
    updateStartButton();
    // Focus on text input
    setTimeout(() => {
      if (customTextInput) customTextInput.focus();
    }, 100);
  }
}

function hideCustomTextModal() {
  if (customTextModal) {
    customTextModal.style.display = 'none';
  }
}

function updateTextStats() {
  const text = customTextInput ? customTextInput.value : '';
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estimatedMinutes = Math.max(1, Math.ceil(words / 40)); // Assuming 40 WPM average
  
  if (charCount) charCount.textContent = chars;
  if (wordCount) wordCount.textContent = words;
  if (estimatedTime) estimatedTime.textContent = estimatedMinutes;
}

function formatText(text) {
  if (!text) return '';
  
  let formatted = text;
  
  if (removeExtraSpaces && removeExtraSpaces.checked) {
    // Remove extra spaces and normalize whitespace
    formatted = formatted.replace(/\s+/g, ' ').trim();
  }
  
  if (!preserveFormatting || !preserveFormatting.checked) {
    // Remove line breaks and normalize to single line
    formatted = formatted.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  
  return formatted;
}

function updatePreview() {
  const text = customTextInput ? customTextInput.value : '';
  const formatted = formatText(text);
  
  if (textPreview) {
    if (formatted) {
      textPreview.innerHTML = escapeHtml(formatted);
    } else {
      textPreview.innerHTML = '<span class="preview-placeholder">在上方输入文本后，这里将显示格式化后的练习内容预览</span>';
    }
  }
}

function updateStartButton() {
  const text = customTextInput ? customTextInput.value.trim() : '';
  if (startCustomPractice) {
    startCustomPractice.disabled = text.length < 10; // Minimum 10 characters
  }
}

function loadTemplate(templateType) {
  const templateText = window.CONTENT_TEMPLATES && window.CONTENT_TEMPLATES[templateType];
  if (templateText && customTextInput) {
    customTextInput.value = templateText;
    updateTextStats();
    updatePreview();
    updateStartButton();
  }
}

// Event listeners for custom text modal
if (closeCustomText) {
  closeCustomText.addEventListener('click', hideCustomTextModal);
}

if (cancelCustomText) {
  cancelCustomText.addEventListener('click', hideCustomTextModal);
}

if (customTextModal) {
  customTextModal.addEventListener('click', (e) => {
    if (e.target === customTextModal) {
      hideCustomTextModal();
    }
  });
}

if (customTextInput) {
  customTextInput.addEventListener('input', () => {
    updateTextStats();
    updatePreview();
    updateStartButton();
  });
}

if (startCustomPractice) {
  startCustomPractice.addEventListener('click', () => {
    const text = customTextInput ? customTextInput.value.trim() : '';
    if (text) {
      customText = formatText(text);
      hideCustomTextModal();
      showTypingPage('custom');
    }
  });
}

if (clearText) {
  clearText.addEventListener('click', () => {
    if (customTextInput) {
      customTextInput.value = '';
      updateTextStats();
      updatePreview();
      updateStartButton();
      customTextInput.focus();
    }
  });
}

if (pasteText) {
  pasteText.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && customTextInput) {
        customTextInput.value = text;
        updateTextStats();
        updatePreview();
        updateStartButton();
      }
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      console.log('Clipboard access not available');
    }
  });
}

if (preserveFormatting) {
  preserveFormatting.addEventListener('change', () => {
    updatePreview();
  });
}

if (removeExtraSpaces) {
  removeExtraSpaces.addEventListener('change', () => {
    updatePreview();
  });
}

// Template button event listeners
templateBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const templateType = btn.dataset.template;
    loadTemplate(templateType);
  });
});

// Initialize
let inputSystemInitialized = false;

function initializeApp() {
  console.log('Initializing app...');
  
  if (homePage && homePage.style.display !== 'none') {
    updateStatsDisplay();
  } else {
    // If starting in typing mode, initialize with words
    generateContent('words');
    render();
  }
  
  // 初始化新的输入系统（只初始化一次）
  if (!inputSystemInitialized) {
    setupInputSystem();
    inputSystemInitialized = true;
  }
}

// 页面加载完成后的初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // 如果DOM已经加载完成，直接初始化
  initializeApp();
}