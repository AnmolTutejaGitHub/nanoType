const root = document.getElementById('root');


const constants = {
    CORRECT : 'correct',
    INCORRECT : 'incorrect',
    PENDING : 'pending',
    CURRENT : 'current',
}

class NanoType {
    constructor(targetText){
        this.targetText = targetText;
        this.inputText = '';
        this.startedAt = null;
        this.wpm = 0;
        this.wordsPerWord = 5;
        this.accuracy = 100;
        this.increaseCapacity = null;
    }
    start(){
        if(this.startedAt) return;
        this.startedAt = new Date();
    }
    reset(newText){
        this.targetText = newText;
        this.inputText = '';
        this.startedAt = null;
        this.isFinished = false;
        this.wpm = 0;
        this.accuracy = 100;
    }

    setInput(input) {
        if(!this.startedAt) {
          this.start();
        }
        this.inputText = input;
        this.expandCapacity();
    }

    calculateStats(){
        let correct = 0;
        let error = 0;
        for(let i=0;i<this.inputText.length;i++) {
          if(this.targetText[i] === this.inputText[i]) correct++; 
          else error++;
        }
        const now = Date.now();
        const TimeTaken = this.startedAt ? now - this.startedAt : 1; //mili
        const TimeTakenMin = TimeTaken / 60000;
        const totalWordsTyped = correct / this.wordsPerWord;
        this.wpm = totalWordsTyped / TimeTakenMin;
        this.accuracy = this.inputText.length == 0 ? 100 : (correct / this.inputText.length) * 100;
    }

    getState(){
        const states = [];
        for(let i=0;i<this.targetText.length;i++) {
          if(i < this.inputText.length) {
            states.push(this.inputText[i] == this.targetText[i] ? constants.CORRECT : constants.INCORRECT);
          } else if(i == this.inputText.length) {
            states.push(constants.CURRENT);
          } else {
            states.push(constants.PENDING);
          }
        }
        return states;
    }

    expandCapacity() {
        const remaining = this.targetText.length - this.inputText.length;
        if(remaining < 50) {
          const extra = this.increaseCapacity();
          this.targetText += extra;
        }
    }
}


function App(){
    root.innerHTML = `
        <div class="min-h-screen bg-slate-900 text-slate-100">
            <div id="navbar"></div>
            <div id="banner"></div>
            <div id="typing"></div>
            <div id="features"></div>
            <div id="how_it_works"></div>
            <div id="faq"></div>
            <div id="footer"></div>
        </div>
    `
    Navbar();
    Banner();
    Features();
    HowItWorks();
    FAQ();
    Footer();
    TypingSection();
}

function Navbar(){
    const navbar = document.getElementById('navbar');
    const username = sessionStorage.getItem('username');

    const userNav = username ? 
    `<div class="flex items-center gap-3">
             <a href="profile.html" class="flex items-center gap-2 pl-3 pr-3 pt-2 pb-2 text-sm rounded-md bg-slate-800 text-slate-200 hover:bg-slate-700">
               <div class="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                 ${username.charAt(0).toUpperCase()}
               </div>
               <span>${username}</span>
             </a>
             <button id="logout-btn" class="pl-3 pr-3 pt-2 pb-2 text-sm rounded-md bg-sky-600 text-white hover:bg-sky-700">Logout</button>
           </div>`
        : `<div class="flex items-center gap-3">
             <a href="login.html" class="pl-3 pr-3 pt-2 pb-2 text-sm rounded-md bg-sky-600 text-white hover:bg-sky-700">Login</a>
             <a href="signup.html" class="pl-3 pr-3 pt-2 pb-2 text-sm rounded-md border border-slate-700 hover:bg-slate-800">Sign Up</a>
           </div>`;
    
    navbar.innerHTML = `
      <header class="bg-slate-900/70 border-b border-slate-800">
        <div class="w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#home" class="text-lg font-semibold text-white">nanoType</a>
          <div class="flex items-center gap-6">
            <nav class="hidden md:flex items-center gap-6 text-sm text-slate-300">
              <a class="hover:text-white" href="#practice">Practice</a>
              <a class="hover:text-white" href="#features">Features</a>
              <a class="hover:text-white" href="#how_it_works">How it works</a>
              <a class="hover:text-white" href="#faq">FAQ</a>
              <a class="hover:text-white" href="leaderboard.html">Leaderboard</a>
            </nav>
            ${userNav}
          </div>
        </div>
      </header>
    `;

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click',() => logout());
    }
}

