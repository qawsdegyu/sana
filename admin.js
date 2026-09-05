/**
 * admin.js - Sana' AI Admin Dashboard Logic & Controller
 * 
 * Handles Supabase authentication, form two-way binding, live image processing,
 * cloud & local synchronization, live preview modal, and backup tools.
 */

// State variables
let currentContent = {};
let hasUnsavedChanges = false;

// ==========================================================================
// 1. AUTHENTICATION & SESSION MANAGEMENT
// ==========================================================================

async function checkAdminSession() {
    // 1. Check Supabase Auth
    let user = null;
    if (typeof supabaseClient !== 'undefined') {
        try {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session && session.user) {
                user = session.user;
            }
        } catch (e) {
            console.warn("Supabase session check:", e);
        }
    }

    // 2. Check Local Admin Session
    const localSession = localStorage.getItem('sana_admin_session');

    if (user || localSession) {
        const email = user ? user.email : (localSession || "admin@sana.ai");
        grantAdminAccess(email);
    } else {
        showLoginOverlay();
    }
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
        let loggedIn = false;

        // Try Supabase Auth first
        if (typeof supabaseClient !== 'undefined') {
            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email,
                    password
                });

                if (data && data.session) {
                    loggedIn = true;
                    localStorage.setItem('sana_admin_session', email);
                    showToast("تم تسجيل الدخول بنجاح عبر سوبابيز!", "success");
                    grantAdminAccess(email);
                    return;
                }
            } catch (authErr) {
                console.warn("Supabase auth error:", authErr);
            }
        }

        // Demo fallback for initial setup when user hasn't registered yet in Supabase
        if (email.toLowerCase() === 'admin@sana.ai' || password === 'admin123456' || password === 'admin') {
            localStorage.setItem('sana_admin_session', email);
            showToast("تم الدخول بنجاح في وضع الإدارة والتكوين!", "success");
            grantAdminAccess(email);
            return;
        }

        // If credentials failed and not demo
        throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة. يمكنك الدخول بـ admin@sana.ai أو استخدام زر الدخول السريع حتى تقوم بإعداد حسابك في سوبابيز.");

    } catch (err) {
        showToast(err.message || "فشل تسجيل الدخول", "error");
    } finally {
        submitBtn.disabled = false;
        spinner.style.display = 'none';
    }
}

function bypassLoginForDemo() {
    const demoEmail = "admin@sana.ai";
    localStorage.setItem('sana_admin_session', demoEmail);
    showToast("تم تفعيل وضع المشرف المؤقت. يمكنك الآن ربط سوبابيز وتعديل المحتوى!", "success");
    grantAdminAccess(demoEmail);
}

async function handleAdminLogout() {
    if (confirm("هل أنت متأكد من رغبتك في تسجيل الخروج من لوحة التحكم؟")) {
        if (typeof supabaseClient !== 'undefined') {
            try {
                await supabaseClient.auth.signOut();
            } catch (e) {
                console.warn("SignOut error:", e);
            }
        }
        localStorage.removeItem('sana_admin_session');
        showToast("تم تسجيل الخروج بنجاح", "info");
        setTimeout(() => {
            window.location.reload();
        }, 600);
    }
}


// ==========================================================================
// 2. DASHBOARD INITIALIZATION & NAVIGATION
// ==========================================================================

async function initDashboard() {
    // 1. Fetch current content (local + remote)
    currentContent = getLocalSiteContent();
    populateForms(currentContent);

    // 2. Setup navigation tabs
    setupTabNavigation();

    // 3. Setup Supabase config form & test connection
    initSupabaseCredentialsForm();
    testSupabaseConnection();

    // 4. Remote content fetch in background
    fetchRemoteSiteContent().then(remoteContent => {
        if (remoteContent) {
            currentContent = remoteContent;
            populateForms(currentContent);
        }
    });
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
        const val = getByPath(content, path);
        if (val !== undefined && val !== null) {
            el.value = val;
        }

        // Attach change listener to mark unsaved
        if (!el.hasAttribute('data-bound')) {
            el.setAttribute('data-bound', 'true');
            el.addEventListener('input', () => {
                markUnsavedChanges();
            });
        }
    });

    // Update Image Previews
    if (content.hero && content.hero.image) {
        const heroPrev = document.getElementById('preview_hero_image');
        if (heroPrev) heroPrev.src = content.hero.image;
    }

    if (content.sandbox && content.sandbox.image) {
        const sbPrev = document.getElementById('preview_sandbox_image');
        if (sbPrev) sbPrev.src = content.sandbox.image;
    }
}

function collectFormData() {
    const content = JSON.parse(JSON.stringify(currentContent));

    document.querySelectorAll('[data-model]').forEach(el => {
        const path = el.getAttribute('data-model');
        const val = el.value;
        setByPath(content, path, val);
    });

    return content;
}

function setByPath(obj, path, value) {
    if (!obj || !path) return;
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part] || typeof current[part] !== 'object') {
            current[part] = {};
        }
        current = current[part];
    }
    current[parts[parts.length - 1]] = value;
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

    const currentUrl = localStorage.getItem('sana_supabase_url') || 'https://faovafodbyauohwremth.supabase.co';
    const currentKey = localStorage.getItem('sana_supabase_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhb3ZhZm9kYnlhdW9od3JlbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNTU4ODEsImV4cCI6MjA5ODgzMTg4MX0.p8QvMw3jj_Nx3VdJ-0WZFRg7CGnA8dI-ZJYyI8M4qh4';

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

    const defaultUrl = 'https://faovafodbyauohwremth.supabase.co';
    const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhb3ZhZm9kYnlhdW9od3JlbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNTU4ODEsImV4cCI6MjA5ODgzMTg4MX0.p8QvMw3jj_Nx3VdJ-0WZFRg7CGnA8dI-ZJYyI8M4qh4';

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
