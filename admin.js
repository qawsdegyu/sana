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
    // 1. Initialize admin UI language (restores previous choice or defaults to AR)
    const savedLang = localStorage.getItem('sana_admin_lang') || 'ar';
    if (typeof applyAdminLanguage === 'function') {
        applyAdminLanguage(savedLang);
    }

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
    
    // 2. Setup language view (restore user's preferred admin language)
    const savedLang = localStorage.getItem('sana_admin_lang') || 'ar';
    switchAdminContentLang(savedLang, false);

    // 3. Setup navigation tabs
    setupTabNavigation();

    // 4. Setup Knowledge Base Drop Zone
    setupKnowledgeDropZone();

    // 5. Setup Supabase config form & test connection
    initSupabaseCredentialsForm();
    testSupabaseConnection();

    // 6. Remote content fetch in background
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

    // 1. Apply full UI translations, typography & layout direction (RTL / LTR)
    if (typeof applyAdminLanguage === 'function') {
        applyAdminLanguage(lang);
    }

    // 2. Populate form fields with selected language content
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

    // Update Chatbot Knowledge Base Textarea and Files
    const kbTextArea = document.getElementById('chatbotKnowledgeCustomText');
    if (kbTextArea) {
        kbTextArea.value = (currentContent.chatbot_knowledge && currentContent.chatbot_knowledge.customText) || '';
        updateKbTextCounter();
    }
    renderKnowledgeFilesList();
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

    // Collect Chatbot Knowledge Base Text
    if (!currentContent.chatbot_knowledge) {
        currentContent.chatbot_knowledge = { customText: "", files: [] };
    }
    const kbTextArea = document.getElementById('chatbotKnowledgeCustomText');
    if (kbTextArea) {
        currentContent.chatbot_knowledge.customText = kbTextArea.value;
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
    const isEn = (currentAdminLang === 'en');
    document.getElementById('syncBadgeText').textContent = isEn ? 'Unsaved changes exist' : 'هناك تعديلات غير محفوظة';
}

function markChangesSaved(remoteSuccess) {
    hasUnsavedChanges = false;
    const badge = document.getElementById('topbarSyncBadge');
    badge.className = 'sync-badge synced';
    badge.style.borderColor = '';
    badge.style.color = '';
    const isEn = (currentAdminLang === 'en');
    let text = '';
    if (remoteSuccess) {
        text = isEn ? 'Saved to Cloud & Local' : 'محفوظ محلياً وسحابياً';
    } else {
        text = isEn ? 'Saved locally (ready for Supabase)' : 'محفوظ محلياً (جاهز لسوبابيز)';
    }
    document.getElementById('syncBadgeText').textContent = text;
}


// ==========================================================================
// 4. IMAGE UPLOAD & PREVIEW HANDLER
// ==========================================================================