function Banner(){
   const banner = document.getElementById('banner');
   banner.innerHTML = `
      <section id="home" class="bg-gradient-to-b from-slate-800 to-slate-900">
        <div class="max-w-6xl mx-auto px-4 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 class="text-5xl font-bold mb-4 text-white">Type faster. Type cleaner.</h1>
            <p class="text-slate-300 text-lg mb-6">Measure your typing speed and accuracy. See leaderboard and get a chance to be there. Get Started Now</p>
            <div class="flex gap-3">
              <a href="#practice" class="px-5 py-3 rounded-md bg-sky-600 text-white hover:bg-sky-700">Start practicing</a>
              <a href="#features" class="px-5 py-3 rounded-md border border-slate-700 hover:bg-slate-800">Explore features</a>
            </div>
          </div>
          <div class="hidden md:block">
            <div class=" aspect-[16/9] rounded-2xl bg-slate-800 shadow-xl flex items-center justify-center">
                <img src="../assests/banner.png" class="w-full h-full rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    `;
}

function Features() {
    const features = [
      {title: "Endless Text",description: "New sentences are added automatically so you never run out."},
      {title: "Live WPM & Accuracy",description: "Real-time calculations as you type, with gentle highlighting."},
      {title: "Instant Speed & Accuracy",description: "See your WPM and accuracy update live, with soft highlights to guide your progress."},
      {title: "Progress Tracking",description: "Save your best scores locally and see your improvement over time with simple, clear stats."},
      {title: "Endless Text",description: "New sentences are added automatically so you never run out."},
      {title: "Live WPM & Accuracy",description: "Real-time calculations as you type, with gentle highlighting."},
    ]
  
    const featuresHTML = features.map(item => {
        return `<div class="p-5 rounded-xl bg-slate-800 shadow-sm rounded-sm bg-slate-700">
        <div class="flex items-center mb-1">
          <div class="font-semibold text-white">${item.title}</div>
        </div>
        <div class="text-sm text-slate-400">${item.description}</div>
      </div>`
    }).join('');
  
    const features_ = document.getElementById('features');

    features_.innerHTML = `
      <section id="features" class="py-14 bg-slate-900/50">
        <div class="max-w-6xl mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold mb-6 text-white">Features</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${featuresHTML}
          </div>
        </div>
      </section>
    `;
}

function HowItWorks() {
    const steps = [
      "Click Start or begin typing to start the 60 second timer.",
      "Type the text shown. Correct characters increase WPM, mistakes lower accuracy.",
      "When time runs out, your results pop up. Reset to try again."
    ]
  
    const stepsHTML = steps.map(step => {
        return `<li>${step}</li>`
    }).join('');
  
    const howItWorks = document.getElementById('how_it_works');
    howItWorks.innerHTML = `
      <section id="how" class="py-14">
        <div class="flex flex-col items-center px-4">
          <h2 class="text-3xl font-bold mb-4 text-white">How it works</h2>
          <ol class="list-decimal pl-5 space-y-3 text-slate-300">
            ${stepsHTML}
          </ol>
        </div>
      </section>
    `;
}

  function FAQ() {
    const faqs = [
      {que: "What is WPM?",ans: "Words per minute. We use 5 characters as one word for calculation."},
      {que: "How is accuracy calculated?",ans: "Correct characters divided by total typed characters."},
      {que: "Why endless text?",ans: "To keep you in flow without interruptions or page reloads."},
      {que: "Can I use my own text?",ans: "No currently there is no way to do so."},
    ]
  
    const faqHTML = faqs.map((item) => {
        return `
            <div class="p-5 rounded-xl bg-slate-800">
                <div class="font-medium mb-1 text-white">${item.que}</div>
                <div class="text-sm text-slate-400">${item.ans}</div>
            </div>
        `;
    }).join('');
  
    const faq = document.getElementById('faq');
    faq.innerHTML = `
      <section id="faq" class="py-14 bg-slate-900/50">
        <div class="max-w-6xl mx-auto px-4">
          <h2 class="text-3xl font-bold mb-6 text-white">FAQ</h2>
          <div class="grid md:grid-cols-2 gap-6">
            ${faqHTML}
          </div>
        </div>
      </section>
    `;
  }

  function Footer(){
    const year = new Date().getFullYear();
    const footer = document.getElementById('footer');
    footer.innerHTML = `
      <footer class="mt-16 border-t border-slate-800">
        <div class="px-4 py-8 text-sm text-slate-400 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>© ${year} Anmol Tuteja</div>
        </div>
      </footer>
    `;
}

