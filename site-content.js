/**
 * site-content.js - Sana' AI Content Management Engine (Bilingual AR / EN)
 * 
 * Manages website content storage for both Arabic and English, synchronization with
 * Supabase & localStorage, and live DOM application across the website.
 */

const DEFAULT_SITE_CONTENT_AR = {
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

const DEFAULT_SITE_CONTENT_EN = {
    brand: {
        siteTitle: "Sana' AI | Hidden Technologies Platform",
        nameAr: "سَنَع",
        nameEn: "Sana' AI"
    },
    hero: {
        title: "Freeing Skills from the Screen",
        desc: "We don't just offer another 'app', we offer a radical transformation in digital accessibility under the umbrella of 'Hidden Technologies'.",
        btnText: "Discover Sana'",
        btnLink: "#philosophy",
        image: "assets/sana_hero_dark.png"
    },
    vision: {
        headerTitle: "Our Vision and Deep Philosophy",
        card1Title: "Our Vision",
        card1P1: "In the frantic digital race, a precious group of our children - those with mild intellectual disabilities and ADHD - fell into a deep cognitive gap. Sana' shatters the screen barrier. We do not ask the child to adapt to technology; rather, we make technology melt, disappear, and adapt to their kinetic environment.",
        card1P2: "Where the water faucet, the wardrobe, and even the child's heartbeat become the user interface (Contextual UI).",
        card2Title: "Skills Technology",
        card2Text: "Inspired by the book 'Skills Technology: Transferring and Consolidating Digital Skills' by Consultant Abdullah Al-Salhout and Engineer Abdulrahman Khamis.",
        card3Title: "Institutionalizing Capabilities",
        card3Text: "Abstract knowledge on screens causes Cognitive Overload. In Sana', we anchor skills kinetically in the child's memory and muscles, making technology a servant to life's complexities, not an additional burden."
    },
    pillars: {
        headerTitle: "The Four Pillars of Hidden Tech",
        p1Title: "Kinetic & Spatial Guidance",
        p1Item1Text: "IoT Magic Tags",
        p1Item1Desc: "Smart tags placed on household items; when touched, a hologram appears to kinetically explain how to use them.",
        p1Item2Text: "Generative Spatial AI",
        p1Item2Desc: "Using the device camera and AI to illuminate scattered objects to train the child in tidying up.",
        p1Item3Text: "Haptic Muscle Memory",
        p1Item3Desc: "A lightweight smart glove relying on haptic feedback to guide the child's fingers in the right direction.",
        p1Item4Text: "Spatial Audio Guidance",
        p1Item4Desc: "Using bone-conduction headphones to link skills with directions using their favorite cartoon character's voice.",

        p2Title: "Emotional Regulation & Social Interaction",
        p2Item1Text: "Reverse Learning",
        p2Item1Desc: "The child teaches a virtual robot via camera guidance, boosting their self-confidence.",
        p2Item2Text: "Bio-Feedback",
        p2Item2Desc: "Linking the platform to a smartwatch to measure heart rate, substituting tasks with breathing exercises when stress is detected.",
        p2Item3Text: "Social AI Mirrors",
        p2Item3Desc: "Using the front camera as a mirror where the child practices body language and eye contact with a virtual child.",

        p3Title: "Mental Simulation & Crisis Mgmt",
        p3Item1Text: "Spatial Safety Scenarios",
        p3Item1Desc: "AR simulation for emergencies like smoke in the kitchen to train the child on familiar escape routes.",
        p3Item2Text: "Neuro-feedback",
        p3Item2Desc: "An EEG headband reading brainwaves connected to a game that only works with the child's focus.",

        p4Title: "Institutionalization & Measurement",
        p4Item1Text: "Visual Skill Passport",
        p4Item1Desc: "A tamper-proof visual achievement record built on blockchain, proving the child's capabilities to society and schools."
    },
    journey: {
        headerTitle: "An Integrated Daily Journey",
        step1Title: "Morning",
        step1Desc: "Starts with spatial audio guidance to wake up, then uses magic tags and smart gloves to get dressed.",
        step2Title: "Stress & Calming",
        step2Desc: "If stressed, 'Bio-Feedback' intervenes with breathing exercises to calm them down.",
        step3Title: "Afternoon",
        step3Desc: "Learns communication skills in front of the 'Social Mirror', trains focus with 'Mind Energy' game, and tidies the room with 'Spatial AI'.",
        step4Title: "End of Day",
        step4Desc: "Every mastered skill is automatically recorded in their 'Skill Passport'."
    },
    sandbox: {
        headerTitle: "Sana' Interactive Sandbox",
        subtitle: "Discover how Sana' turns the child's surroundings into a hidden interactive interface (Click the glowing hotspots)",
        image: "assets/sana_hero.png",
        defaultTitle: "Click on hotspots to discover the tech",
        defaultDesc: "Hidden technologies merge education into the physical environment. Try interacting with room elements.",
        spot1Title: "Magic Tags (Wardrobe)",
        spot1Desc: "Stuck to the wardrobe. When touched, an audio guide or hologram explains how the child can dress independently.",
        spot2Title: "Illuminated Path (Floor)",
        spot2Desc: "Lights highlighting scattered toys on the floor to encourage the child to put them back and tidy their room.",
        spot3Title: "Social Mirror",
        spot3Desc: "A built-in camera analyzing body language and training the child in eye contact without needing to look at a phone screen."
    },
    impact: {
        headerTitle: "Social ROI Calculator",
        subtitle: "Calculate the estimated societal financial savings when adopting Sana' technologies.",
        savingsTitle: "Estimated Savings (SAR)",
        savingsDesc: "Savings from special education costs",
        skillsTitle: "Documented Cumulative Impact",
        skillsDesc: "Skills acquired via Blockchain"
    },
    roadmap: {
        headerTitle: "Implementation Roadmap",
        phase1Title: "Phase 1",
        phase1Desc: "Developing sensors and central system.",
        phase2Title: "Phase 2",
        phase2Desc: "Partnerships and evaluation with the Science Club to test the system.",
        phase3Title: "Phase 3",
        phase3Desc: "Launching the Skill Passport via Blockchain.",
        phase4Title: "Phase 4",
        phase4Desc: "National expansion and integration into comprehensive special education programs."
    },
    science: {
        headerTitle: "Scientific Basis & Success Partners",
        scienceTitle: "Scientific Basis (Neuroscience)",
        science1Title: "Embodied Learning:",
        science1Desc: "Kinetic learning reduces cognitive load by 40% compared to screens.",
        science2Title: "Muscle Memory:",
        science2Desc: "Linking daily tasks to tangible movements accelerates independence.",
        science3Title: "Skills Technology:",
        science3Desc: "Certified methodology for transferring digital and life skills.",

        ethicsTitle: "Privacy & Ethics Charter",
        ethics1Title: "Full Encryption:",
        ethics1Desc: "Child data is encrypted and never stored locally on cameras.",
        ethics2Title: "Skill Privacy:",
        ethics2Desc: "Blockchain documentation prevents manipulation and ensures data security.",
        ethics3Title: "No Exploitation:",
        ethics3Desc: "We refuse to use children's data for commercial purposes.",

        partnersTitle: "Target Partners for Prototype",
        partner1: "Qatar Scientific Club",
        partner2: "Ministry of Education",
        partner3: "Specialized Rehab Centers"
    },
    ctas: {
        card1Title: "For Investors & Supporters",
        card1Desc: "Invest in the next generation of inclusive tech.",
        card1Btn: "Request Pitch Deck",
        card1Link: "#impact",

        card2Title: "For Govt & Innovation Entities",
        card2Desc: "Partner in sponsoring and manufacturing the prototype.",
        card2Btn: "Discuss Sponsorship",
        card2Link: "#trust",

        card3Title: "For Parents & Specialists",
        card3Desc: "Register to be among the first beta testers.",
        card3Btn: "Beta Waitlist",
        card3Link: "#"
    },
    footer: {
        tagline: "Sana' AI - Where learning stops being a cognitive burden, and becomes a life lived.",
        copyright: "© 2026 All Rights Reserved.",
        poweredByText: "Powered by",
        poweredByName: "Operix",
        poweredByLink: "https://www.instagram.com/operixsys/"
    }
};

const DEFAULT_SITE_CONTENT = {
    ar: DEFAULT_SITE_CONTENT_AR,
    en: DEFAULT_SITE_CONTENT_EN
};

const STORAGE_KEY = 'sana_site_content_v2';

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
            } else if (source[key] !== undefined) {
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
 * Set nested object property via string path like "hero.title"
 */
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

/**
 * Normalize loaded data to always contain { ar: {...}, en: {...} }
 */
function normalizeContentObject(raw) {
    if (!raw || typeof raw !== 'object') {
        return JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
    }
    // Check if it already has ar and en
    if (raw.ar && typeof raw.ar === 'object') {
        return {
            ar: deepMerge(DEFAULT_SITE_CONTENT_AR, raw.ar),
            en: deepMerge(DEFAULT_SITE_CONTENT_EN, raw.en || {})
        };
    }
    // Older schema where raw had hero, vision, etc. directly
    if (raw.hero || raw.brand || raw.vision) {
        return {
            ar: deepMerge(DEFAULT_SITE_CONTENT_AR, raw),
            en: JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT_EN))
        };
    }
    return JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
}

