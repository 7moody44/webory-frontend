/**
 * Webory Authentication Simulation
 * Handles frontend-only auth logic for demo purposes.
 * Improved with simulated security features (XSS prevention, CSRF simulation).
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- SECURITY UTILS ---

    // 1. Anti-XSS Sanitization (Simulated)
    const sanitize = (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    // 2. CSRF Token Simulation
    let csrfToken = localStorage.getItem('csrf_token');
    if (!csrfToken) {
        csrfToken = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
        localStorage.setItem('csrf_token', csrfToken);
    }

    // Inject CSRF token into all forms
    document.querySelectorAll('form').forEach(form => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = '_csrf';
        input.value = csrfToken;
        form.appendChild(input);
    });

    const validateCSRF = (form) => {
        const formToken = form.querySelector('input[name="_csrf"]')?.value;
        if (formToken !== localStorage.getItem('csrf_token')) {
            console.error("CSRF Validation Failed!");
            alert("Security Error: Invalid Session (CSRF). Please reload.");
            return false;
        }
        return true;
    }

    // --- NAVIGATION STATE MANAGEMENT ---
    const updateNavigation = () => {
        const user = localStorage.getItem('webory_user');
        const nav = document.querySelector('nav');

        // Logic for Desktop
        if (user && nav) {
            // 1. Remove "Login" link explicitly
            const loginLink = document.querySelector('a[href="login.html"]');
            if (loginLink) loginLink.remove(); // Bye bye login button

            // 2. Add "Dashboard" link if not there
            if (!document.getElementById('nav-dashboard')) {
                const dashboardLink = document.createElement('a');
                dashboardLink.id = 'nav-dashboard';
                dashboardLink.href = 'dashboard.html';
                dashboardLink.className = 'text-sm font-normal text-[#D4AF37] hover:text-white transition-colors font-medium';
                dashboardLink.innerText = 'Dashboard';
                nav.appendChild(dashboardLink);
            }

            // 3. Add a small "Sign Out" button/icon at the end
            if (!document.getElementById('nav-signout')) {
                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'nav-signout';
                logoutBtn.innerText = 'Sign Out';
                logoutBtn.className = 'text-xs text-white/50 hover:text-white ml-4 transition-colors';
                logoutBtn.onclick = () => {
                    if (confirm('Sign out?')) {
                        localStorage.removeItem('webory_user');
                        window.location.reload();
                    }
                };
                nav.appendChild(logoutBtn);
            }
        }

        // Logic for CTA Buttons (Get Started)
        const ctaButtons = document.querySelectorAll('a[href="signup.html"], button[onclick*="signup.html"]');
        if (user) {
            ctaButtons.forEach(btn => {
                btn.innerText = 'Go to Dashboard';
                if (btn.tagName === 'A') btn.href = 'dashboard.html';
                else btn.setAttribute('onclick', "window.location.href='dashboard.html'");
            });
        }
    }
    updateNavigation();

    // --- SIGNUP LOGIC (LIVE) ---
    const signupForm = document.querySelector('form[action="#signup"]');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validateCSRF(signupForm)) return;

            const name = sanitize(document.getElementById('name').value);
            const email = sanitize(document.getElementById('email').value);
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;

            if (password !== confirmPassword) return alert("Passwords do not match!");
            if (password.length < 8) return alert("Password must be at least 8 characters.");
            if (!terms) return alert("Please agree to the Terms.");

            const btn = signupForm.querySelector('button[type="submit"]');
            btn.innerText = "Creating Account...";
            btn.disabled = true;

            try {
                const response = await fetch('https://webory-backend.onrender.com/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    alert("Account Created! Redirecting to login...");
                    window.location.href = 'login.html';
                } else {
                    alert(data.message || "Signup failed");
                    btn.innerText = "Create Account";
                    btn.disabled = false;
                }
            } catch (err) {
                alert("Server error. Try again in 30 seconds.");
                btn.disabled = false;
            }
        });
    }
    // --- LOGIN LOGIC (LIVE) ---
    const loginForm = document.querySelector('form[action="#login"]');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validateCSRF(loginForm)) return;

            const email = sanitize(document.getElementById('email').value);
            const password = document.getElementById('password').value;

            const btn = loginForm.querySelector('button[type="submit"]');
            btn.innerText = "Verifying...";
            btn.disabled = true;

            try {
                const response = await fetch('https://webory-backend.onrender.com/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('webory_user', JSON.stringify({ email, token: data.token }));
                    alert("Login Successful!");
                    window.location.href = 'index.html';
                } else {
                    alert(data.message || "Invalid credentials");
                    btn.innerText = "Sign In";
                    btn.disabled = false;
                }
            } catch (err) {
                alert("Server waking up... please wait 30 seconds.");
                btn.disabled = false;
            }
        });
    }

    // --- FORGOT PASSWORD ---
    const forgotLinks = document.querySelectorAll('.forgot-password-link');
    forgotLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const email = prompt("Please enter your email address to reset your password:");
            if (email && email.includes('@')) {
                alert(`Password reset link sent to ${email}. Check your inbox!`);
            } else if (email) {
                alert("Please enter a valid email address.");
            }
        });
    });
});