const texts = [
    "Typing quickly and accurately takes practice. Keep your eyes on the text and try to maintain a steady rhythm.",
    "Practice makes perfect: type every day, track your progress, and focus on accuracy before speed.",
    "Modern web development often requires a balance of creativity and logic. Practice helps you internalize common patterns.",
    "Small improvements compound over time. A few minutes of focused practice every day will make a big difference.",
    "JavaScript is a language that lets you manipulate the web in realtime. Building useful tools helps you learn faster.",
    "Consistency beats intensity. Short daily sessions are better than rare marathon sessions.",
    "Keyboard familiarity reduces cognitive load. The fewer keys you hunt for, the faster you type.",
    "Mistakes are part of learning. Correct them quickly and keep going without losing flow.",
    "Speed comes after accuracy. Aim for clean input first, then increase your pace gradually.",
    "Reading ahead by a few words can help you buffer what to type and reduce pauses."
  ];
  
function pickRandomText() {
    return texts[Math.floor(Math.random() * texts.length)];
}

let initialText = `${pickRandomText()} ${pickRandomText()}`;

let appState = {
  nano: new NanoType(initialText),
  totalTime : 60, //in Secc
  timeLeft : 60,
  timerHandler : null,
}

appState.nano.increaseCapacity = () => pickRandomText();

function renderText(nano) {
  const states = nano.getState();
  const chars = nano.targetText.split('');
  const spans = chars.map((ch,idx) => {
    let className = 'text-slate-400';
    if (states[idx] == constants.CORRECT) className = 'text-emerald-400';
    if (states[idx] == constants.INCORRECT) className = 'text-red-400 bg-red-900/20';
    if (states[idx] == constants.CURRENT) className = 'animate-pulse bg-sky-900/30';
    return `<span class="${className}">${ch}</span>`;
  }).join('');
  return `<div id="text-block" class="font-mono text-lg md:text-xl leading-relaxed break-words">${spans}</div>`;
}