/**
 * Get current site content from LocalStorage or Defaults
 */
function getLocalSiteContent() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('sana_site_content_v1');
        if (saved) {
            const parsed = JSON.parse(saved);
            return normalizeContentObject(parsed);
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
    if (typeof supabaseClient === 'undefined' || !supabaseClient) return getLocalSiteContent();
    try {
        const { data, error } = await supabaseClient
            .from('site_content')
            .select('content')
            .eq('id', 'main_site')
            .single();

        if (data && data.content) {
            const normalized = normalizeContentObject(data.content);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
            return normalized;
        }
    } catch (e) {
        console.warn("Remote site content fetch notice:", e);
    }
    return getLocalSiteContent();
}

/**
 * Save site content both locally and remotely to Supabase (if available)
 */
async function saveSiteContent(content) {
    const normalized = normalizeContentObject(content);

    // 1. Save locally
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (e) {
        console.error("Failed to save content in localStorage:", e);
    }

    // 2. Save to Supabase if connected
    let remoteSaved = false;
    let remoteError = null;

    if (typeof supabaseClient !== 'undefined' && supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('site_content')
                .upsert({
                    id: 'main_site',
                    content: normalized,
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
    window.dispatchEvent(new CustomEvent('siteContentChanged', { detail: normalized }));
    return { local: true, remote: remoteSaved, error: remoteError };
}

/**
 * Reset site content back to original factory defaults
 */
async function resetSiteContent() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('sana_site_content_v1');
    return await saveSiteContent(DEFAULT_SITE_CONTENT);
}

/**
 * Apply site content dynamically to all DOM elements with data-cms attributes
 * @param {Object} [customContent] - Optional full content object
 * @param {string} [langOverride] - Optional active language code ('ar' or 'en')
 */
function applySiteContent(customContent, langOverride) {
    if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') {
        return;
    }
    const rawContent = customContent || getLocalSiteContent();
    const activeLang = langOverride || (typeof localStorage !== 'undefined' ? localStorage.getItem('sana_lang') : null) || 'ar';

    const normalized = normalizeContentObject(rawContent);
    const content = (activeLang === 'en') ? normalized.en : normalized.ar;
    const fallback = normalized.ar;

    function resolveValue(path) {
        let val = getByPath(content, path);
        if (val === undefined || val === null || val === '') {
            val = getByPath(fallback, path);
        }
        return val;
    }

    // 1. Update text nodes
    document.querySelectorAll('[data-cms]').forEach(el => {
        const path = el.getAttribute('data-cms');
        const val = resolveValue(path);
        if (val !== undefined && val !== null) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.value = val;
            } else {
                el.textContent = val;
            }
        }
    });

    // 2. Update image sources (fallback to AR image if EN is not set)
    document.querySelectorAll('[data-cms-img]').forEach(img => {
        const path = img.getAttribute('data-cms-img');
        const val = resolveValue(path);
        if (val) {
            img.src = val;
        }
    });

    // 3. Update links
    document.querySelectorAll('[data-cms-link]').forEach(a => {
        const path = a.getAttribute('data-cms-link');
        const val = resolveValue(path);
        if (val) {
            a.href = val;
        }
    });

    // 4. Update data attributes (data-details, data-desc, data-title)
    document.querySelectorAll('[data-cms-detail]').forEach(item => {
        const path = item.getAttribute('data-cms-detail');
        const val = resolveValue(path);
        if (val) {
            item.setAttribute('data-details', val);
        }
    });

    document.querySelectorAll('[data-cms-desc]').forEach(item => {
        const path = item.getAttribute('data-cms-desc');
        const val = resolveValue(path);
        if (val) {
            item.setAttribute('data-desc', val);
        }
    });

    document.querySelectorAll('[data-cms-title]').forEach(item => {
        const path = item.getAttribute('data-cms-title');
        const val = resolveValue(path);
        if (val) {
            item.setAttribute('data-title', val);
        }
    });

    // 5. Update page title if configured
    if (content && content.brand && content.brand.siteTitle && document.title) {
        document.title = content.brand.siteTitle;
    }
}

// Auto-run apply on DOMContentLoaded
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applySiteContent();
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
    window.DEFAULT_SITE_CONTENT_AR = DEFAULT_SITE_CONTENT_AR;
    window.DEFAULT_SITE_CONTENT_EN = DEFAULT_SITE_CONTENT_EN;
    window.getLocalSiteContent = getLocalSiteContent;
    window.fetchRemoteSiteContent = fetchRemoteSiteContent;
    window.saveSiteContent = saveSiteContent;
    window.resetSiteContent = resetSiteContent;
    window.applySiteContent = applySiteContent;
    window.getByPath = getByPath;
    window.setByPath = setByPath;
}
