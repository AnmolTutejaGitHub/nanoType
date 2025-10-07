const profileRoot = document.getElementById('profile-root');
const username = sessionStorage.getItem('username');
const userEmail = sessionStorage.getItem('userEmail');

function renderProfile() {
    if (!username) {
        profileRoot.innerHTML = `
                <div class="min-h-[100vh] bg-gradient-to-b from-[#3f4043] to-[#333437] flex items-center justify-center">
                    <div class="text-center">
                       <h1 class="text-[#D1D0C5]">Bro You need to logged In</h1>
                       <div class="px-6 py-3 bg-[#D1D0C5] text-black rounded-lg"><a href="login.html">Login</div></p>
                    </div>
                </div>
            `;
            return;
        }
        
        profileRoot.innerHTML = `
            <div class="min-h-[100vh] bg-gradient-to-b from-[#3f4043] to-[#333437] text-white">
                <header class=bg-[#2B2E30] border-b border-slate-800">
                    <div class="px-4 py-3 flex items-center justify-between">
                        <a href="index.html" class="text-lg font-semibold text-[#E2B715]">nanoType</a>
                        <div class="flex items-center gap-4">
                            <button id="logout-btn" class="px-3 py-1 text-sm rounded-md bg-[#D1D0C5] text-black">Logout</button>
                        </div>
                    </div>
                </header>
                
                <div class="max-w-4xl mx-auto px-4 py-8">
                    <div class="bg-[#2B2E30] rounded-2xl shadow-xl p-8 mb-8">
                        <div class="flex items-center gap-6">
                                <img src="https://api.dicebear.com/9.x/bottts/svg?seed=${username}" 
                                    class="w-10 h-10 rounded-full"
                                />
                            <div>
                                <h1 class="text-3xl font-bold text-[#D1D0C5] mb-2">${username}</h1>
                                <p class="text-[#D1D0C5] text-lg">${userEmail}</p>
                                <div class="mt-2 text-sm text-[#D1D0C5]">
                                   Joined ${new Date().toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="bg-[#2B2E30] rounded-xl p-6">
                            <div class="text-3xl font-bold text-[#D1D0C5]" id="total-tests">-</div>
                            <div class="text-[#D1D0C5]">Total</div>
                        </div>
                        <div class="bg-[#2B2E30] rounded-xl p-6">
                            <div class="text-3xl font-bold text-[#D1D0C5]" id="best-wpm">-</div>
                            <div class="text-[#D1D0C5]">Best WPM</div>
                        </div>
                        <div class="bg-[#2B2E30] rounded-xl p-6">
                            <div class="text-3xl font-bold text-[#D1D0C5]" id="avg-accuracy">-</div>
                            <div class="text-[#D1D0C5]">Avg Accuracy</div>
                        </div>
                    </div>
                    
                    
                    <div class="bg-[#2B2E30] rounded-2xl">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold text-[#D1D0C5]">History</h2>
                        </div>
                        <div class="p-6">
                            <div id="history-content">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        ProfileEvents();
        loadUserData();
    }
    
    function ProfileEvents() {
        const logoutBtn = document.getElementById('logout-btn');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click',() => {
                sessionStorage.removeItem('username');
                sessionStorage.removeItem('userEmail');
                window.location.href = 'index.html';
            });
        }
    }
    
    
    async function loadUserData() {
        try {
            if(!window.dbManager.db) {
                await window.dbManager.init();
            }
            
            const user = await window.dbManager.getUser(username);
            
            if(user){
                if(user.history && user.history.length > 0) {
                    calculateStats(user.history);
                    displayHistory(user.history);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
    
    function displayHistory(history) {
        const historyContent = document.getElementById('history-content');
        
        historyContent.innerHTML = history.map((typing,index) => `
            <div class="rounded-lg p-6 mb-4">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <p class="text-sm text-[#D1D0C5]">
                            ${new Date(typing.timestamp).toLocaleString()}
                        </p>
                    </div>
                    <div class="text-sm text-[#D1D0C5]">
                        ${typing.duration || 60}s
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-[#D1D0C5] mb-1">
                            ${Math.round(typing.wpm)}
                        </div>
                        <div class="text-sm text-[#D1D0C5]">Words Per Minute</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-[#D1D0C5] mb-1">
                            ${typing.accuracy.toFixed(1)}%
                        </div>
                        <div class="text-sm text-[#D1D0C5]">Accuracy</div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function calculateStats(history) {
        if (history.length === 0) {
            document.getElementById('total-tests').textContent = '0';
            document.getElementById('best-wpm').textContent = '0';
            document.getElementById('avg-accuracy').textContent = '0%';
            return;
        }
        
        const totalSessions = history.length;
        const bestWpm = Math.max(...history.map(s => s.wpm));
        const avgAccuracy = history.reduce((sum,hist) => sum + hist.accuracy,0) / history.length;
        
        document.getElementById('total-tests').textContent = totalSessions;
        document.getElementById('best-wpm').textContent = Math.round(bestWpm);
        document.getElementById('avg-accuracy').textContent = `${avgAccuracy.toFixed(1)}%`;
    }

renderProfile();