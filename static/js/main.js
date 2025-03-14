// StressAPI Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginBtn = document.getElementById('login-btn');
    const authModal = document.getElementById('auth-modal');
    const modalClose = document.getElementById('modal-close');
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginSubmit = document.getElementById('login-submit');
    const registerSubmit = document.getElementById('register-submit');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    
    // Event Listeners
    if (loginBtn) {
        loginBtn.addEventListener('click', openAuthModal);
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeAuthModal);
    }
    
    if (loginTab) {
        loginTab.addEventListener('click', () => switchAuthTab('login'));
    }
    
    if (registerTab) {
        registerTab.addEventListener('click', () => switchAuthTab('register'));
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeAuthModal();
        }
    });
    
    // Functions
    function openAuthModal() {
        authModal.classList.add('is-active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    }
    
    function closeAuthModal() {
        authModal.classList.remove('is-active');
        document.body.style.overflow = ''; // Restore scrolling
        clearErrors();
    }
    
    function switchAuthTab(tab) {
        // Update tab styling
        if (tab === 'login') {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        } else {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        }
        clearErrors();
    }
    
    function clearErrors() {
        loginError.textContent = '';
        registerError.textContent = '';
    }
    
    async function handleLogin(e) {
        e.preventDefault();
        loginSubmit.disabled = true;
        
        const username = loginForm.querySelector('[name="username"]').value;
        const password = loginForm.querySelector('[name="password"]').value;
        
        try {
            const response = await fetch('/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'username': username,
                    'password': password,
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || 'Login failed');
            }
            
            // Store token in localStorage
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('token_type', data.token_type);
            
            // Redirect or update UI for logged-in user
            window.location.href = '/dashboard'; // Adjust as needed
            
        } catch (error) {
            loginError.textContent = error.message;
        } finally {
            loginSubmit.disabled = false;
        }
    }
    
    async function handleRegister(e) {
        e.preventDefault();
        registerSubmit.disabled = true;
        
        const username = registerForm.querySelector('[name="username"]').value;
        const email = registerForm.querySelector('[name="email"]').value;
        const password = registerForm.querySelector('[name="password"]').value;
        const confirmPassword = registerForm.querySelector('[name="confirm_password"]').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            registerError.textContent = 'Passwords do not match';
            registerSubmit.disabled = false;
            return;
        }
        
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || 'Registration failed');
            }
            
            // Show success message and switch to login tab
            registerError.textContent = '';
            alert('Registration successful! You can now log in.');
            switchAuthTab('login');
            
        } catch (error) {
            registerError.textContent = error.message;
        } finally {
            registerSubmit.disabled = false;
        }
    }
    
    // Check if user is already logged in
    function checkAuthStatus() {
        const token = localStorage.getItem('access_token');
        if (token) {
            // Update UI for logged-in user
            if (loginBtn) {
                loginBtn.textContent = 'Dashboard';
                loginBtn.removeEventListener('click', openAuthModal);
                loginBtn.addEventListener('click', () => {
                    window.location.href = '/dashboard';
                });
            }
        }
    }
    
    // Initialize the page
    checkAuthStatus();
});
