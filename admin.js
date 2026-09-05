/**
 * admin.js - Sana' AI Admin Dashboard Logic & Controller
 * 
 * Handles Supabase authentication, form two-way binding, live image processing,
 * cloud & local synchronization, live preview modal, and backup tools.
 */

// State variables
let currentContent = { ar: {}, en: {} };
let currentAdminLang = 'ar';
let hasUnsavedChanges = false;

// ==========================================================================
// 1. AUTHENTICATION & SESSION MANAGEMENT
// ==========================================================================

async function checkAdminSession() {
    if (typeof supabaseClient === 'undefined' || !supabaseClient) {
        showLoginOverlay();
        return;
    }

    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (session && session.user) {
            grantAdminAccess(session.user.email);
            return;
        }
    } catch (e) {
        console.warn("Supabase session check:", e);
    }

    showLoginOverlay();
}

function grantAdminAccess(email) {
    document.getElementById('adminAuthWrapper').style.display = 'none';
    document.getElementById('adminApp').style.display = 'flex';
    document.getElementById('sidebarUserEmail').textContent = email;
    document.getElementById('sidebarAvatar').textContent = email.charAt(0).toUpperCase();

    // Initialize Dashboard
    initDashboard();
}

function showLoginOverlay() {
    document.getElementById('adminAuthWrapper').style.display = 'flex';
    document.getElementById('adminApp').style.display = 'none';
}

async function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const submitBtn = document.getElementById('btnLoginSubmit');
    const spinner = document.getElementById('loginSpinner');

    submitBtn.disabled = true;
    spinner.style.display = 'inline-block';

    try {
        if (!supabaseClient) {
            throw new Error("لم يتم تهيئة اتصال Supabase بشكل صحيح.");
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            const msg = (error.message || "").toLowerCase();
            if (msg.includes("email not confirmed")) {
                throw new Error("الحساب بانتظار التأكيد: اذهب إلى Supabase > Authentication > Users واضغط (...) بجانب حسابك ثم Confirm email.");
            }
            if (msg.includes("invalid login credentials")) {
                throw new Error("بيانات الدخول غير صحيحة، أو أن الحساب بحاجة لتأكيد في سوبابيز.");
            }
            throw new Error(error.message);
        }

        if (!data || !data.session) {
            throw new Error("تعذر بدء جلسة المشرف، يرجى المحاولة مرة أخرى.");
        }

        showToast("تم تسجيل الدخول بنجاح عبر سوبابيز!", "success");
        grantAdminAccess(data.user.email);

    } catch (err) {
        showToast(err.message || "فشل تسجيل الدخول", "error");
    } finally {
        submitBtn.disabled = false;
        spinner.style.display = 'none';
    }
}

async function handleAdminLogout() {
    if (confirm("هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟")) {
        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            try {
                await supabaseClient.auth.signOut();
            } catch (e) {
                console.warn("SignOut error:", e);
            }
        }
        showToast("تم تسجيل الخروج بنجاح", "info");
        setTimeout(() => {
            window.location.reload();
        }, 400);
    }
}


// ==========================================================================
// 2. DASHBOARD INITIALIZATION & NAVIGATION
// ==========================================================================

async function initDashboard() {
    // 1. Fetch current content (local + remote)
    currentContent = getLocalSiteContent();
    
    // 2. Setup language view (default to AR)
    switchAdminContentLang('ar', false);

    // 3. Setup navigation tabs
    setupTabNavigation();

    // 4. Setup Supabase config form & test connection
    initSupabaseCredentialsForm();
    testSupabaseConnection();

    // 5. Remote content fetch in background
    fetchRemoteSiteContent().then(remoteContent => {
        if (remoteContent) {
            currentContent = remoteContent;
            populateForms(currentContent[currentAdminLang]);
        }
    });
}

