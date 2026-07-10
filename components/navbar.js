/**
 * Shared Navbar Component
 * 
 * Renders the unified navigation bar across all pages.
 * Automatically determines the active link from the current URL.
 * Handles login/logout button visibility based on page context.
 * 
 * Structure:
 *   .glass-nav
 *     .nav-brand  (logo - right side in RTL)
 *     .nav-center (navigation links - center)
 *     .nav-actions (lang + login buttons - left side in RTL)
 *     .hamburger  (mobile only)
 */

function renderNavbar() {
    const container = document.getElementById('navbar-container');
    if (!container) return;

    // Determine which page we're on
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    const isLoginPage = currentPage === 'login.html';
    const isCreatorPage = currentPage === 'creator.html';
    const isGamesPage = currentPage === 'games.html';
    const isIndexPage = currentPage === 'index.html' || currentPage === '';

    // Helper to mark active class
    function activeClass(page) {
        return currentPage === page ? ' nav-active' : '';
    }

    // --- Build center links ---
    let centerLinksHTML = '';

    if (isLoginPage) {
        centerLinksHTML = `
            <li><a href="index.html" class="nav-link${activeClass('index.html')}" data-i18n="الرئيسية">الرئيسية</a></li>
        `;
    } else {
        centerLinksHTML = `
            <li><a href="index.html" class="nav-link${activeClass('index.html')}">الرئيسية</a></li>
            <li><a href="games.html" class="nav-link${activeClass('games.html')}">الألعاب الذهنية</a></li>
            <li><a href="creator.html" class="nav-link${activeClass('creator.html')}" data-i18n="مختبر الإبداع الذكي">مختبر الإبداع الذكي</a></li>
        `;
    }

    // --- Build action buttons (left side in RTL) ---
    let actionsHTML = '';

    if (isLoginPage) {
        actionsHTML = ``;
    } else {
        actionsHTML = `
            <li><a href="login.html" class="nav-btn nav-login-btn" data-i18n="تسجيل الدخول">تسجيل الدخول</a></li>
        `;
    }

    // Build the extra mobile sidebar button for creator page
    const mobileSidebarBtnHTML = isCreatorPage
        ? `<button id="mobileSidebarBtn" class="mobile-menu-btn" style="display: none; background: transparent; border: none; font-size: 1.8rem; cursor: pointer; color: var(--primary-color);">☰</button>`
        : '';

    // Compose the full nav HTML
    const navHTML = `
        <nav class="glass-nav${isGamesPage ? ' scrolled' : ''}">
            <div class="nav-brand">
                <span class="logo-text">سَنَع</span>
                <span class="logo-sub">Sana' AI</span>
            </div>
            ${mobileSidebarBtnHTML}
            <button class="hamburger" id="hamburger" aria-label="Toggle Menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links" id="nav-links">
                <li class="nav-center-group">
                    <ul class="nav-center">
                        ${centerLinksHTML}
                    </ul>
                </li>
                <li class="nav-actions-group">
                    <ul class="nav-actions">
                        ${actionsHTML}
                    </ul>
                </li>
            </ul>
        </nav>
    `;

    container.innerHTML = navHTML;
}

// Render as soon as this script loads (synchronous, before DOMContentLoaded)
renderNavbar();
