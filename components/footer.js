/**
 * Shared Footer Component
 * Renders the unified footer across all pages.
 */

function renderFooter() {
    const container = document.getElementById('footer-container');
    if (!container) return;

    const currentYear = new Date().getFullYear() || 2026;

    container.innerHTML = `
        <footer>
            <div class="container">
                <p>سَنَع (Sana' AI) - حيث يتوقف التعلم عن كونه عبئاً معرفياً، ليصبح حياةً تُعاش.</p>
                <p class="copyright">© ${currentYear} جميع الحقوق محفوظة.</p>
                <p class="powered-by"><span data-i18n="بدعم من">بدعم من</span> <a href="https://www.instagram.com/operixsys/" target="_blank" class="operix-link">Operix</a></p>
            </div>
        </footer>
    `;
}

// Render as soon as this script loads (synchronous, before DOMContentLoaded)
renderFooter();