function switchAdminContentLang(lang, shouldCollect = true) {
    if (shouldCollect) {
        collectCurrentLangFormData();
    }

    currentAdminLang = lang;

    // 1. Update buttons
    const btnAr = document.getElementById('btnAdminLangAr');
    const btnEn = document.getElementById('btnAdminLangEn');
    if (btnAr) btnAr.classList.toggle('active', lang === 'ar');
    if (btnEn) btnEn.classList.toggle('active', lang === 'en');

    // 2. Update status bar and app direction
    const appEl = document.getElementById('adminApp');
    const barEl = document.getElementById('langStatusBar');
    const badgeEl = document.getElementById('langBadge');
    const subTextEl = document.getElementById('langSubText');
    const autofillTextEl = document.getElementById('btnLangAutofillText');

    if (lang === 'en') {
        if (appEl) appEl.classList.add('lang-mode-en');
        if (barEl) barEl.classList.add('en-mode');
        if (badgeEl) {
            badgeEl.className = 'indicator-badge en';
            badgeEl.textContent = '🇬🇧 وضع التحرير: English (EN)';
        }
        if (subTextEl) {
            subTextEl.textContent = 'يتم الآن تعديل وحفظ نصوص الموقع المعروضة للزوار باللغة الإنجليزية.';
        }
        if (autofillTextEl) {
            autofillTextEl.textContent = 'استيراد النموذج الإنجليزي المعتمد (Auto-Fill)';
        }
    } else {
        if (appEl) appEl.classList.remove('lang-mode-en');
        if (barEl) barEl.classList.remove('en-mode');
        if (badgeEl) {
            badgeEl.className = 'indicator-badge ar';
            badgeEl.textContent = '🇸🇦 وضع التحرير: اللغة العربية (AR)';
        }
        if (subTextEl) {
            subTextEl.textContent = 'يتم الآن تعديل وحفظ نصوص الموقع المخصصة للنسخة العربية.';
        }
        if (autofillTextEl) {
            autofillTextEl.textContent = 'استعادة النموذج العربي المعتمد';
        }
    }

    // 3. Populate form fields with selected language content
    if (!currentContent[currentAdminLang]) {
        currentContent[currentAdminLang] = (lang === 'en') 
            ? JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT_EN))
            : JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT_AR));
    }

    populateForms(currentContent[currentAdminLang]);
}

function autoFillCurrentLangDefaults() {
    const isEn = (currentAdminLang === 'en');
    const langName = isEn ? "الإنجليزية (English)" : "العربية";
    
    if (confirm(`هل أنت متأكد من استيراد النموذج الافتراضي المعتمد للغة ${langName}؟ ستتمكن من مراجعته وتعديل أي جزء منه بحرية.`)) {
        if (isEn) {
            const defaults = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT_EN));
            // Inherit custom images from Arabic if present
            if (currentContent.ar && currentContent.ar.hero && currentContent.ar.hero.image) {
                defaults.hero.image = currentContent.ar.hero.image;
            }
            if (currentContent.ar && currentContent.ar.sandbox && currentContent.ar.sandbox.image) {
                defaults.sandbox.image = currentContent.ar.sandbox.image;
            }
            currentContent.en = defaults;
            populateForms(currentContent.en);
            markUnsavedChanges();
            showToast("تم ملء النموذج الإنجليزي النموذجي بنجاح! راجعه واضغط 'حفظ كافة التعديلات' للاعتماد.", "success");
        } else {
            const defaults = JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT_AR));
            currentContent.ar = defaults;
            populateForms(currentContent.ar);
            markUnsavedChanges();
            showToast("تم استعادة النموذج العربي المعتمد بنجاح!", "success");
        }
    }
}

function setupTabNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.getAttribute('data-tab');
            if (tab) {
                switchAdminTab(tab);
            }
        });
    });
}