function TypingSection(){
    const typing = document.getElementById('typing');
    const targetBlock = renderText(appState.nano);
    const stats = `
      <div class="grid grid-cols-4 gap-3 text-sm text-slate-300">
        <div class="p-3 rounded-lg bg-slate-800/50">
          <div class="text-slate-400">WPM</div><div class="text-xl font-semibold text-white">${Math.round(appState.nano.wpm)}</div>
        </div>
        <div class="p-3 rounded-lg bg-slate-800/50">
          <div class="text-slate-400">Accuracy</div><div class="text-xl font-semibold text-white">${appState.nano.accuracy.toFixed(0)}%</div>
        </div>
        <div class="p-3 rounded-lg bg-slate-800/50">
          <div class="text-slate-400">Time left</div>
          <div class="text-xl font-semibold text-white">${appState.timeLeft}s</div>
          <div class="mt-2 h-1.5 rounded-full bg-slate-700">
            <div class="h-full bg-sky-500 rounded-full transition-width duration-200" style="width: ${(appState.timeLeft / appState.totalTime * 100).toFixed(2)}%"></div>
          </div>
        </div>
      </div>
    `;

    let main;
    if (appState.nano.isFinished) {
      const Wpm = Math.round(appState.nano.wpm);
      const Accuracy = `${appState.nano.accuracy.toFixed(0)}%`;
      main = `
        <div class="p-6 rounded-xl bg-slate-800 shadow-sm text-center">
          <h2 class="text-2xl font-bold mb-4 text-white">Ended!</h2>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div class="text-slate-400">WPM</div>
              <div class="text-3xl font-bold text-white">${Wpm}</div>
            </div>
            <div>
              <div class="text-slate-400">Accuracy</div>
              <div class="text-3xl font-boldtext-white">${Accuracy}</div>
            </div>
          </div>
          <button id="restart-btn" class="px-6 py-3 rounded-md bg-sky-600 text-white hover:bg-sky-700">Restart</button>
        </div>
      `;
    } else {
      main = `
        <textarea id="typing-input" class="w-full h-28 md:h-36 px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-white placeholder-slate-400 resize-none focus:outline-none placeholder="Start typing here..."></textarea>
        <div class="mt-4 flex items-center gap-3">
          <button id="start-btn" class="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700">Start</button>
          <button id="reset-btn" class="px-4 py-2 rounded-md bg-slate-700 text-slate-200hover:bg-slate-600">Reset</button>
        </div>
      `;
    }

   typing.innerHTML = `
      <section id="practice" class="py-14">
        <div class="max-w-6xl mx-auto px-4">
          <div class="grid grid-cols-3 gap-6 items-start">
            <div class="col-span-2">
              <div class="p-5 rounded-xl bg-slate-800 shadow-sm mb-4">
                <div class="mb-4">${targetBlock}</div>
                ${main}
              </div>
            </div>
            <div class="space-y-3">${stats}</div>
      </section>
    `;
}

function TypingEvents() {
    const input = document.getElementById('typing-input');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const restartBtn = document.getElementById('restart-btn');
  
    if(input){
      input.value = appState.nano.inputText;
      input.oninput = (e) => {
        if(!appState.nano.startedAt) {
            appState.nano.start();
            appState.timerHandler = setInterval(() => {
                TimeUpdate();
            },250);
        }
        if(appState.timeLeft <= 0) return;
        appState.nano.setInput(e.target.value);
        updateUI();
      }
    }
  
    if(startBtn) {
      startBtn.onclick = () => {
        if (!appState.nano.startedAt) {
            appState.nano.start();
            appState.timerHandler = setInterval(() => {
                TimeUpdate();
            },250);
        }
        const textarea = document.getElementById('typing-input');
        if (textarea) textarea.focus();
      }
    }
  
    if (resetBtn) {
      resetBtn.onclick = () => {
        ResetType();
      };
    }
  
    if (restartBtn) {
      restartBtn.onclick = () => {
        ResetType();
      };
    }
  }

  function ResetType(){
    appState.nano.isFinished = true;

    if(appState.timerHandler){
        clearInterval(appState.timerHandler);
        appState.timerHandler = null;
    }

    initialText = `${pickRandomText()} ${pickRandomText()}`;
    appState = {
        nano: new NanoType(initialText),
        totalTime: 60,
        timeLeft: 60,
        timerHandler: null,
    };
    appState.nano.increaseCapacity = () => pickRandomText();

    TypingSection(appState);
    TypingEvents();
    document.getElementById("typing-input")?.focus();
}

function updateUI() {
  if(appState.nano.startedAt) {
    appState.nano.calculateStats();
    TypingSection();
    TypingEvents();
    document.getElementById("typing-input")?.focus();
  }
}

function TimeUpdate(){
    if(appState.nano.isFinished) return;
    if(!appState.nano.startedAt) return;
    const now = Date.now();
    const diffSec = Math.floor((now - appState.nano.startedAt)/1000);
    const timeLeft = appState.totalTime - diffSec;
    if(timeLeft<=0){
        appState.timeLeft = 0;
        appState.nano.isFinished = true;
        updateUI();
        clearInterval(appState.timerHandler);
        appState.timerHandler = null;
        
        showSaveToHistory();
        return;
    }
    appState.timeLeft = timeLeft;
    updateUI();
}

function logout() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userEmail');
    Navbar();
}

function showSaveToHistory() {
    
}

function saveSessionToHistory() {
   
}


function initApp() {
    App();
   TypingEvents();
}

initApp();
