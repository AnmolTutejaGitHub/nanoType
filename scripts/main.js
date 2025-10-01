const root = document.getElementById('root');


const constants = {
    CORRECT : 'correct',
    INCORRECT : 'incorrect',
    PENDING : 'pending',
    CURRENT : 'current',
}

class NanoType {
    constructor(displayText){
        this.displayText = displayText;
        this.inputText = '';
        this.startedAt = null;
        this.wpm = 0;
        this.wordsPerWord = 5;
        this.accuracy = 100;
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
}


function App(){
    root.innerHTML = `
        <div class="min-h-screen bg-slate-900 text-slate-100">
            <div id="navbar"></div>
            <div id="banner"></div>
            <div id="typing"></div>
            <div id="features"></div>
            <div id="faq"></div>
            <div id="footer"></div>
        </div>
    `
    Navbar();
    Banner();
    Features();
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

App();