function switchAdminTab(tabId) {
    // Update sidebar active classes
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update panels
    document.querySelectorAll('.panel-section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(`tab-${tabId}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update breadcrumb
    const tabItem = document.querySelector(`.sidebar-nav .nav-item[data-tab="${tabId}"] span`);
    if (tabItem) {
        document.getElementById('currentTabBreadcrumb').textContent = tabItem.textContent;
    }

    // Close mobile sidebar if open
    const sidebar = document.getElementById('adminSidebar');
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    sidebar.classList.toggle('open');
}


// ==========================================================================
// 3. FORM BINDING & DATA COLLECTION
// ==========================================================================

function populateForms(content) {
    if (!content) return;

    // Fill all inputs with [data-model]
    document.querySelectorAll('[data-model]').forEach(el => {
        const path = el.getAttribute('data-model');
        let val = getByPath(content, path);

        // Fallback for images or links from the other language if empty
        if ((val === undefined || val === null || val === '') && currentContent.ar) {
            val = getByPath(currentContent.ar, path);
        }

        if (val !== undefined && val !== null) {
            el.value = val;
        } else {
            el.value = '';
        }

        // Attach change listener to mark unsaved
        if (!el.hasAttribute('data-bound')) {
            el.setAttribute('data-bound', 'true');
            el.addEventListener('input', () => {
                markUnsavedChanges();
            });
        }
    });

    // Update Image Previews (with fallback to AR image)
    const heroImg = (content.hero && content.hero.image) || (currentContent.ar && currentContent.ar.hero && currentContent.ar.hero.image);
    if (heroImg) {
        const heroPrev = document.getElementById('preview_hero_image');
        if (heroPrev) heroPrev.src = heroImg;
    }

    const sbImg = (content.sandbox && content.sandbox.image) || (currentContent.ar && currentContent.ar.sandbox && currentContent.ar.sandbox.image);
    if (sbImg) {
        const sbPrev = document.getElementById('preview_sandbox_image');
        if (sbPrev) sbPrev.src = sbImg;
    }
}

function collectCurrentLangFormData() {
    if (!currentContent) currentContent = { ar: {}, en: {} };
    if (!currentContent[currentAdminLang]) currentContent[currentAdminLang] = {};

    document.querySelectorAll('[data-model]').forEach(el => {
        const path = el.getAttribute('data-model');
        const val = el.value;
        setByPath(currentContent[currentAdminLang], path, val);
    });

    // If an image was configured, ensure both languages keep it in sync
    const heroImgInput = document.querySelector('[data-model="hero.image"]');
    if (heroImgInput && heroImgInput.value) {
        if (!currentContent.ar.hero) currentContent.ar.hero = {};
        if (!currentContent.en.hero) currentContent.en.hero = {};
        currentContent.ar.hero.image = heroImgInput.value;
        currentContent.en.hero.image = heroImgInput.value;
    }

    const sbImgInput = document.querySelector('[data-model="sandbox.image"]');
    if (sbImgInput && sbImgInput.value) {
        if (!currentContent.ar.sandbox) currentContent.ar.sandbox = {};
        if (!currentContent.en.sandbox) currentContent.en.sandbox = {};
        currentContent.ar.sandbox.image = sbImgInput.value;
        currentContent.en.sandbox.image = sbImgInput.value;
    }
}

function collectFormData() {
    collectCurrentLangFormData();
    return currentContent;
}

function markUnsavedChanges() {
    hasUnsavedChanges = true;
    const badge = document.getElementById('topbarSyncBadge');
    badge.className = 'sync-badge';
    badge.style.borderColor = 'rgba(255, 165, 2, 0.4)';
    badge.style.color = '#ffa502';
    document.getElementById('syncBadgeText').textContent = 'هناك تعديلات غير محفوظة';
}

function markChangesSaved(remoteSuccess) {
    hasUnsavedChanges = false;
    const badge = document.getElementById('topbarSyncBadge');
    badge.className = 'sync-badge synced';
    badge.style.borderColor = '';
    badge.style.color = '';
    document.getElementById('syncBadgeText').textContent = remoteSuccess ? 'محفوظ محلياً وسحابياً' : 'محفوظ محلياً (جاهز لسوبابيز)';
}


// ==========================================================================
// 4. IMAGE UPLOAD & PREVIEW HANDLER
// ==========================================================================

function handleImageFileUpload(event, modelPath, previewImgId) {
    const file = event.target.files[0];
    if (!file) return;

    // Check size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
        showToast("حجم الصورة كبير جداً (الحد الأقصى 10 ميغابايت)", "error");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Data = e.target.result;
        
        // Update the target preview image
        const previewEl = document.getElementById(previewImgId);
        if (previewEl) previewEl.src = base64Data;

        // Update the input field with data-model
        const inputEl = document.querySelector(`[data-model="${modelPath}"]`);
        if (inputEl) inputEl.value = base64Data;

        markUnsavedChanges();
        showToast("تم تحميل ومعاينة الصورة بنجاح! لا تنسَ حفظ التعديلات.", "success");
    };
    reader.readAsDataURL(file);
}

