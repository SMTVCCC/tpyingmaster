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
let WORDS = `time year people way day man thing woman life child world school state family student group country problem hand party place case week company system program question work night point home water room mother area money story fact month lot right study book eye job word business issue side kind head house service friend father power hour game line end member law car city community name president team minute idea kid body information back parent face others level office door health person art war history party result change morning reason research girl guy moment air teacher force education`
  .split(/\s+/);

let SENTENCES = [
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

let QUOTES = [
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

let CODE_SNIPPETS = [
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

// Settings and state
let enableSound = true;
let currentMode = 'words';
let customText = '';

// Practice modes configuration - 现在从content.js文件管理
let MODES = {
  words: { name: '单词练习', description: 'English • Random Words' },
  sentences: { name: '句子练习', description: 'English • Sentences' },
  quotes: { name: '名言警句', description: 'English • Famous Quotes' },
  code: { name: '代码练习', description: 'Programming • Code Snippets' },
  custom: { name: '自定义文本', description: 'Custom • Your Text' },
  test: { name: '打字测试', description: 'Typing Test • 1 Minute' }
};

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
  if (typingPage) typingPage.style.display = 'none';
  updateStatsDisplay();
}

function showTypingPage(mode) {
  currentMode = mode;
  if (homePage) homePage.style.display = 'none';
  if (typingPage) typingPage.style.display = 'block';
  
  // Update lesson title
  if (promptMeta) {
    promptMeta.textContent = MODES[mode].description;
  }
  
  // Generate content based on mode
  generateContent(mode);
  reset();
  
  // 初始化焦点管理，确保在所有浏览器中都能正常接收按键事件
  setTimeout(() => {
    initializeFocus();
    ensureFocus();
  }, 100);
}

function generateContent(mode) {
  currentMode = mode; // 确保当前模式被正确设置
  
  switch (mode) {
    case 'words':
      text = randWords(80);
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

let text = '';
let index = 0;
let startedAt = null;
let keystrokes = 0;
let wrong = 0;
let sessionStartTime = null;
// 用于跟踪错误字符的状态
let errorCharacters = new Set(); // 存储错误字符的位置
let correctedCharacters = new Set(); // 存储已修正的字符位置

function render(){
  if (currentMode === 'words') {
    renderWordMode();
  } else {
    renderNormalMode();
  }
  
  // 更新统计信息
  progressEl.textContent = Math.round((index / text.length) * 100) + '%';
  const acc = keystrokes ? Math.max(0, Math.round((1 - wrong/keystrokes) * 100)) : 0;
  accEl.textContent = acc + '%';
  const mins = startedAt ? (Date.now() - startedAt)/60000 : 0;
  const wpm = mins > 0 ? Math.round((index/5) / mins) : 0; // 5 chars per word
  wpmEl.textContent = String(wpm);
  kpmEl.textContent = mins > 0 ? String(Math.round(keystrokes / mins)) : '0';
}

function renderWordMode() {
  // 找到当前单词的开始和结束位置
  let wordStart = index;
  let wordEnd = index;
  
  // 向前找到单词开始
  while (wordStart > 0 && text[wordStart - 1] !== ' ') {
    wordStart--;
  }
  
  // 向后找到单词结束
  while (wordEnd < text.length && text[wordEnd] !== ' ') {
    wordEnd++;
  }
  
  // 如果当前位置是空格，跳到下一个单词
  if (text[index] === ' ') {
    // 跳过空格找到下一个单词
    while (index < text.length && text[index] === ' ') {
      index++;
    }
    
    // 重新计算单词位置
    wordStart = index;
    wordEnd = index;
    while (wordEnd < text.length && text[wordEnd] !== ' ') {
      wordEnd++;
    }
  }
  
  const currentWord = text.slice(wordStart, wordEnd);
  const currentWordIndex = index - wordStart; // 在当前单词中的位置
  
  let wordHtml = '';
  for (let i = 0; i < currentWord.length; i++) {
    const charIndex = wordStart + i;
    const char = currentWord[i];
    
    if (i < currentWordIndex) {
      // 已完成的字符
      if (correctedCharacters.has(charIndex)) {
        wordHtml += `<span class="corrected">${escapeHtml(char)}</span>`;
      } else {
        wordHtml += `<span class="done">${escapeHtml(char)}</span>`;
      }
    } else if (i === currentWordIndex) {
      // 当前字符
      if (errorCharacters.has(charIndex)) {
        wordHtml += `<span class="current error">${escapeHtml(char || ' ')}</span>`;
      } else {
        wordHtml += `<span class="current">${escapeHtml(char || ' ')}</span>`;
      }
    } else {
      // 未完成的字符
      wordHtml += `<span class="pending">${escapeHtml(char)}</span>`;
    }
  }
  
  textEl.innerHTML = `<div class="word-mode">${wordHtml}</div>`;
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
  if (stageEl) stageEl.classList.remove('pop');
  if (hintEl) hintEl.textContent = '按任意键开始';
  render();
}

function finishSession() {
  if (!startedAt || !sessionStartTime) return;
  
  const duration = (Date.now() - sessionStartTime) / 1000; // seconds
  const mins = duration / 60;
  const wpm = mins > 0 ? Math.round((index/5) / mins) : 0;
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
}

function onKey(e){
  // 增强的按键处理，提高浏览器兼容性
  // Ignore modifier keys (except Shift for uppercase)
  if (e.metaKey || e.ctrlKey || e.altKey) {
    return;
  }
  
  // 获取按键，处理不同浏览器的兼容性
  let key = e.key;
  
  // 调试信息：记录按键事件
  console.log('onKey called:', {
    originalKey: e.key,
    keyCode: e.keyCode,
    shiftKey: e.shiftKey,
    code: e.code
  });
  
  // 处理某些浏览器中key值不一致的问题
  if (!key || key === 'Unidentified') {
    // 备用方案：使用keyCode
    if (e.keyCode) {
      if (e.keyCode === 8) key = 'Backspace';
      else if (e.keyCode === 13) key = 'Enter';
      else if (e.keyCode === 32) key = ' ';
      else if (e.keyCode >= 48 && e.keyCode <= 57) key = String.fromCharCode(e.keyCode); // 数字
      else if (e.keyCode >= 65 && e.keyCode <= 90) {
        // 字母 - 修复大小写处理逻辑
        // keyCode 65-90 对应 A-Z，需要根据 shiftKey 决定大小写
        key = String.fromCharCode(e.shiftKey ? e.keyCode : e.keyCode + 32);
      } else if (e.keyCode >= 186 && e.keyCode <= 222) {
        // 标点符号等特殊字符的处理
        const specialKeys = {
          186: e.shiftKey ? ':' : ';',
          187: e.shiftKey ? '+' : '=',
          188: e.shiftKey ? '<' : ',',
          189: e.shiftKey ? '_' : '-',
          190: e.shiftKey ? '>' : '.',
          191: e.shiftKey ? '?' : '/',
          192: e.shiftKey ? '~' : '`',
          219: e.shiftKey ? '{' : '[',
          220: e.shiftKey ? '|' : '\\',
          221: e.shiftKey ? '}' : ']',
          222: e.shiftKey ? '"' : "'"
        };
        key = specialKeys[e.keyCode] || key;
      }
    }
  }
  
  // 处理Space键的兼容性问题
  if (key === ' ' || key === 'Spacebar' || e.keyCode === 32) {
    key = ' ';
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
  
  if (key === 'Backspace') {
    if (index > 0) {
      index--;
      // 清除当前位置的错误和修正标记
      errorCharacters.delete(index);
      correctedCharacters.delete(index);
      render();
      playClick('backspace');
    }
    return;
  }

  if (key === 'Enter') {
    const nextSpace = text.indexOf(' ', index);
    index = nextSpace === -1 ? text.length : nextSpace + 1;
    render();
    return;
  }

  // Handle regular characters
  if (key && key.length === 1) {
    
    // 特别调试a、s、d字母
    if (key === 'a' || key === 's' || key === 'd' || key === 'A' || key === 'S' || key === 'D') {
      console.log('Processing letter:', {
        key: key,
        expected: text[index],
        index: index,
        keyCode: e.keyCode,
        originalKey: e.key
      });
    }
    
    keystrokes++;
    const expected = text[index];
    const isCorrect = key === expected;
    
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
      if (stageEl) {
        stageEl.classList.remove('pop');
        void stageEl.offsetWidth; // restart animation
        stageEl.classList.add('pop');
      }
      
      // Check if finished
      if (index >= text.length) {
        finishSession();
        if (currentMode === 'words') {
          // For words mode, continue with more content
          text += ' ' + randWords(40);
        } else {
          // For other modes, show completion
          if (hintEl) hintEl.textContent = '练习完成！按重打键继续';
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
}

function flashWrong(){
  const cur = textEl.querySelector('.current');
  if (!cur) return;
  cur.classList.add('wrong');
  setTimeout(()=>cur.classList.remove('wrong'), 140);
}

// 统一使用 keydown 事件处理，避免重复触发和浏览器兼容性问题
function setupKeyboardEvents() {
  window.addEventListener('keydown', handleKeyDown, { passive: false });
}

function handleKeyDown(e) {
  // 只在打字页面处理输入
  if (typingPage && typingPage.style.display !== 'none') {
    // 在打字模式下，对所有可能的输入键都阻止默认行为
    if (!e.isComposing && !e.metaKey && !e.ctrlKey && !e.altKey) {
      // 阻止所有可能影响打字的默认行为
      if (isTypingKey(e.key) || e.key === 'Tab' || e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    onKey(e);
  } else if (homePage && homePage.style.display !== 'none') {
    // 处理主页的快捷键
    if (e.key >= '1' && e.key <= '6') {
      e.preventDefault();
      const modes = ['words', 'sentences', 'quotes', 'code', 'custom', 'test'];
      const modeIndex = parseInt(e.key) - 1;
      if (modes[modeIndex]) {
        if (modes[modeIndex] === 'custom') {
          const userText = prompt('请输入你想练习的文本：');
          if (userText && userText.trim()) {
            customText = userText.trim();
            showTypingPage(modes[modeIndex]);
          }
        } else {
          showTypingPage(modes[modeIndex]);
        }
      }
    }
  }
}

function isTypingMode() {
  return typingPage && typingPage.style.display !== 'none';
}

function isTypingKey(key) {
  // 判断是否为打字相关的按键
  return key.length === 1 || key === 'Backspace' || key === 'Enter' || key === ' ' || key === 'Space';
}

function ensureFocus() {
  // 确保在打字模式下stage元素始终有焦点
  if (isTypingMode() && stageEl) {
    // 检查当前焦点元素
    const activeElement = document.activeElement;
    
    // 如果焦点不在stage元素上，重新设置焦点
    if (activeElement !== stageEl) {
      // 确保stage元素可以接收键盘事件
      if (stageEl.tabIndex < 0) {
        stageEl.tabIndex = 0;
      }
      stageEl.focus({ preventScroll: true });
    }
  }
}

// 添加额外的焦点管理函数
let focusInitialized = false;
function initializeFocus() {
  // 当进入打字页面时，确保正确设置焦点
  if (stageEl && !focusInitialized) {
    stageEl.tabIndex = 0;
    stageEl.focus({ preventScroll: true });
    
    // 添加点击事件以重新获取焦点（只添加一次）
    stageEl.addEventListener('click', () => {
      if (isTypingMode()) {
        stageEl.focus({ preventScroll: true });
      }
    });
    
    focusInitialized = true;
  } else if (stageEl && focusInitialized) {
    // 如果已经初始化过，只需要重新设置焦点
    stageEl.focus({ preventScroll: true });
  }
}

// 初始化键盘事件
setupKeyboardEvents();

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
if (homePage && homePage.style.display !== 'none') {
  updateStatsDisplay();
} else {
  // If starting in typing mode, initialize with words
  generateContent('words');
  render();
  // 确保在打字模式下正确初始化焦点
  setTimeout(() => {
    initializeFocus();
    ensureFocus();
  }, 200);
}

// 页面加载完成后的额外初始化
document.addEventListener('DOMContentLoaded', () => {
  // 确保所有元素都已加载
  setTimeout(() => {
    if (isTypingMode()) {
      initializeFocus();
    }
  }, 300);
});