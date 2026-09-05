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
                <p data-cms="footer.tagline">سَنَع (Sana' AI) - حيث يتوقف التعلم عن كونه عبئاً معرفياً، ليصبح حياةً تُعاش.</p>
                <p class="copyright" data-cms="footer.copyright">© ${currentYear} جميع الحقوق محفوظة.</p>
                <p class="powered-by"><span data-i18n="بدعم من">بدعم من</span> <a href="https://www.instagram.com/operixsys/" target="_blank" class="operix-link">Operix</a></p>
                <div style="margin-top: 10px;">
                    <a href="admin.html" class="admin-portal-link" style="color: rgba(255,255,255,0.35); text-decoration: none; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); transition: all 0.3s;" onmouseover="this.style.color='#00f2fe'; this.style.borderColor='rgba(0,242,254,0.3)'" onmouseout="this.style.color='rgba(255,255,255,0.35)'; this.style.borderColor='rgba(255,255,255,0.08)'">
                        <span>🛡️</span> <span>لوحة الإدارة</span>
                    </a>
                </div>
            </div>
        </footer>
    `;
}

// Render as soon as this script loads (synchronous, before DOMContentLoaded)
renderFooter();