function handleImageUrlInput(url, previewImgId) {
    const previewEl = document.getElementById(previewImgId);
    if (previewEl && url) {
        previewEl.src = url;
        markUnsavedChanges();
    }
}


// ==========================================================================
// 5. SAVE ALL CHANGES
// ==========================================================================

async function handleSaveAll() {
    const saveBtn = document.getElementById('btnSaveAll');
    saveBtn.classList.add('saving');
    saveBtn.innerHTML = `<span>⏳</span> <span>جارٍ الحفظ والمزامنة...</span>`;

    try {
        const updatedContent = collectFormData();
        const result = await saveSiteContent(updatedContent);

        currentContent = updatedContent;
        markChangesSaved(result.remote);

        let msg = "تم حفظ كافة التعديلات بنجاح!";
        if (result.remote) {
            msg += " ومزامنتها سحابياً مع Supabase 🚀";
        } else {
            msg += " تم التخزين الفوري محلياً وسيتم المزامنة مع سوبابيز عند تشغيل الجدول.";
        }

        showToast(msg, "success");

        // Refresh preview frame if open (safe across file:// and origins)
        const iframe = document.getElementById('previewIframe');
        if (iframe) {
            try {
                iframe.src = 'index.html?t=' + Date.now();
            } catch (frameErr) {
                console.warn("Could not reload iframe:", frameErr);
            }
        }

    } catch (err) {
        console.error("Save error:", err);
        showToast("حدث خطأ أثناء حفظ التعديلات: " + err.message, "error");
    } finally {
        saveBtn.classList.remove('saving');
        saveBtn.innerHTML = `<span>💾</span> <span>حفظ كافة التعديلات</span>`;
    }
}


// ==========================================================================
// 6. LIVE PREVIEW MODAL
// ==========================================================================

function openLivePreview() {
    const modal = document.getElementById('livePreviewModal');
    modal.classList.add('show');
    refreshPreviewFrame();
}

function closeLivePreview() {
    const modal = document.getElementById('livePreviewModal');
    modal.classList.remove('show');
}

function refreshPreviewFrame() {
    const iframe = document.getElementById('previewIframe');
    if (iframe) {
        try {
            localStorage.setItem('sana_lang', currentAdminLang);
        } catch (e) {}
        iframe.src = 'index.html?t=' + Date.now();
    }
}

function setPreviewDevice(width, btn) {
    document.querySelectorAll('.preview-devices .btn-device').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const frame = document.getElementById('previewIframe');
    if (frame) {
        frame.style.width = width;
    }
}


// ==========================================================================
// 7. SUPABASE INTEGRATION & DATABASE UTILS
// ==========================================================================

async function testSupabaseConnection() {
    const badge = document.getElementById('settingsDbStatusBadge');
    if (!badge) return;

    badge.textContent = "جارٍ الفحص...";
    badge.style.color = "var(--text-muted)";

    if (typeof supabaseClient === 'undefined') {
        badge.textContent = "غير متاح (تأكد من supabase.js)";
        badge.style.color = "var(--danger)";
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('site_content')
            .select('id')
            .limit(1);

        if (error) {
            const errLower = (error.message || "").toLowerCase();
            if (error.code === '42P01' || errLower.includes('does not exist') || errLower.includes('could not find the table') || errLower.includes('schema cache')) {
                badge.textContent = "متصل بـ Supabase (الجدول بانتظار الإنشاء في SQL Editor)";
                badge.style.color = "var(--warning)";
                document.getElementById('statDbStatus').textContent = "الجدول بانتظار الإنشاء";
            } else {
                badge.textContent = "خطأ في الاتصال: " + error.message;
                badge.style.color = "var(--danger)";
            }
        } else {
            badge.textContent = "🟢 متصل وقاعدة البيانات نشطة ومزامنة 100%";
            badge.style.color = "var(--success)";
            document.getElementById('statDbStatus').textContent = "مزامنة سحابية نشطة";
            markChangesSaved(true);
        }
    } catch (e) {
        badge.textContent = "تنبيه: " + e.message;
        badge.style.color = "var(--warning)";
    }
}

