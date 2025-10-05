const leaderboardRoot = document.getElementById('leaderboard-root');
let allTyping = [];
let topUsers = [];

function renderLeaderboard() {
        leaderboardRoot.innerHTML = `
            <div class="min-h-[100vh] bg-gradient-to-b from-[#3f4043] to-[#333437] text-white">
                <header class="bg-[#333437] border-b border-slate-800">
                    <div class="px-4 py-3 flex items-center justify-between">
                        <a href="index.html" class="text-lg font-semibold text-[#E2B715]">nanoType</a>
                        <div class="flex items-center gap-4">
                            <a href="profile.html" class="text-[#E2B715] hover:text-[#E2B715]">Profile</a>
                        </div>
                    </div>
                </header>
    
                <div class="max-w-4xl mx-auto px-4 py-8">
                    <div class="text-center mb-8">
                        <h1 class="text-4xl font-bold text-[#E2B715] mb-4">Leaderboard</h1>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="bg-[#2B2E30] rounded-xl p-6 shadow-sm border border-slate-700 text-center">
                            <div class="text-3xl font-bold text-white" id="total-users">-</div>
                            <div class="text-[#E2B715]">Total Users</div>
                        </div>
                        <div class="bg-[#2B2E30] rounded-xl p-6 shadow-sm border border-slate-700 text-center">
                            <div class="text-3xl font-bold text-white" id="total-sessions">-</div>
                            <div class="text-[#E2B715]">Total Typing Sessions</div>
                        </div>
                        <div class="bg-[#2B2E30] rounded-xl p-6 shadow-sm border border-slate-700 text-center">
                            <div class="text-3xl font-bold text-white" id="best-wpm">-</div>
                            <div class="text-[#E2B715]">Best WPM</div>
                        </div>
                    </div>
                    
                    <div id="leaderboard-content">
                        <div class="bg-[#2B2E30] rounded-2xl shadow-xl">
                            <div class="p-6">
                                <h2 class="text-2xl font-bold text-[#D1D0C5]">Leaderboard</h2>
                                <p class="text-[#D1D0C5]">(by wpm)</p>
                            </div>
                            <div class="p-6">
                                <div id="leaderboard-list"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        loadLeaderboard();
}

async function loadLeaderboard() {
        try {
            if (!window.dbManager || !window.dbManager.db) {
                await window.dbManager.init();
            }
            
            const allUsers = await window.dbManager.getAllUsers();
            
            if (!allUsers || allUsers.length === 0) {
                return;
            }
            
            allTyping = [];
            allUsers.forEach(user => {
                if (user.history && user.history.length > 0) {
                    user.history.forEach(session => {
                        allTyping.push({
                            username: user.username,
                            email: user.email,
                            wpm: session.wpm,
                            accuracy: session.accuracy,
                            timestamp: session.timestamp,
                            duration: session.duration || 60
                        });
                    });
                }
            });
            
            topUsers = allTyping.sort((a,b) => b.wpm - a.wpm).slice(0,10);
            
            updateStats(allUsers,allTyping);
            
            renderLeaderboardContent();
            
        } catch (err) {
            console.log(err);
        }
}

function updateStats(allUsers,allTyping) {
    const totalUsers = allUsers.length;
    const totalTypings = allTyping.length;
    const bestWpm = allTyping.length > 0 ? Math.max(...allTyping.map(typing => typing.wpm)) : 0;
        
    document.getElementById('total-users').textContent = totalUsers;
    document.getElementById('total-sessions').textContent = totalTypings;
    document.getElementById('best-wpm').textContent = Math.round(bestWpm);
}

function renderLeaderboardContent() {
        const leaderboardList = document.getElementById('leaderboard-list');
        
        const leaderboardHTML = topUsers.map((user,index) => {
            const rank = index + 1;
            
            return `
                <div class="flex items-center justify-between p-4 border border-slate-700 rounded-lg mb-3">
                    <div class="flex items-center gap-4">
                        <img src="https://api.dicebear.com/9.x/bottts/svg?seed=${user.username}" 
                            class="w-10 h-10 rounded-full"
                        />
                        <div>
                            <div class="font-semibold text-[#D1D0C5]">${user.username}</div>
                            <div class="text-sm text-[#E2B715]">${user.email}</div>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-6">
                        <div class="text-center">
                            <div class="text-lg font-bold text-[#D1D0C5]">${Math.round(user.wpm)}</div>
                            <div class="text-xs text-[#E2B715]">WPM</div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-semibold text-[#D1D0C5]">${user.accuracy.toFixed(1)}%</div>
                            <div class="text-xs text-[#E2B715]">Accuracy</div>
                        </div>
                        <div class="text-center">
                            <div class="text-lg font-bold text-[#D1D0C5]">${rank}</div>
                            <div class="text-xs text-[#E2B715]">Rank</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        leaderboardList.innerHTML = leaderboardHTML;
}

renderLeaderboard();