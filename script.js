document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar scroll effect
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            nav.classList.toggle('menu-open');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                nav.classList.remove('menu-open');
            });
        });
    }

    // 2. Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Interactive Ideas Modal
    const ideaItems = document.querySelectorAll('.idea-list li');
    const modal = document.getElementById('details-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const closeBtn = document.querySelector('.close-btn');

    ideaItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.textContent;
            const details = item.getAttribute('data-details');

            modalTitle.textContent = title;
            modalText.textContent = details;

            modal.classList.add('show');
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // 4. Accessibility Tools
    const a11yBtn = document.getElementById('a11y-btn');
    const a11yMenu = document.getElementById('a11y-menu');
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const highContrastBtn = document.getElementById('high-contrast');

    let currentFontSize = 100; // Percentage

    if (a11yBtn && a11yMenu) {
        a11yBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            a11yMenu.classList.toggle('show');
        });

        window.addEventListener('click', (e) => {
            if (!a11yMenu.contains(e.target) && e.target !== a11yBtn) {
                a11yMenu.classList.remove('show');
            }
        });

        if (increaseFontBtn) {
            increaseFontBtn.addEventListener('click', () => {
                if (currentFontSize < 150) {
                    currentFontSize += 10;
                    document.documentElement.style.fontSize = currentFontSize + '%';
                }
            });
        }

        if (decreaseFontBtn) {
            decreaseFontBtn.addEventListener('click', () => {
                if (currentFontSize > 80) {
                    currentFontSize -= 10;
                    document.documentElement.style.fontSize = currentFontSize + '%';
                }
            });
        }

        if (highContrastBtn) {
            highContrastBtn.addEventListener('click', () => {
                document.body.classList.toggle('high-contrast');
            });
        }
    }

    // 5. Sandbox Hotspots
    const hotspots = document.querySelectorAll('.hotspot');
    const hsTitle = document.getElementById('hotspot-title');
    const hsDesc = document.getElementById('hotspot-desc');

    hotspots.forEach(spot => {
        spot.addEventListener('click', () => {
            // Remove pulse from all, add to clicked
            hotspots.forEach(h => h.querySelector('.pulse').style.animation = 'none');
            spot.querySelector('.pulse').style.animation = 'hotspotPulse 2s infinite';

            hsTitle.textContent = spot.getAttribute('data-title');
            hsDesc.textContent = spot.getAttribute('data-desc');

            // Highlight text effect
            hsTitle.style.color = 'var(--accent-color)';
            setTimeout(() => hsTitle.style.color = 'var(--primary-color)', 300);
        });
    });

    // 6. ROI Calculator
    const childrenSlider = document.getElementById('children-slider');
    const yearsSlider = document.getElementById('years-slider');
    const childrenVal = document.getElementById('children-val');
    const yearsVal = document.getElementById('years-val');
    const savingsResult = document.getElementById('savings-result');
    const skillsResult = document.getElementById('skills-result');

    function calculateROI() {
        if (!childrenSlider || !yearsSlider) return;

        const children = parseInt(childrenSlider.value);
        const years = parseInt(yearsSlider.value);

        childrenVal.textContent = children.toLocaleString();
        yearsVal.textContent = years;

        // Assumptions:
        // Savings per child per year = ~5,000 QAR
        // Skills logged per child per year = ~120 skills
        const savings = children * years * 5000;
        const skills = children * years * 120;

        savingsResult.textContent = savings.toLocaleString();
        skillsResult.textContent = skills.toLocaleString();
    }

    if (childrenSlider && yearsSlider) {
        childrenSlider.addEventListener('input', calculateROI);
        yearsSlider.addEventListener('input', calculateROI);
        calculateROI(); // Initial calc
    }

    // 7. Mobile Read More Logic
    function setupMobileReadMore() {
        if (window.innerWidth > 768) return;

        const cards = document.querySelectorAll('.vision-card-hover, .pillar-card, .science-card, .ethics-card');

        cards.forEach(card => {
            // Avoid adding multiple buttons
            if (card.querySelector('.read-more-btn')) return;
            
            // Check if any element is actually truncated by line-clamp
            let isTruncated = false;
            const textElements = card.querySelectorAll('p:not(:nth-of-type(2)), ul');
            textElements.forEach(el => {
                // If scrollHeight is significantly greater than clientHeight, it's clamped
                if (el.scrollHeight > el.clientHeight + 4) {
                    isTruncated = true;
                }
            });
            
            // Also check if there's a hidden second paragraph
            const hasHiddenPara = card.querySelector('p:nth-of-type(2)') !== null;
            
            // Limit: If text is NOT truncated and no hidden paragraph exists, don't add button
            if (!isTruncated && !hasHiddenPara) {
                card.classList.add('is-expanded'); // Prevents clamping and hiding
                return;
            }
            
            // Add button
            const btn = document.createElement('button');
            btn.className = 'read-more-btn';
            btn.textContent = window.translateText ? window.translateText('قراءة المزيد') : 'قراءة المزيد';
            
            let isExpanded = false;
            btn.addEventListener('click', () => {
                isExpanded = !isExpanded;
                card.classList.toggle('is-expanded', isExpanded);
                
                const readMoreText = window.translateText ? window.translateText('قراءة المزيد') : 'قراءة المزيد';
                const showLessText = window.translateText ? window.translateText('إخفاء') : 'إخفاء';
                
                btn.textContent = isExpanded ? showLessText : readMoreText;
            });
            
            card.appendChild(btn);
        });
    }

    // Run after fonts/layout load to ensure accurate scrollHeight
    window.addEventListener('load', () => {
        setTimeout(setupMobileReadMore, 100);
    });
    
    // Use debounce for resize to avoid spamming
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            setupMobileReadMore();
        }, 200);
    });
});

// Global helper for dynamic text translations
window.translateText = function (text) {
    const currentLang = localStorage.getItem('sana_lang') || 'ar';
    if (currentLang === 'en' && typeof translations !== 'undefined' && translations[text]) {
        return translations[text];
    }
    return text;
};
