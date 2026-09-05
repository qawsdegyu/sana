document.addEventListener("DOMContentLoaded", () => {
    // Determine initial language
    let currentLang = localStorage.getItem('sana_lang') || 'ar';

    // Inject Language Dropdown to all navs
    const navs = document.querySelectorAll('.glass-nav');
    navs.forEach(nav => {
        // Remove old button if exists in nav-links
        const navLinks = nav.querySelector('.nav-links');
        if (navLinks) {
            const oldBtn = navLinks.querySelector('#langToggle');
            if (oldBtn && oldBtn.parentElement) oldBtn.parentElement.remove();
        }

        // Helper to create toggle switch
        const createToggle = (type) => {
            const container = document.createElement(type === 'desktop' ? 'li' : 'div');
            container.className = `lang-toggle-wrapper ${type}-lang`;
            container.innerHTML = `
                <div class="lang-toggle-btn" style="display: flex; align-items: center; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 50px; padding: 2px; margin-left: 10px; cursor: pointer; transition: all 0.3s ease;">
                    <span class="lang-opt lang-ar" style="padding: 2px 8px; border-radius: 50px; font-size: 0.7rem; font-weight: bold; transition: all 0.3s ease; color: ${currentLang === 'ar' ? '#0a0f1a' : 'rgba(255,255,255,0.7)'}; background: ${currentLang === 'ar' ? 'var(--primary-light)' : 'transparent'};">عربي</span>
                    <span class="lang-opt lang-en" style="padding: 2px 8px; border-radius: 50px; font-size: 0.7rem; font-weight: bold; transition: all 0.3s ease; color: ${currentLang === 'en' ? '#0a0f1a' : 'rgba(255,255,255,0.7)'}; background: ${currentLang === 'en' ? 'var(--primary-light)' : 'transparent'};">EN</span>
                </div>
            `;
            return container;
        };

        const desktopLang = createToggle('desktop');
        const mobileLang = createToggle('mobile');

        // Append to nav-actions to be next to login/logout buttons
        const navActions = nav.querySelector('.nav-actions');
        if (navActions) {
            navActions.prepend(desktopLang);
        } else if (navLinks) {
            navLinks.prepend(desktopLang);
        }

        // Setup nav-controls for mobile
        const hamburger = nav.querySelector('.hamburger');
        let navControls = nav.querySelector('.nav-controls');
        if (!navControls && hamburger) {
            navControls = document.createElement('div');
            navControls.className = 'nav-controls';
            hamburger.parentNode.insertBefore(navControls, hamburger);
            navControls.appendChild(hamburger);
        }

        if (navControls) {
            navControls.appendChild(mobileLang);
        }

        // Setup Events
        [desktopLang, mobileLang].forEach(dropdown => {
            const toggleBtn = dropdown.querySelector('.lang-toggle-btn');

            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const newLang = currentLang === 'ar' ? 'en' : 'ar';
                setLanguage(newLang);

                // Update UI for all toggles
                document.querySelectorAll('.lang-opt').forEach(opt => {
                    opt.style.background = 'transparent';
                    opt.style.color = 'rgba(255,255,255,0.7)';
                });
                document.querySelectorAll('.lang-' + newLang).forEach(opt => {
                    opt.style.background = 'var(--primary-light)';
                    opt.style.color = '#0a0f1a';
                });
            });

            toggleBtn.addEventListener('mouseover', () => {
                toggleBtn.style.borderColor = 'rgba(255,255,255,0.3)';
                toggleBtn.style.background = 'rgba(255,255,255,0.1)';
            });
            toggleBtn.addEventListener('mouseout', () => {
                toggleBtn.style.borderColor = 'rgba(255,255,255,0.1)';
                toggleBtn.style.background = 'rgba(255,255,255,0.05)';
            });
        });
    });

    // Main translation function
    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('sana_lang', lang);

        // Change direction
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;

        // 1. First, apply CMS bilingual content for this language if engine exists
        if (typeof applySiteContent === 'function') {
            applySiteContent(null, lang);
        }

        // 2. Walk through all other text nodes and translate static UI strings
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            // Skip script, style tags and elements explicitly managed by CMS
            if (node.parentElement && (
                node.parentElement.tagName === 'SCRIPT' || 
                node.parentElement.tagName === 'STYLE' ||
                node.parentElement.closest('[data-cms]') ||
                node.parentElement.closest('[data-cms-link]')
            )) {
                continue;
            }

            // Store original text if not already stored
            if (node.originalText === undefined) {
                node.originalText = node.nodeValue;
            }

            let originalText = node.originalText;
            let trimmedText = originalText.trim();
            let normalizedText = trimmedText.replace(/\s+/g, ' ');

            if (normalizedText === "") continue;

            if (lang === 'en') {
                // If translation exists, replace it
                if (translations[normalizedText]) {
                    node.nodeValue = originalText.replace(trimmedText, translations[normalizedText]);
                }
            } else {
                // Restore original Arabic
                node.nodeValue = originalText;
            }
        }

        // Custom logic for placeholders, value inputs, etc.
        const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
        inputs.forEach(input => {
            if (input.closest('[data-cms]')) return;
            if (input.originalPlaceholder === undefined) {
                input.originalPlaceholder = input.getAttribute('placeholder');
            }
            let text = (input.originalPlaceholder || '').trim();
            if (lang === 'en' && translations[text]) {
                input.setAttribute('placeholder', translations[text]);
            } else {
                input.setAttribute('placeholder', input.originalPlaceholder);
            }
        });

        // Translate data attributes
        const dataAttrs = ['data-details', 'data-title', 'data-desc', 'data-i18n'];
        dataAttrs.forEach(attr => {
            document.querySelectorAll(`[${attr}]`).forEach(el => {
                // Skip attributes managed by CMS
                if (el.hasAttribute('data-cms-detail') || el.hasAttribute('data-cms-desc') || el.hasAttribute('data-cms-title')) {
                    return;
                }
                const originalAttr = 'original' + attr;
                if (el[originalAttr] === undefined) {
                    el[originalAttr] = el.getAttribute(attr);
                }
                let text = el[originalAttr].trim();
                let normalizedText = text.replace(/\s+/g, ' ');
                if (lang === 'en' && translations[normalizedText]) {
                    el.setAttribute(attr, translations[normalizedText]);
                } else {
                    el.setAttribute(attr, el[originalAttr]);
                }
            });
        });

        // If we are in creator.html, dispatch an event so creator.js knows language changed
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
    }

    // Apply language on initial load immediately (synchronously) before first paint
    setLanguage(currentLang);
});
