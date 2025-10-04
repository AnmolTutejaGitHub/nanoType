const signupRoot = document.getElementById('signup-root');

function renderSignup() {
    signupRoot.innerHTML = `
            <div class="h-[100vh] w-[100vw] bg-slate-900 text-slate-100 flex items-center justify-center">
                <div class="w-[400px]">
                    <div class="bg-slate-800 shadow-xl rounded-2xl p-8">
                        <div class="text-center mb-8">
                            <h1 class="text-3xl font-bold text-white mb-2">Create Account</h1>
                        </div>
                        
                        <form id="signup-form" class="space-y-6">
                            <div>
                                <label for="signup-username" class="text-sm font-medium text-slate-300 mb-2">
                                    Username
                                </label>
                                <input 
                                    type="text" 
                                    id="signup-username" 
                                    required
                                    class="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    placeholder="Enter username"
                                >
                            </div>
                            
                            <div>
                                <label for="signup-email" class="text-sm font-medium text-slate-300 mb-2">
                                    Email
                                </label>
                                <input 
                                    type="email" 
                                    id="signup-email" 
                                    required
                                    class="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    placeholder="Enter your email"
                                >
                            </div>
                            
                            <div>
                                <label for="signup-password" class="text-sm font-mediumtext-slate-300 mb-2">
                                    Password
                                </label>
                                <input 
                                    type="password" 
                                    id="signup-password" 
                                    required
                                    class="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    placeholder="Create a password"
                                >
                            </div>
                            
                            <div>
                                <label for="signup-confirm-password" class="text-sm font-medium text-slate-300 mb-2">
                                    Confirm Password
                                </label>
                                <input 
                                    type="password" 
                                    id="signup-confirm-password" 
                                    required
                                    class="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    placeholder="Confirm your password"
                                >
                            </div>
                            
                            <div id="signup-error" class="hidden text-red-400 text-sm"></div>
                            
                            <button 
                                type="submit" 
                                class="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 focus:outline-none"
                            >
                                Create Account
                            </button>
                        </form>
                        
                        <div class="mt-6 text-center">
                            <p class="text-slate-400">
                                Already have an account? 
                                <button id="login-nav" class="text-sky-400 hover:text-sky-300 font-medium">
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
       SignupEvents();
    }
    
    function SignupEvents() {
        const form = document.getElementById('signup-form');
        const LoginNav = document.getElementById('login-nav');
        
        form.addEventListener('submit',(e) => {
            e.preventDefault();
            handleSignup();
        })
        
        LoginNav.addEventListener('click',() => {
            window.location.href = 'login.html';
        })
    }
    
    async function handleSignup() {
        const username = document.getElementById('signup-username').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        if (!username || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        if (username.length < 3) {
            alert('Username must be at least 3 characters long');
            return;
        }

        if(!ValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        
        try {
            const existingUser = await dbManager.getUser(username);
            if (existingUser) {
                alert('Username already exists');
                return;
            }

            const exisitingEmailUser = await dbManager.getUserByEmail(email);
            if (exisitingEmailUser) {
                alert('Email already exists');
                return;
            }
            
            const newUser = new User(username,email,password);
            await dbManager.addUser(newUser);
            
            sessionStorage.setItem('username',username);
            sessionStorage.setItem('userEmail',email);
            
            window.location.href = 'index.html';
            
        } catch (err) {
            if (err.name == 'ConstraintError') {
                alert('Email already exists');
            } else {
                alert('An error occurred during signup');
            }
        }
    }

    function ValidEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }   
    
renderSignup();