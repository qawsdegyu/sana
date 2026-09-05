/**
 * site-content.js - Sana' AI Content Management Engine
 * 
 * Manages website content storage, synchronization with Supabase & localStorage,
 * and live DOM application across the website.
 */

const DEFAULT_SITE_CONTENT = {
    brand: {
        siteTitle: "سَنَع | Sana' AI",
        nameAr: "سَنَع",
        nameEn: "Sana' AI"
    },
    hero: {
        title: "رحلة تحرير المهارة من قيد الشاشة",
        desc: "نحن لا نقدم مجرد \"تطبيق\" آخر، بل نقدم تحولاً جذرياً في مفهوم النفاذ الرقمي، ونصوغ مقترحنا تحت مظلة \"التقنيات الخفية\".",
        btnText: "اكتشف سَنَع",
        btnLink: "#philosophy",
        image: "assets/sana_hero_dark.png"
    },
    vision: {
        headerTitle: "رؤيتنا والفلسفة العميقة",
        card1Title: "رؤيتنا",
        card1P1: "في السباق الرقمي المحموم، سقطت فئة غالية من أطفالنا - ذوي الإعاقة الذهنية البسيطة وتشتت الانتباه - في فجوة معرفية سحيقة. سَنَع هي تكسير قيد الشاشة كلياً. إننا لا نطلب من الطفل أن يتكيف مع التكنولوجيا؛ بل نجعل التكنولوجيا تذوب، وتختفي، وتتكيف مع بيئته الحركية.",
        card1P2: "حيث يصبح صنبور المياه، وخزانة الملابس، وحتى نبض قلب الطفل، هي واجهة الاستخدام (Contextual UI).",
        card2Title: "تكنولوجيا المهارات",
        card2Text: "مستلهم من كتاب \"تكنولوجيا المهارات: نقل وترسيخ المهارات الرقمية\" للمستشار عبدالله السلحوت والمهندس عبدالرحمن خميس.",
        card3Title: "مأسسة القدرات",
        card3Text: "المعرفة المجردة على الشاشات تسبب (Cognitive Overload) عبئاً معرفياً. في سَنَع، نرسخ المهارات حركياً في ذاكرة الطفل وعضلاته، لتصبح التكنولوجيا خادماً لتعقيدات الحياة، وليس عبئاً إضافياً."
    },
    pillars: {
        headerTitle: "الركائز الأربع للتقنيات الخفية",
        p1Title: "التوجيه الحركي والمكاني",
        p1Item1Text: "الملصقات السحرية (IoT Magic Tags)",
        p1Item1Desc: "ملصقات ذكية تُوضع على أدوات المنزل بمجرد لمسها يظهر هولوغرام يشرح حركياً كيفية استخدامها.",
        p1Item2Text: "المسار المضيء (Generative Spatial AI)",
        p1Item2Desc: "استخدام كاميرا الجهاز والذكاء الاصطناعي لإضاءة الأشياء المبعثرة لتدريب الطفل على مهارة الترتيب.",
        p1Item3Text: "الذاكرة العضلية (Haptic Muscle Memory)",
        p1Item3Desc: "قفاز ذكي خفيف الوزن يعتمد على الاستجابة اللمسية لتوجيه أصابع الطفل نحو الاتجاه الصحيح.",
        p1Item4Text: "التوجيه بالصوت المكاني",
        p1Item4Desc: "استخدام سماعات التوصيل العظمي لربط المهارة بالاتجاهات بصوت شخصيته الكرتونية المفضلة.",

        p2Title: "التنظيم العاطفي والتفاعل الاجتماعي",
        p2Item1Text: "التعلم العكسي (Reverse Learning)",
        p2Item1Desc: "الطفل هو من يقوم بتعليم روبوت افتراضي عبر توجيه الكاميرا، لتعزيز ثقته بنفسه.",
        p2Item2Text: "النبض الهادئ (Bio-Feedback)",
        p2Item2Desc: "ربط المنصة بساعة ذكية لقياس نبض القلب، واستبدال المهام بتمارين تنفس عند اكتشاف التوتر.",
        p2Item3Text: "المرايا الاجتماعية (Social AI Mirrors)",
        p2Item3Desc: "استخدام الكاميرا الأمامية كمرآة، يتدرب فيها الطفل على لغة الجسد والتواصل البصري مع طفل افتراضي.",

        p3Title: "المحاكاة العقلية وإدارة الأزمات",
        p3Item1Text: "سيناريوهات الأمان المكاني",
        p3Item1Desc: "محاكاة واقع معزز لحالات طوارئ كالدخان في المطبخ لتدريب الطفل على الهرب المألوف.",
        p3Item2Text: "التحكم بطاقة العقل (Neuro-feedback)",
        p3Item2Desc: "عصابة رأس تقرأ موجات الدماغ (EEG) مرتبطة بلعبة لا تعمل إلا بتركيز الطفل.",

        p4Title: "المأسسة والقياس (التتويج)",
        p4Item1Text: "جواز السفر المهاري المرئي",
        p4Item1Desc: "سجل إنجاز مرئي غير قابل للتلاعب مبني على البلوك تشين، يثبت قدرات الطفل للمجتمع والمدارس."
    },
    journey: {
        headerTitle: "رحلة يومية متكاملة",
        step1Title: "الصباح",
        step1Desc: "تبدأ بالتوجيه بالصوت المكاني ليستيقظ، ثم يستخدم الملصقات السحرية والقفاز الذكي لارتداء ملابسه.",
        step2Title: "التوتر والتهدئة",
        step2Desc: "إذا توتر، يتدخل \"النبض الهادئ\" لتهدئته بتمارين التنفس.",
        step3Title: "بعد الظهر",
        step3Desc: "يتعلم مهارات التواصل أمام \"المرآة الاجتماعية\"، ويدرب تركيزه بلعبة \"طاقة العقل\". ويرتب غرفته بـ\"المسار المضيء\".",
        step4Title: "النهاية",
        step4Desc: "كل مهارة يتقنها تُسجل تلقائياً في \"جواز سفره المهاري\"."
    },
    sandbox: {
        headerTitle: "مختبر سَنَع التفاعلي",
        subtitle: "اكتشف كيف تحوّل سَنَع محيط الطفل إلى واجهة تفاعلية خفية (انقر على النقاط المضيئة)",
        image: "assets/sana_hero.png",
        defaultTitle: "انقر على النقاط لاكتشاف التقنية",
        defaultDesc: "التقنيات الخفية تدمج التعليم داخل البيئة المادية. جرب التفاعل مع عناصر الغرفة.",
        spot1Title: "الملصقات السحرية (الخزانة)",
        spot1Desc: "تلصق على خزانة الملابس. عند لمسها، يظهر توجيه صوتي أو هولوغرام يشرح للطفل كيفية ارتداء ملابسه بشكل مستقل.",
        spot2Title: "المسار المضيء (الأرضية)",
        spot2Desc: "إضاءة تبرز الألعاب المبعثرة على الأرض لتشجيع الطفل على إرجاعها لصندوق الألعاب وترتيب غرفته.",
        spot3Title: "المرآة الاجتماعية",
        spot3Desc: "كاميرا مدمجة تحلل لغة الجسد وتدرب الطفل على التواصل البصري دون الحاجة للنظر إلى شاشة هاتف."
    },
    impact: {
        headerTitle: "لوحة تحكم الأثر الاجتماعي (Social ROI)",
        subtitle: "احسب التوفير المالي المجتمعي التقديري عند تبني تقنيات سَنَع.",
        savingsTitle: "التوفير التقديري (بالريال)",
        savingsDesc: "توفير من تكاليف التربية الخاصة",
        skillsTitle: "الأثر التراكمي الموثق",
        skillsDesc: "مهارة مكتسبة على البلوك تشين"
    },
    roadmap: {
        headerTitle: "خارطة طريق التنفيذ",
        phase1Title: "المرحلة الأولى",
        phase1Desc: "تطوير المستشعرات والنظام المركزي.",
        phase2Title: "المرحلة الثانية",
        phase2Desc: "الشراكات والتقييم مع النادي العلمي لاختبار النظام.",
        phase3Title: "المرحلة الثالثة",
        phase3Desc: "إطلاق جواز السفر المهاري عبر البلوك تشين.",
        phase4Title: "المرحلة الرابعة",
        phase4Desc: "التوسع الوطني والدمج في برامج التربية الخاصة الشاملة."
    },
    science: {
        headerTitle: "الأساس العلمي وشركاء النجاح",
        scienceTitle: "الأساس العلمي (Neuroscience)",
        science1Title: "التعلم المجسد:",
        science1Desc: "التعلم الحركي يخفف العبء المعرفي بنسبة 40% مقارنة بالشاشات.",
        science2Title: "الذاكرة العضلية:",
        science2Desc: "ربط المهام اليومية بحركات محسوسة يسرّع الاستقلالية.",
        science3Title: "تكنولوجيا المهارات:",
        science3Desc: "منهجية معتمدة لنقل وترسيخ المهارات الرقمية والحياتية.",

        ethicsTitle: "ميثاق الخصوصية والأخلاقيات",
        ethics1Title: "تشفير كامل:",
        ethics1Desc: "بيانات الطفل مشفرة ولا تُحفظ في الكاميرات محلياً.",
        ethics2Title: "خصوصية المهارة:",
        ethics2Desc: "توثيق البلوك تشين يمنع التلاعب ويضمن أمن البيانات.",
        ethics3Title: "لا للاستغلال:",
        ethics3Desc: "نرفض استخدام بيانات الأطفال لأغراض تجارية.",

        partnersTitle: "الشركاء المستهدفون للنموذج الأولي",
        partner1: "النادي العلمي القطري",
        partner2: "وزارة التربية والتعليم",
        partner3: "مراكز التأهيل المتخصصة"
    },
    ctas: {
        card1Title: "للمستثمرين والداعمين",
        card1Desc: "استثمر في الجيل القادم من التقنيات الدامجة.",
        card1Btn: "اطلب ملف العرض",
        card1Link: "#impact",

        card2Title: "للجهات الحكومية والابتكارية",
        card2Desc: "كن شريكاً في رعاية وتصنيع النموذج الأولي.",
        card2Btn: "ناقش فرص الرعاية",
        card2Link: "#trust",

        card3Title: "لأولياء الأمور والمختصين",
        card3Desc: "سجل لتكون من أوائل مجربي المنظومة.",
        card3Btn: "القائمة التجريبية",
        card3Link: "#"
    },
    footer: {
        tagline: "سَنَع (Sana' AI) - حيث يتوقف التعلم عن كونه عبئاً معرفياً، ليصبح حياةً تُعاش.",
        copyright: "© 2026 جميع الحقوق محفوظة.",
        poweredByText: "بدعم من",
        poweredByName: "Operix",
        poweredByLink: "https://www.instagram.com/operixsys/"
    }
};

