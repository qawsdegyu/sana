/**
 * auth-state.js - Centralized Authentication State Manager
 * 
 * Handles two responsibilities:
 * 1. Updates the navbar login/logout button based on session state.
 * 2. Protects routes that require authentication (redirects to login.html).
 */

// List of pages that require authentication
const PROTECTED_PAGES = ['creator.html'];

/**
 * Checks if the current page requires authentication.
 * If so, redirects unauthenticated users to login.html.
 */
async function checkRouteProtection() {
    if (typeof supabaseClient === 'undefined') return;

    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    const isProtected = PROTECTED_PAGES.some(page => currentPage === page);

    if (isProtected) {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (!session) {
                window.location.replace('login.html');
            }
        } catch (e) {
            console.error("Route protection error:", e);
        }
    }
}

/**
 * Updates the navbar login/logout button based on current auth session.
 */
async function checkAuthState() {
    if (typeof supabaseClient !== 'undefined') {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            const loginBtns = document.querySelectorAll('.nav-login-btn');
            
            const currentLang = localStorage.getItem('sana_lang') || 'ar';
            
            if (session) {
                // User is logged in
                loginBtns.forEach(btn => {
                    btn.innerText = currentLang === 'en' ? "Logout" : "تسجيل الخروج";
                    btn.href = "#";
                    btn.classList.add('logout-btn-red');
                    btn.onclick = async (e) => {
                        e.preventDefault();
                        await supabaseClient.auth.signOut();
                        window.location.href = "index.html";
                    };
                });
            } else {
                // User is not logged in
                loginBtns.forEach(btn => {
                    btn.innerText = currentLang === 'en' ? "Login" : "تسجيل الدخول";
                    btn.href = "login.html";
                });
            }
        } catch (e) {
            console.error("Auth check error:", e);
        }
    }
}

// Run both checks
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        checkRouteProtection();
        checkAuthState();
    });
} else {
    checkRouteProtection();
    checkAuthState();
}

// Listen for language changes to update auth buttons
window.addEventListener('languageChanged', (e) => {
    const lang = e.detail.lang;
    const loginBtns = document.querySelectorAll('.nav-login-btn');
    loginBtns.forEach(btn => {
        if (btn.classList.contains('logout-btn-red')) {
            btn.innerText = lang === 'en' ? 'Logout' : 'تسجيل الخروج';
        } else {
            btn.innerText = lang === 'en' ? 'Login' : 'تسجيل الدخول';
        }
    });
});