function handleImageFileUpload(event, modelPath, previewImgId) {
    const file = event.target.files[0];
    if (!file) return;

    // Check size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
        const isEn = (currentAdminLang === 'en');
        showToast(isEn ? "Image size too large (max 10MB)" : "حجم الصورة كبير جداً (الحد الأقصى 10 ميغابايت)", "error");
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
        const isEn = (currentAdminLang === 'en');
        showToast(isEn ? "Image uploaded and previewed! Don't forget to save changes." : "تم تحميل ومعاينة الصورة بنجاح! لا تنسَ حفظ التعديلات.", "success");
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
    const isEn = (currentAdminLang === 'en');
    const saveBtn = document.getElementById('btnSaveAll');
    saveBtn.classList.add('saving');
    saveBtn.innerHTML = `<span>⏳</span> <span>${isEn ? 'Saving & Syncing...' : 'جارٍ الحفظ والمزامنة...'}</span>`;

    try {
        const updatedContent = collectFormData();
        const result = await saveSiteContent(updatedContent);

        currentContent = updatedContent;
        markChangesSaved(result.remote);

        let msg = isEn ? "All changes saved successfully!" : "تم حفظ كافة التعديلات بنجاح!";
        if (result.remote) {
            msg += isEn ? " Synced to Supabase 🚀" : " ومزامنتها سحابياً مع Supabase 🚀";
        } else {
            msg += isEn ? " Saved locally (ready for Supabase)." : " تم التخزين الفوري محلياً وسيتم المزامنة مع سوبابيز عند تشغيل الجدول.";
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
        const isEn = (currentAdminLang === 'en');
        showToast((isEn ? "Error saving changes: " : "حدث خطأ أثناء حفظ التعديلات: ") + err.message, "error");
    } finally {
        saveBtn.classList.remove('saving');
        const isEn = (currentAdminLang === 'en');
        saveBtn.innerHTML = `<span>💾</span> <span>${isEn ? 'Save All Changes' : 'حفظ كافة التعديلات'}</span>`;
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
// 7. CHATBOT KNOWLEDGE BASE & AI TRAINING CONTROLLER
// ==========================================================================

function updateKbTextCounter() {
    const el = document.getElementById('chatbotKnowledgeCustomText');
    const counter = document.getElementById('kbTextCounter');
    if (!el || !counter) return;
    const text = el.value || '';
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    counter.textContent = `${chars.toLocaleString('ar-EG')} حرف | ${words.toLocaleString('ar-EG')} كلمة`;
}

function handleKbTextInput() {
    updateKbTextCounter();
    if (!currentContent.chatbot_knowledge) {
        currentContent.chatbot_knowledge = { customText: "", files: [] };
    }
    const el = document.getElementById('chatbotKnowledgeCustomText');
    if (el) {
        currentContent.chatbot_knowledge.customText = el.value;
    }
    markUnsavedChanges();
}

function clearKnowledgeText() {
    const el = document.getElementById('chatbotKnowledgeCustomText');
    if (el) {
        el.value = '';
        handleKbTextInput();
        showToast("تم مسح نص قاعدة المعرفة المباشرة", "info");
    }
}

function setupKnowledgeDropZone() {
    const zone = document.getElementById('kbDropZone');
    if (!zone || zone.hasAttribute('data-initialized')) return;
    zone.setAttribute('data-initialized', 'true');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        zone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        zone.addEventListener(eventName, () => zone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        zone.addEventListener(eventName, () => zone.classList.remove('dragover'), false);
    });

    zone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
            processKnowledgeFiles(files);
        }
    }, false);
}

function handleKnowledgeFilesSelect(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
        processKnowledgeFiles(files);
    }
    event.target.value = '';
}

async function processKnowledgeFiles(fileList) {
    const files = Array.from(fileList);
    if (!files.length) return;

    const progressEl = document.getElementById('kbUploadProgress');
    if (progressEl) progressEl.style.display = 'block';

    if (!currentContent.chatbot_knowledge) {
        currentContent.chatbot_knowledge = { customText: "", files: [] };
    }
    if (!Array.isArray(currentContent.chatbot_knowledge.files)) {
        currentContent.chatbot_knowledge.files = [];
    }

    let successCount = 0;
    let failedFiles = [];

    for (const file of files) {
        try {
            const ext = (file.name.split('.').pop() || '').toLowerCase();
            let extractedText = "";

            if (ext === 'pdf') {
                extractedText = await parsePdfFile(file);
            } else if (['txt', 'md', 'json', 'csv', 'html', 'js'].includes(ext)) {
                extractedText = await parseTextFile(file);
            } else {
                throw new Error(`نوع الملف (${ext}) غير مدعوم حالياً`);
            }

            if (!extractedText || !extractedText.trim()) {
                throw new Error("لم يتم العثور على نصوص قابلة للاستخراج في الملف");
            }

            const fileRecord = {
                id: 'kb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                name: file.name,
                type: ext.toUpperCase(),
                size: formatFileSize(file.size),
                charsCount: extractedText.length,
                text: extractedText.trim(),
                uploadedAt: new Date().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' })
            };

            currentContent.chatbot_knowledge.files.push(fileRecord);
            successCount++;
        } catch (err) {
            console.error(`Error processing file ${file.name}:`, err);
            failedFiles.push(`${file.name} (${err.message})`);
        }
    }

    if (progressEl) progressEl.style.display = 'none';

    renderKnowledgeFilesList();
    markUnsavedChanges();

    if (successCount > 0) {
        showToast(`تم استخراج نصوص ${successCount} ملف وإضافتها لذاكرة المساعد بنجاح! لا تنسَ الضغط على 'حفظ كافة التعديلات'`, "success");
    }
    if (failedFiles.length > 0) {
        showToast(`تعذر قراءة بعض الملفات: ${failedFiles.join(', ')}`, "error");
    }
}