function initSupabaseCredentialsForm() {
    const urlInput = document.getElementById('supabaseUrlInput');
    const keyInput = document.getElementById('supabaseKeyInput');
    if (!urlInput || !keyInput) return;

    const currentUrl = localStorage.getItem('sana_supabase_url') || 'https://kpzuyjtjixiwgheucudi.supabase.co';
    const currentKey = localStorage.getItem('sana_supabase_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwenV5anRqaXhpd2doZXVjdWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MTM2NDYsImV4cCI6MjEwMzk4OTY0Nn0.xnnDn4U7eVimq3BoE4slmQW41BdGfGvLAs_wTbocawQ';

    urlInput.value = currentUrl;
    keyInput.value = currentKey;
}

function saveCustomSupabaseConfig() {
    const url = document.getElementById('supabaseUrlInput').value.trim();
    const key = document.getElementById('supabaseKeyInput').value.trim();

    if (!url || !key) {
        showToast("يرجى إدخال الرابط والمفتاح بشكل صحيح", "error");
        return;
    }

    localStorage.setItem('sana_supabase_url', url);
    localStorage.setItem('sana_supabase_key', key);

    if (window.supabase) {
        window.supabaseClient = window.supabase.createClient(url, key);
    }

    showToast("تم حفظ المفاتيح الجديدة بنجاح! جارٍ فحص الاتصال...", "success");
    testSupabaseConnection();
}

function resetDefaultSupabaseConfig() {
    localStorage.removeItem('sana_supabase_url');
    localStorage.removeItem('sana_supabase_key');

    const defaultUrl = 'https://kpzuyjtjixiwgheucudi.supabase.co';
    const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwenV5anRqaXhpd2doZXVjdWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MTM2NDYsImV4cCI6MjEwMzk4OTY0Nn0.xnnDn4U7eVimq3BoE4slmQW41BdGfGvLAs_wTbocawQ';

    const urlInput = document.getElementById('supabaseUrlInput');
    const keyInput = document.getElementById('supabaseKeyInput');
    if (urlInput) urlInput.value = defaultUrl;
    if (keyInput) keyInput.value = defaultKey;

    if (window.supabase) {
        window.supabaseClient = window.supabase.createClient(defaultUrl, defaultKey);
    }

    showToast("تمت استعادة إعدادات سوبابيز الافتراضية", "info");
    testSupabaseConnection();
}

function copySqlScript() {
    const sqlText = document.getElementById('sqlCodeBlock').textContent;
    navigator.clipboard.writeText(sqlText).then(() => {
        showToast("تم نسخ كود الـ SQL بنجاح! افتح SQL Editor في سوبابيز وقم بلصقه وتشغيله.", "success");
    }).catch(() => {
        showToast("يرجى تحديد النص ونسخه يدوياً", "info");
    });
}

// Backup Export & Import
function exportContentAsJson() {
    const data = collectFormData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sana_content_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("تم تصدير ملف النسخة الاحتياطية بنجاح!", "success");
}

function importContentFromJson(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (!imported || typeof imported !== 'object') {
                throw new Error("تنسيق الملف غير صالح");
            }

            if (confirm("هل أنت متأكد من استيراد هذه النسخة الاحتياطية واستبدال المحتوى الحالي؟")) {
                currentContent = imported;
                populateForms(currentContent);
                await saveSiteContent(currentContent);
                showToast("تم استيراد المحتوى وتطبيقه بنجاح!", "success");
            }
        } catch (err) {
            showToast("فشل استيراد الملف: تأكد من أنه ملف JSON صالح", "error");
        }
    };
    reader.readAsText(file);
}

async function handleResetToFactory() {
    if (confirm("تحذير: هل أنت متأكد من رغبتك في استعادة كافة نصوص وصور الموقع الأصلية؟ سيتم مسح أي تعديلات سابقة.")) {
        await resetSiteContent();
        currentContent = getLocalSiteContent();
        populateForms(currentContent);
        showToast("تمت استعادة المحتوى الافتراضي للموقع بنجاح!", "success");
    }
}


// ==========================================================================
// 8. TOAST NOTIFICATION SYSTEM
// ==========================================================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}


// ==========================================================================
// 9. STARTUP & EVENT LISTENERS
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    checkAdminSession();
});

// Warn user before closing if unsaved changes exist
window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'لديك تعديلات غير محفوظة، هل أنت متأكد من المغادرة؟';
    }
});
