const loginRoot = document.getElementById('login-root');

function renderLogin() {
    loginRoot.innerHTML = `
            <div class="h-[100vh] [w-100vw] bg-[#333437] text-slate-100 flex items-center justify-center">
                <div class="w-[400px]">
                    <div class="bg-[#2B2E30] shadow-xl rounded-2xl p-8">
                        <div class="text-center mb-8">
                            <h1 class="text-3xl font-bold text-[#D1D0C5] mb-2">Welcome Back</h1>
                        </div>
                        
                        <form id="login-form" class="space-y-6">
                            <div>
                                <label for="login-username" class="text-sm font-medium text-[#D1D0C5] mb-2">
                                    Username
                                </label>
                                <input 
                                    type="text" 
                                    id="login-username" 
                                    required
                                    class="w-full px-4 py-3 rounded-lg bg-[#333437] text-white focus:outline-none focus:ring-2 focus:ring-[#D1D0C5] focus:border-transparent"
                                    placeholder="Enter your username"
                                >
                            </div>
                            
                            <div>
                                <label for="login-password" class="text-sm font-medium text-[#D1D0C5] mb-2">
                                    Password
                                </label>
                                <input 
                                    type="password" 
                                    id="login-password" 
                                    required
                                    class="w-full px-4 py-3 rounded-lg bg-[#333437] text-white focus:outline-none focus:ring-2 focus:ring-[#D1D0C5] focus:border-transparent"
                                    placeholder="Enter your password"
                                >
                            </div>
                            
                            <button 
                                type="submit" 
                                class="w-full bg-[#D1D0C5] text-black py-3 rounded-lg hover:bg-[#D1D0C5] focus:outline-none focus:ring-2 focus:ring-[#D1D0C5]"
                            >
                                Sign In
                            </button>
                        </form>
                        
                        <div class="mt-6 text-center">
                            <p class="text-slate-400">
                                Don't have an account? 
                                <button id="signup-nav" class="text-[#D1D0C5] hover:text-[#D1D0C5] font-medium">
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        LoginEvents();
    }
    
    function LoginEvents() {
        const form = document.getElementById('login-form');
        const SignupNav = document.getElementById('signup-nav');
        
        form.addEventListener('submit',(e) => {
            e.preventDefault();
            handleLogin();
        })
        
        SignupNav.addEventListener('click',() => {
            window.location.href = 'signup.html';
        })
    }
    
    async function handleLogin() {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        
        if (!username || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        try {
            const user = await dbManager.getUser(username);
            
            if (!user) {
                alert('Username not found');
                return;
            }
            
            if (user.password != password) {
                alert('Incorrect password');
                return;
            }
            
            sessionStorage.setItem('username',username);
            sessionStorage.setItem('userEmail',user.email);
            
            window.location.href = 'index.html';
            
        } catch (err) {
            alert('Some error occurred during login');
        }
    }


renderLogin();