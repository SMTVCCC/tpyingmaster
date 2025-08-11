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
let WORDS = `time year people way day man thing woman life child world school state family student group country problem hand party place case week company system program question work night point home water room mother area money story fact month lot right study book eye job word business issue side kind head house service friend father power hour game line end member law car city community name president team minute idea kid body information back parent face others level office door health person art war history party result change morning reason research girl guy moment air teacher force education`.
  split(/\s+/);

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
  
  // Focus the stage for immediate typing
  if (stageEl) {
    setTimeout(() => {
      stageEl.focus();
    }, 100);
  }
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
let soundType = 'electronic'; // 'electronic' or 'keyboard'
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

function render(){
  const before = text.slice(0, index);
  const current = text[index] ?? '';
  const after = text.slice(index + 1);

  textEl.innerHTML = `
    <span class="done">${escapeHtml(before)}</span>
    <span class="current">${escapeHtml(current || ' ')}</span>
    <span>${escapeHtml(after)}</span>
  `;
  progressEl.textContent = Math.round((index / text.length) * 100) + '%';
  const acc = keystrokes ? Math.max(0, Math.round((1 - wrong/keystrokes) * 100)) : 0;
  accEl.textContent = acc + '%';
  const mins = startedAt ? (Date.now() - startedAt)/60000 : 0;
  const wpm = mins > 0 ? Math.round((index/5) / mins) : 0; // 5 chars per word
  wpmEl.textContent = String(wpm);
  kpmEl.textContent = mins > 0 ? String(Math.round(keystrokes / mins)) : '0';
}

function escapeHtml(s){
  return s.replace(/[&<>"]|\n/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\n':'<br>'}[ch]));
}

function reset(){
  generateContent(currentMode);
  index = 0; keystrokes = 0; wrong = 0; startedAt = null; sessionStartTime = null;
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
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const key = e.key;
  
  if (!startedAt) { 
    startedAt = Date.now(); 
    sessionStartTime = Date.now();
    if (hintEl) hintEl.textContent = '';
    
    // Initialize audio context on first user interaction
    if (enableSound && !audioCtx) {
      initAudio();
    }
  }
  
  if (key.length === 1) {
    keystrokes++;
    const expected = text[index];
    if (key === expected) {
      index++;
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
      wrong++;
      playClick('err');
      flashWrong();
    }
    render();
  } else if (key === 'Backspace') {
    if (index > 0) index--;
    render();
  } else if (key === 'Enter') {
    const nextSpace = text.indexOf(' ', index);
    index = nextSpace === -1 ? text.length : nextSpace + 1;
    render();
  }
}

function flashWrong(){
  const cur = textEl.querySelector('.current');
  if (!cur) return;
  cur.classList.add('wrong');
  setTimeout(()=>cur.classList.remove('wrong'), 140);
}

// Event listeners
window.addEventListener('keydown', (e) => {
  // Only handle typing events when on typing page
  if (typingPage && typingPage.style.display !== 'none') {
    onKey(e);
  } else if (homePage && homePage.style.display !== 'none') {
    // Handle keyboard shortcuts on home page
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
});

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
let TEMPLATES = {
  article: `Technology has revolutionized the way we communicate, work, and live. From smartphones that connect us instantly to people across the globe, to artificial intelligence that helps us solve complex problems, we are living in an era of unprecedented innovation. The digital transformation has not only changed how businesses operate but also how we learn, shop, and entertain ourselves. As we move forward, it's important to embrace these changes while being mindful of their impact on society and our daily lives.`,
  
  dialogue: `"Good morning, Sarah! How was your weekend?" asked Tom as he entered the office.\n\n"It was wonderful, thank you for asking," Sarah replied with a smile. "I went hiking with my family and we discovered a beautiful trail near the lake. The weather was perfect, and we even saw some deer along the way."\n\n"That sounds amazing! I've been meaning to explore more outdoor activities myself," Tom said. "Would you recommend that trail for beginners?"\n\n"Absolutely! It's not too challenging, and the scenery is breathtaking. I can send you the location if you're interested."`,
  
  technical: `The implementation of RESTful APIs requires careful consideration of HTTP methods, status codes, and resource naming conventions. When designing endpoints, developers should follow the principle of statelessness, ensuring that each request contains all necessary information. Authentication mechanisms such as JWT tokens or OAuth 2.0 provide secure access control. Error handling should be consistent and informative, returning appropriate status codes like 404 for not found, 401 for unauthorized, and 500 for server errors. Proper documentation using tools like Swagger or OpenAPI specifications enhances API usability and adoption.`,
  
  numbers: `Invoice #2024-001: Total amount $1,234.56. Payment due: 30 days. Account: 4532-1234-5678-9012. Reference: TXN-789456123. Quantity: 25 units @ $49.38 each. Tax rate: 8.25%. Shipping: $15.00. Discount: 10% ($123.46). Net total: $1,111.10. Phone: (555) 123-4567. ZIP: 90210. Order date: 03/15/2024. Customer ID: C-98765. Product codes: SKU-001, SKU-002, SKU-003.`
};

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
  const templateText = TEMPLATES[templateType];
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
}