async function parsePdfFile(file) {
    if (typeof pdfjsLib === 'undefined') {
        throw new Error("مكتبة PDF.js غير متوفرة في الصفحة");
    }
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        if (pageText && pageText.trim()) {
            fullText += `[صفحة ${pageNum}]:\n${pageText}\n\n`;
        }
    }
    return fullText;
}

function parseTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error("تعذر قراءة محتوى الملف النصي"));
        reader.readAsText(file);
    });
}

function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function renderKnowledgeFilesList() {
    const container = document.getElementById('kbFilesContainer');
    const countEl = document.getElementById('kbFilesCount');
    const totalCharsEl = document.getElementById('kbTotalChars');
    if (!container) return;

    const files = (currentContent.chatbot_knowledge && currentContent.chatbot_knowledge.files) || [];
    
    if (countEl) countEl.textContent = files.length;
    
    const totalChars = files.reduce((sum, f) => sum + (f.charsCount || (f.text ? f.text.length : 0)), 0);
    if (totalCharsEl) {
        totalCharsEl.textContent = `إجمالي الحروف المستخرجة: ${totalChars.toLocaleString('ar-EG')}`;
    }

    if (files.length === 0) {
        container.innerHTML = `
            <div class="kb-empty-files">
                <div style="font-size: 2.2rem; margin-bottom: 6px;">📂</div>
                <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">لا توجد ملفات مرفوعة حالياً</div>
                <small style="color: var(--text-muted);">اسحب أي ملف PDF أو مستند نصي وأفلته هنا لتدريب البوت عليه فوراً.</small>
            </div>
        `;
        return;
    }

    container.innerHTML = files.map(f => {
        const ext = (f.name.split('.').pop() || '').toLowerCase();
        let icon = '📄';
        if (ext === 'pdf') icon = '📕';
        else if (['json', 'csv'].includes(ext)) icon = '📊';
        else if (['md', 'txt'].includes(ext)) icon = '📝';

        const chars = f.charsCount || (f.text ? f.text.length : 0);

        return `
            <div class="kb-file-card" id="card_${f.id}">
                <div class="kb-file-header">
                    <span class="kb-file-icon">${icon}</span>
                    <div class="kb-file-meta">
                        <div class="kb-file-name" title="${escapeHtml(f.name)}">${escapeHtml(f.name)}</div>
                        <div class="kb-file-details">
                            <span>📦 ${f.size || 'N/A'}</span>
                            <span>🔤 ${chars.toLocaleString('ar-EG')} حرف</span>
                            <span>📅 ${f.uploadedAt || ''}</span>
                        </div>
                    </div>
                </div>
                <div class="kb-file-actions">
                    <button type="button" class="btn-file-action preview" onclick="previewKnowledgeFile('${f.id}')">
                        <span>👁️</span> <span>معاينة المستخرج</span>
                    </button>
                    <button type="button" class="btn-file-action delete" onclick="removeKnowledgeFile('${f.id}')">
                        <span>🗑️</span> <span>حذف</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function previewKnowledgeFile(fileId) {
    const files = (currentContent.chatbot_knowledge && currentContent.chatbot_knowledge.files) || [];
    const file = files.find(f => f.id === fileId);
    if (!file) {
        showToast("الملف غير موجود", "error");
        return;
    }

    const titleEl = document.getElementById('kbModalFileName');
    const textEl = document.getElementById('kbModalFileText');
    const modal = document.getElementById('kbFileModal');

    if (titleEl) titleEl.innerHTML = `<span>📄</span> <span>معاينة: ${escapeHtml(file.name)} (${file.size})</span>`;
    if (textEl) textEl.textContent = file.text || "(الملف لا يحتوي على نص)";
    if (modal) modal.classList.add('show');
}

function closeKbFileModal() {
    const modal = document.getElementById('kbFileModal');
    if (modal) modal.classList.remove('show');
}

function removeKnowledgeFile(fileId) {
    const files = (currentContent.chatbot_knowledge && currentContent.chatbot_knowledge.files) || [];
    const file = files.find(f => f.id === fileId);
    const fileName = file ? file.name : "هذا الملف";

    if (confirm(`هل أنت متأكد من رغبتك في حذف ${fileName} من ذاكرة وتدريب المساعد؟`)) {
        currentContent.chatbot_knowledge.files = files.filter(f => f.id !== fileId);
        renderKnowledgeFilesList();
        markUnsavedChanges();
        showToast("تم حذف الملف بنجاح من قاعدة المعرفة", "info");
    }
}

async function sendAdminTestChat() {
    const input = document.getElementById('adminTestChatInput');
    const sendBtn = document.getElementById('btnAdminTestSend');
    const messagesContainer = document.getElementById('adminTestChatMessages');
    if (!input || !messagesContainer) return;

    const userText = input.value.trim();
    if (!userText) return;

    // 1. Append User Message
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'test-msg user';
    userMsgDiv.innerHTML = `
        <div class="msg-sender">👤 المشرف (أنت):</div>
        <div class="msg-body">${escapeHtml(userText)}</div>
    `;
    messagesContainer.appendChild(userMsgDiv);
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 2. Append Temporary Bot Indicator
    const typingId = 'typing_' + Date.now();
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'test-msg bot';
    botMsgDiv.id = typingId;
    botMsgDiv.innerHTML = `
        <div class="msg-sender">🤖 المبتكر الذكي:</div>
        <div class="msg-body">⏳ جارٍ استرجاع المعلومات من قاعدة المعرفة وتوليد الرد...</div>
    `;
    messagesContainer.appendChild(botMsgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (sendBtn) sendBtn.disabled = true;

    try {
        // Collect current chatbot settings from form
        const model = document.querySelector('[data-model="chatbot.model"]')?.value || 'openai/gpt-4o-mini';
        const customApiKey = document.querySelector('[data-model="chatbot.customApiKey"]')?.value || '';
        const systemPrompt = document.querySelector('[data-model="chatbot.systemPrompt"]')?.value || 'أنت المساعد الذكي لمشروع سَنَع.';
        const customKnowledgeText = document.getElementById('chatbotKnowledgeCustomText')?.value || '';
        const files = (currentContent.chatbot_knowledge && currentContent.chatbot_knowledge.files) || [];

        // Construct combined system prompt
        let fullSystemPrompt = systemPrompt + "\n\n=== قاعدة المعرفة والبيانات المدربة (Knowledge Base) ===";
        if (customKnowledgeText.trim()) {
            fullSystemPrompt += "\n\n[نصوص ومعلومات المشروع الخاصة]:\n" + customKnowledgeText.trim();
        }
        if (files.length > 0) {
            fullSystemPrompt += "\n\n[الملفات والمستندات المرفوعة]:\n";
            files.forEach((f, idx) => {
                fullSystemPrompt += `--- مستند ${idx + 1}: ${f.name} ---\n${f.text}\n\n`;
            });
        }

        const payload = {
            model: model,
            messages: [
                { role: 'system', content: fullSystemPrompt },
                { role: 'user', content: userText }
            ]
        };
        if (customApiKey) payload.apiKey = customApiKey;

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorMsg = "حدث خطأ في الاتصال بالسيرفر.";
            try {
                const errData = await response.json();
                errorMsg = errData.detailed_error || errData.error?.message || errData.error || errorMsg;
            } catch (e) {}
            throw new Error(errorMsg);
        }

        const resData = await response.json();
        const contentStr = resData.choices[0].message.content;

        let displayBody = contentStr;
        // If the model responded in JSON with { response: "..." }
        try {
            const parsed = JSON.parse(contentStr);
            if (parsed.response) {
                displayBody = parsed.response;
            }
        } catch (e) {}

        const typingEl = document.getElementById(typingId);
        if (typingEl) {
            typingEl.querySelector('.msg-body').textContent = displayBody;
        }

    } catch (err) {
        console.error("Test chat error:", err);
        const typingEl = document.getElementById(typingId);
        if (typingEl) {
            typingEl.querySelector('.msg-body').innerHTML = `
                <span style="color: var(--danger);">⚠️ خطأ: ${escapeHtml(err.message)}</span>
                <br><small style="color: var(--text-muted);">تأكد من إدخال مفتاح API في الإعدادات أو تشغيل السيرفر المحلي.</small>
            `;
        }
        showToast("خطأ في محادثة الاختبار: " + err.message, "error");
    } finally {
        if (sendBtn) sendBtn.disabled = false;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


// ==========================================================================
// 8. SUPABASE INTEGRATION & DATABASE UTILS
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