const STORAGE_KEY = 'sana_site_content_v1';

/**
 * Deep merge utility to ensure fallback values exist
 */
function deepMerge(target, source) {
    const output = Object.assign({}, target);
    if (source && typeof source === 'object') {
        Object.keys(source).forEach(key => {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

/**
 * Resolve nested object property via string path like "hero.title"
 */
function getByPath(obj, path) {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

/**
 * Get current site content from LocalStorage or Defaults
 */
function getLocalSiteContent() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return deepMerge(DEFAULT_SITE_CONTENT, parsed);
        }
    } catch (e) {
        console.warn("Could not read site content from localStorage:", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
}

/**
 * Fetch latest site content from Supabase, syncing to localStorage
 */
async function fetchRemoteSiteContent() {
    if (typeof supabaseClient === 'undefined') return getLocalSiteContent();
    try {
        const { data, error } = await supabaseClient
            .from('site_content')
            .select('content')
            .eq('id', 'main_site')
            .single();

        if (data && data.content) {
            const merged = deepMerge(DEFAULT_SITE_CONTENT, data.content);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            return merged;
        }
    } catch (e) {
        // Table might not exist yet or user is offline
        // Silently fallback to local storage
    }
    return getLocalSiteContent();
}

/**
 * Save site content both locally and remotely to Supabase (if available)
 */
async function saveSiteContent(content) {
    const merged = deepMerge(DEFAULT_SITE_CONTENT, content);
    // 1. Save locally
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
        console.error("Failed to save content in localStorage:", e);
    }

    // 2. Save to Supabase if connected
    let remoteSaved = false;
    let remoteError = null;

    if (typeof supabaseClient !== 'undefined') {
        try {
            const { data, error } = await supabaseClient
                .from('site_content')
                .upsert({
                    id: 'main_site',
                    content: merged,
                    updated_at: new Date().toISOString()
                });

            if (error) {
                remoteError = error;
                console.warn("Supabase content save notice:", error.message);
            } else {
                remoteSaved = true;
            }
        } catch (err) {
            remoteError = err;
            console.warn("Supabase upsert error:", err);
        }
    }

    // Trigger local update event
    window.dispatchEvent(new CustomEvent('siteContentChanged', { detail: merged }));
    return { local: true, remote: remoteSaved, error: remoteError };
}

/**
 * Reset site content back to original factory defaults
 */
async function resetSiteContent() {
    localStorage.removeItem(STORAGE_KEY);
    return await saveSiteContent(DEFAULT_SITE_CONTENT);
}

/**
 * Apply site content dynamically to all DOM elements with data-cms attributes
 */
function applySiteContent(customContent) {
    const content = customContent || getLocalSiteContent();

    // 1. Update text nodes
    document.querySelectorAll('[data-cms]').forEach(el => {
        const path = el.getAttribute('data-cms');
        const val = getByPath(content, path);
        if (val !== undefined && val !== null) {
            // Update node text or innerHTML as needed
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.value = val;
            } else {
                el.textContent = val;
            }
        }
    });

    // 2. Update image sources
    document.querySelectorAll('[data-cms-img]').forEach(img => {
        const path = img.getAttribute('data-cms-img');
        const val = getByPath(content, path);
        if (val) {
            img.src = val;
        }
    });

    // 3. Update links
    document.querySelectorAll('[data-cms-link]').forEach(a => {
        const path = a.getAttribute('data-cms-link');
        const val = getByPath(content, path);
        if (val) {
            a.href = val;
        }
    });

    // 4. Update data attributes (e.g. data-details on hotspots or pillars)
    document.querySelectorAll('[data-cms-detail]').forEach(item => {
        const path = item.getAttribute('data-cms-detail');
        const val = getByPath(content, path);
        if (val) {
            item.setAttribute('data-details', val);
        }
    });

    document.querySelectorAll('[data-cms-desc]').forEach(item => {
        const path = item.getAttribute('data-cms-desc');
        const val = getByPath(content, path);
        if (val) {
            item.setAttribute('data-desc', val);
        }
    });

    document.querySelectorAll('[data-cms-title]').forEach(item => {
        const path = item.getAttribute('data-cms-title');
        const val = getByPath(content, path);
        if (val) {
            item.setAttribute('data-title', val);
        }
    });

    // 5. Update page title if requested
    if (content.brand && content.brand.siteTitle && document.title) {
        document.title = content.brand.siteTitle;
    }
}

// Auto-run apply on DOMContentLoaded
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applySiteContent();
            // Also attempt remote sync in the background
            fetchRemoteSiteContent().then(remoteContent => {
                applySiteContent(remoteContent);
            });
        });
    } else {
        applySiteContent();
        fetchRemoteSiteContent().then(remoteContent => {
            applySiteContent(remoteContent);
        });
    }

    // Listen for live update events
    window.addEventListener('siteContentChanged', (e) => {
        applySiteContent(e.detail);
    });
}

// Export for usage across scripts
if (typeof window !== 'undefined') {
    window.DEFAULT_SITE_CONTENT = DEFAULT_SITE_CONTENT;
    window.getLocalSiteContent = getLocalSiteContent;
    window.fetchRemoteSiteContent = fetchRemoteSiteContent;
    window.saveSiteContent = saveSiteContent;
    window.resetSiteContent = resetSiteContent;
    window.applySiteContent = applySiteContent;
    window.getByPath = getByPath;
}
