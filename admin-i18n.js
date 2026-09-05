/**
 * admin-i18n.js - Full Bilingual Engine (Arabic & English) for Sana' Admin Dashboard
 * 
 * Provides complete translation of all navigation, headers, labels, card titles,
 * buttons, placeholders, stats, notifications, modals, and direction (RTL/LTR).
 */

const ADMIN_I18N_MAP = {
    // Topbar & Navigation
    "لوحة تحكم المشرف | سَنَع": "Admin Dashboard | Sana'",
    "لوحة تحكم المشرف": "Admin Dashboard",
    "سَنَع الإدارة": "Sana' Admin",
    "CONTROL PANEL": "CONTROL PANEL",
    "لوحة التحكم": "Dashboard",
    "الرئيسية والتحكم": "Main & Dashboard",
    "نظرة عامة ومؤشرات": "Overview & KPIs",
    "أقسام الموقع": "Site Sections",
    "الهيدر والواجهة الرئيسية": "Hero & Main Banner",
    "الرؤية والفلسفة": "Vision & Philosophy",
    "الركائز الأربع للتقنية": "Four Tech Pillars",
    "الرحلة اليومية المتكاملة": "Daily Journey",
    "المختبر التفاعلي والغرفة": "Interactive Sandbox",
    "المختبر والغرفة التفاعلية": "Interactive Sandbox",
    "حاسبة الأثر وخارطة الطريق": "Impact & Roadmap",
    "الأساس العلمي والشركاء": "Science & Partners",
    "أزرار الدعوة والفوتر": "CTAs & Footer",
    "الذكاء الاصطناعي والمعرفة": "AI & Knowledge Base",
    "المساعد الذكي والتدريب": "Smart Creator AI & Training",
    "النظام وقاعدة البيانات": "System & Database",
    "إعدادات سوبابيز والنسخ": "Supabase & Backup",
    "نشط ومصرح له": "Active & Authorized",
    "الموقع": "Website",
    "خروج": "Logout",
    "معاينة حية": "Live Preview",
    "حفظ كافة التعديلات": "Save All Changes",
    "جاهز للحفظ": "Ready to save",
    "هناك تعديلات غير محفوظة": "Unsaved changes exist",
    "محفوظ محلياً وسحابياً": "Saved to Cloud & Local",
    "محفوظ محلياً (جاهز لسوبابيز)": "Saved locally (ready for Supabase)",

    // Status Bar & Language Switchers
    "لغة اللوحة والمحتوى:": "Dashboard & Content Language:",
    "لغة لوحة التحكم والمحتوى:": "Dashboard & Content Language:",
    "🇸🇦 وضع التحرير: اللغة العربية (AR)": "🇸🇦 Editing Mode: Arabic (AR)",
    "يتم الآن تعديل وحفظ نصوص الموقع المخصصة للنسخة العربية.": "Currently editing and saving website content for the Arabic version.",
    "يتم تعديل وحفظ نصوص الموقع المخصصة للنسخة العربية.": "Currently editing and saving website content for the Arabic version.",
    "استعادة النموذج العربي المعتمد": "Restore Approved Arabic Template",
    "🇬🇧 وضع التحرير: English (EN)": "🇬🇧 Editing Mode: English (EN)",
    "يتم الآن تعديل وحفظ نصوص الموقع المعروضة للزوار باللغة الإنجليزية.": "Currently editing and saving website content for the English version.",
    "استيراد النموذج الإنجليزي المعتمد (Auto-Fill)": "Auto-Fill Approved English Template",

    // Overview Tab
    "نظرة عامة وإدارة المحتوى": "Overview & Content Management",
    "مرحباً بك في لوحة تحكم موقع سَنَع. يمكنك من هنا تعديل النصوص، الفقرات، العناوين، واستبدال الصور فورياً باللغتين العربية والإنجليزية.": "Welcome to Sana' Admin Panel. Here you can edit texts, paragraphs, headings, and replace images in real-time for both Arabic and English.",
    "أقسام قابلة للتعديل": "Editable Sections",
    "صور ديناميكية": "Dynamic Images",
    "دعم الرفع المباشر والروابط": "Direct upload & URLs supported",
    "دعم ثنائي اللغة كامل": "Full Bilingual Support",
    "سحابي ومحلي": "Cloud & Local",
    "حفظ مزدوج وفوري": "Instant Dual Persistence",
    "معلومات الهوية والعلامة التجارية": "Brand & Identity Metadata",
    "إعدادات عامة": "General Settings",
    "عنوان الموقع بالمتصفح (Browser Page Title)": "Browser Page Title",
    "اسم المنصة المعروض في شريط التنقل (Navbar Brand)": "Platform Name in Navigation Bar",

    // Hero Tab
    "الهيدر والشاشة الافتتاحية (Hero Section)": "Hero Section & Header",
    "تعديل النصوص الرئيسية في واجهة الموقع وصورة الواجهة المركزية وزر الدعوة لاتخاذ إجراء.": "Edit hero headline, sub-headline, main CTA button, and hero banner image.",
    "النصوص الرئيسية للواجهة": "Hero Headlines & Texts",
    "نصوص وشعارات": "Headlines & Slogans",
    "العنوان الرئيسي الكبير": "Main Hero Headline",
    "العنوان الفرعي التوضيحي": "Subtitle Description",
    "نص زر الدعوة للإجراء (CTA Button)": "CTA Button Text",
    "رابط زر الدعوة (مثال: #sandbox أو رابط خارجي)": "CTA Button Link (e.g. #sandbox or URL)",
    "صورة الواجهة الرئيسية": "Hero Banner Image",
    "صورة الهيرو": "Hero Image",
    "رفع صورة جديدة من جهازك": "Upload new image from your device",
    "أو أدخل مسار / رابط الصورة:": "Or enter image file path / URL:",

    // Vision Tab
    "الرؤية وفلسفة سَنَع العميقة (Vision & Philosophy)": "Vision & Sana' Deep Philosophy",
    "تعديل بطاقة الرؤية وبطاقة تكنولوجيا المهارات المستلهمة من الكتاب، وبطاقة مأسسة القدرات.": "Edit Vision card, Skills Technology book card, and Institutionalizing Capabilities card.",
    "بطاقة الرؤية (Our Vision)": "Vision Card (Our Vision)",
    "تكنولوجيا المهارات (Skills Tech)": "Skills Technology (Book Card)",
    "مأسسة القدرات (Institutionalization)": "Institutionalizing Capabilities Card",
    "العنوان": "Title",
    "الوصف": "Description",

    // Pillars Tab
    "الركائز الأربع للتقنية الخفية (Four Pillars)": "Four Hidden Tech Pillars",
    "تعديل عناوين الركائز الأربع، وعناصر كل ركيزة وشرح النوافذ المنبثقة التفاعلية.": "Edit the four pillars, their sub-items, and interactive popup descriptions.",
    "عنوان القسم الرئيسي": "Main Section Title",
    "الركيزة 1: التوجيه الحركي والمكاني": "Pillar 1: Kinetic & Spatial Guidance",
    "الركيزة 2: التنظيم العاطفي والتفاعل": "Pillar 2: Emotional Regulation & Interaction",
    "الركيزة 3: المحاكاة وإدارة الأزمات": "Pillar 3: Simulation & Crisis Management",
    "الركيزة 4: المأسسة والقياس": "Pillar 4: Institutionalization & Measurement",
    "عنوان الركيزة": "Pillar Title",
    "العنصر 1 - الاسم": "Item 1 - Name",
    "العنصر 2 - الاسم": "Item 2 - Name",
    "العنصر 3 - الاسم": "Item 3 - Name",
    "التفاصيل المنبثقة:": "Popup Details:",

    // Journey Tab
    "الرحلة اليومية المتكاملة (Daily Journey)": "Daily Integrated Journey",
    "تعديل محطات اليوم الأربع: الصباح، التوتر والتهدئة، بعد الظهر، ونهاية اليوم.": "Edit the 4 daily stations: Morning, Stress & Calming, Afternoon, and End of Day.",
    "المرحلة 1: الصباح": "Stage 1: Morning",
    "المرحلة 2: التوتر والتهدئة": "Stage 2: Stress & Calming",
    "المرحلة 3: بعد الظهر": "Stage 3: Afternoon",
    "المرحلة 4: النهاية": "Stage 4: End of Day",

    // Sandbox Tab
    "مختبر سَنَع التفاعلي (Interactive Sandbox)": "Sana' Interactive Room Sandbox",
    "تعديل صورة الغرفة التفاعلية ومحتوى النقاط المضيئة (Hotspots).": "Edit interactive room image and hotspot popup contents.",
    "صورة الغرفة التفاعلية ومقدمة القسم": "Interactive Room Image & Section Intro",
    "الصورة والخلفية": "Image & Background",
    "الوصف التوجيهي للقسم": "Section Introductory Description",
    "عنوان الصندوق التوضيحي الافتراضي": "Default Info Box Title",
    "نص الصندوق التوضيحي الافتراضي": "Default Info Box Description",
    "صورة الغرفة التفاعلية:": "Interactive Room Image:",
    "رفع صورة غرفة جديدة من جهازك": "Upload new room image from device",
    "النقاط التفاعلية في الغرفة (Hotspots)": "Room Interactive Hotspots",
    "3 نقاط": "3 Spots",
    "النقطة 1 (الخزانة) - العنوان": "Hotspot 1 (Wardrobe) - Title",
    "النقطة 2 (الأرضية) - العنوان": "Hotspot 2 (Floor) - Title",
    "النقطة 3 (المرآة الاجتماعية) - العنوان": "Hotspot 3 (Social Mirror) - Title",
    "الوصف عند النقر:": "Description on Click:",

    // Impact & Roadmap Tab
    "حاسبة الأثر وخارطة الطريق (ROI & Roadmap)": "Social ROI & Implementation Roadmap",
    "تعديل نصوص حاسبة التوفير المالي ومراحل خارطة الطريق المستقبلية.": "Edit social savings calculator texts and future roadmap phases.",
    "حاسبة الأثر الاجتماعي (Social ROI)": "Social ROI Calculator",
    "الحاسبة": "Calculator",
    "عنوان نتيجة التوفير": "Savings Result Title",
    "شرح نتيجة التوفير": "Savings Result Description",
    "عنوان مهارات البلوك تشين": "Blockchain Skills Title",
    "شرح مهارات البلوك تشين": "Blockchain Skills Description",
    "خارطة طريق التنفيذ (Roadmap)": "Implementation Roadmap",
    "4 مراحل": "4 Phases",
    "عنوان قسم خارطة الطريق": "Roadmap Section Title",
    "المرحلة الأولى - العنوان": "Phase 1 - Title",
    "المرحلة الثانية - العنوان": "Phase 2 - Title",
    "المرحلة الثالثة - العنوان": "Phase 3 - Title",
    "المرحلة الرابعة - العنوان": "Phase 4 - Title",

    // Science & Partners Tab
    "الأساس العلمي وميثاق الخصوصية والشركاء": "Scientific Foundation, Ethics & Partners",
    "تعديل نقاط الأساس العلمي (Neuroscience)، ميثاق الخصوصية، وأسماء الشركاء المستهدفين.": "Edit neuroscience points, privacy ethics charter, and targeted partners.",
    "الأساس العلمي (Neuroscience)": "Neuroscience Foundation",
    "عنوان البطاقة": "Card Title",
    "النقطة 1 - العنوان والشرح": "Point 1 - Title & Details",
    "النقطة 2 - العنوان والشرح": "Point 2 - Title & Details",
    "النقطة 3 - العنوان والشرح": "Point 3 - Title & Details",
    "ميثاق الخصوصية والأخلاقيات": "Privacy Charter & Ethics",
    "البند 1 - العنوان والشرح": "Clause 1 - Title & Details",
    "البند 2 - العنوان والشرح": "Clause 2 - Title & Details",
    "البند 3 - العنوان والشرح": "Clause 3 - Title & Details",
    "الشركاء المستهدفون للنموذج الأولي": "Targeted Prototype Partners",
    "عنوان بطاقة الشركاء": "Partners Card Title",
    "الشريك 1": "Partner 1",
    "الشريك 2": "Partner 2",
    "الشريك 3": "Partner 3",

    // CTAs & Footer Tab
    "أزرار الدعوة والفوتر (CTAs & Footer)": "Calls to Action & Footer",
    "تعديل بطاقات التواصل الثلاث ونصوص حقوق النشر وروابط الفوتر.": "Edit contact cards, copyright texts, and footer tagline.",
    "بطاقة المستثمرين": "Investors Card",
    "بطاقة الجهات الحكومية والابتكارية": "Government & Innovation Entities Card",
    "بطاقة أولياء الأمور والمختصين": "Parents & Specialists Card",
    "نص الزر": "Button Text",
    "الرابط": "Link",
    "الفوتر وحقوق النشر (Footer)": "Footer & Copyright",
    "جملة الفوتر الرئيسية (Tagline)": "Footer Main Tagline",
    "نص الحقوق وسنة النشر": "Copyright Text & Year",

    // Chatbot Tab
    "إدارة وتدريب المساعد الذكي (Smart Creator AI)": "Smart Creator AI Management & Training",
    "تحكم كامل بهوية المساعد، رسائل الترحيب، شخصية الذكاء الاصطناعي، ونصوص وملفات قاعدة المعرفة للتدريب الحي.": "Full control over bot identity, welcome screens, AI persona, and direct knowledge base files for live training.",
    "هوية المساعد وشاشة الترحيب": "Bot Identity & Welcome Screen",
    "الواجهة الرئيسية للبوت": "Bot Main Interface",
    "اسم المساعد (Bot Name)": "Bot Name",
    "عنوان شاشة الترحيب (Welcome Title)": "Welcome Screen Title",
    "الوصف الترحيبي الفرعي (Welcome Subtitle)": "Welcome Subtitle Description",
    "نموذج الذكاء الاصطناعي (AI Model)": "AI Engine Model",
    "مفتاح OpenRouter API مخصص (اختياري)": "Custom OpenRouter API Key (Optional)",
    "اتركه فارغاً إذا كنت تعتمد على مفتاح السيرفر في Vercel.": "Leave blank to use default server key in Vercel.",
    "الأزرار التفاعلية السريعة (Quick Actions)": "Interactive Quick Actions",
    "اقتراحات المحادثة": "Conversation Starters",
    "الزر السريع 1 (النص المعروض)": "Quick Button 1 (Display Text)",
    "السؤال المرسل للبوت عند النقر": "Prompt Sent to Bot on Click",
    "الزر السريع 2 (النص المعروض)": "Quick Button 2 (Display Text)",
    "الزر السريع 3 (النص المعروض)": "Quick Button 3 (Display Text)",
    "توجيهات وشخصية الذكاء الاصطناعي (System Prompt)": "AI System Prompt & Persona Instructions",
    "أوامر المحرك": "Engine Prompt",
    "هذه التعليمات تحدد تصرفات المساعد وهيكل إجاباته الإلزامي. (يتغير محتوى هذا الحقل حسب لغة التحرير المختارة 🇸🇦 / 🇬🇧):": "These instructions define the assistant's behavior and required response schema (switches between 🇸🇦 / 🇬🇧):",
    "نصوص ومعلومات قاعدة المعرفة للتدريب (Direct Training Text)": "Direct Knowledge Base & Training Text",
    "تدريب مباشر": "Direct Training",
    "الصق هنا أي نصوص، مقالات، معلومات خاصة بالمشروع، إحصائيات، أو أجوبة لأسئلة شائعة تريد أن يعرفها الذكاء الاصطناعي ويجيب الزوار بناءً عليها:": "Paste any texts, articles, project details, statistics, or FAQs you want the AI to know and reference when answering visitors:",
    "مسح النص": "Clear Text",
    "رفع وتدريب البوت على الملفات والمستندات (Knowledge Files)": "Upload & Train on Knowledge Documents",
    "ارفع ملفاتك المرجعية (كتب، مقترحات، ملفات PDF أو نصوص). سيقوم النظام باستخراج نصوصها تلقائياً وضمها لذاكرة المساعد الذكي:": "Upload reference documents (books, proposals, PDF or text files). The system automatically extracts texts and embeds them into the bot's memory:",
    "انقر لاختيار ملفات أو اسحبها وأفلتها هنا": "Click to choose files or drag & drop them here",
    "يدعم مستندات PDF وملفات النصوص TXT و Markdown و JSON (يمكنك اختيار عدة ملفات معاً)": "Supports PDF, TXT, Markdown, and JSON documents (Multiple files supported)",
    "📂 اختيار ملفات من جهازك": "📂 Browse files from device",
    "الملفات المرفوعة والمدرّبة حالياً": "Currently Uploaded & Trained Documents",
    "إجمالي الحروف المستخرجة:": "Total Extracted Characters:",
    "لا توجد ملفات مرفوعة حالياً": "No files uploaded currently",
    "اسحب أي ملف PDF أو مستند نصي وأفلته هنا لتدريب البوت عليه فوراً.": "Drag & drop any PDF or text document here to train the bot immediately.",
    "معاينة المستخرج": "Preview Text",
    "معاينة النص": "Preview Text",
    "مختبر الاختبار الحي للمساعد (Live AI Test Sandbox)": "Live AI Test Sandbox",
    "فحص فوري للاستجابة": "Instant Response Check",
    "اختبر ردود المساعد الذكي الآن وتأكد من أنه استوعب النصوص والملفات المرفوعة قبل نشر التعديلات للزوار:": "Test the assistant's responses now and make sure it has understood uploaded documents before publishing:",
    "مرحباً بك! أنا جاهز للاختبار. اسألني أي سؤال عن الموقع، أو عن أي ملف أو معلومة قمت برفعها وتدريبي عليها الآن.": "Welcome! I am ready for testing. Ask me anything about the site or any uploaded documents.",
    "اكتب سؤالاً لاختبار المساعد الذكي هنا...": "Type a question to test the AI assistant here...",
    "إرسال": "Send",

    // Settings Tab
    "إعدادات سوبابيز (Supabase) والنسخ الاحتياطي": "Supabase Settings & Backup",
    "ربط قاعدة بيانات سوبابيز، نسخ كود الـ SQL، استيراد وتصدير نسخة احتياطية من الموقع.": "Connect Supabase database, copy SQL script, and import/export site backups.",
    "مفاتيح الربط مع مشروع Supabase": "Supabase Connection Credentials",
    "إعدادات الاتصال": "Connection Settings",
    "تأكد من أن هذه المفاتيح تطابق مشروعك الحالي في سوبابيز (من Project Settings -> API):": "Ensure these keys match your Supabase project (under Project Settings -> API):",
    "رابط المشروع (Project URL):": "Project URL:",
    "مفتاح Anon العام (Anon Public Key):": "Anon Public Key:",
    "حفظ المفاتيح وتحديث الاتصال": "Save Keys & Reconnect",
    "استعادة المفاتيح الافتراضية": "Restore Default Keys",
    "حالة الاتصال وقاعدة البيانات": "Connection Status & Database Table",
    "لتمكين حفظ ومزامنة كافة نصوص وصور الموقع سحابياً في حسابك على Supabase، انسخ كود الـ SQL التالي وشغّله في SQL Editor داخل لوحة تحكم سوبابيز:": "To enable cloud sync for all texts and images in Supabase, copy the SQL below and run it in Supabase SQL Editor:",
    "نسخ كود الـ SQL": "Copy SQL Script",
    "النسخ الاحتياطي واستعادة البيانات": "Backup & Data Restoration",
    "أدوات الطوارئ": "Maintenance & Safety",
    "يمكنك تصدير ملف يحتوي على كامل إعدادات ونصوص الموقع كنسخة احتياطية على جهازك، أو استيراد ملف سابق لاسترجاعه.": "Export a backup JSON file containing all site content, or import a previous backup file.",
    "تصدير نسخة احتياطية (JSON)": "Export Backup (JSON)",
    "استيراد ملف نسخة احتياطية (JSON)": "Import Backup (JSON)",
    "استعادة المحتوى الافتراضي للموقع": "Restore Factory Defaults",

    // Auth Screen
    "لوحة تحكم سَنَع": "Sana' Admin Dashboard",
    "بوابة إدارة المحتوى الشاملة والتحكم بالموقع": "Comprehensive Content Management Portal",
    "البريد الإلكتروني للمشرف": "Admin Email Address",
    "كلمة المرور": "Password",
    "تسجيل الدخول إلى لوحة التحكم": "Sign In to Admin Dashboard",
    "← العودة إلى الموقع الرئيسي": "← Return to Main Website",

    // Modals
    "معاينة الموقع الحية": "Live Website Preview",
    "كمبيوتر (100%)": "Desktop (100%)",
    "تابلت (768px)": "Tablet (768px)",
    "موبايل (390px)": "Mobile (390px)",
    "معاينة نص المستند": "Document Text Preview",
    "معاينة الموقع بحجم الشاشة الكاملة": "Full-Screen Live Website Preview",
    "تحديث": "Refresh",
    "🔄 تحديث": "🔄 Refresh",

    // Overview Extra
    "إجراءات سريعة": "Quick Actions",
    "روابط فورية": "Direct Shortcuts",
    "تعديل الهيدر وصورة البداية": "Edit Hero & Banner Image",
    "تعديل صورة ونقاط مختبر سَنَع": "Edit Room Image & Hotspots",
    "تعديل محتوى الركائز الأربع": "Edit Four Pillars Content",
    "بيانات الهوية والموقع (Brand)": "Brand & Site Identity",
    "العلامة التجارية": "Brand",
    "عنوان صفحة الويب في المتصفح (Browser Title)": "Browser Page Title",
    "اسم المنصة بالعربية": "Platform Name in Arabic",
    "اسم المنصة بالإنجليزية": "Platform Name in English",
    "يتم تعديل وحفظ نصوص الموقع المخصصة للنسخة العربية.": "Currently editing and saving website content for the Arabic version.",

    // Hero Extra
    "الهيدر والواجهة الرئيسية (Hero Section)": "Hero & Main Section",
    "تعديل نصوص الترحيب الرئيسية، الأزرار، وصورة واجهة الموقع.": "Edit main headlines, buttons, and hero banner image.",
    "النصوص والعناوين": "Headlines & Titles",
    "واجهة الموقع": "Homepage Banner",
    "الوصف والفقرة التوضيحية": "Description & Explanatory Paragraph",
    "نص زر الدعوة (CTA Button)": "CTA Button Text",
    "رابط الزر (مثل #philosophy)": "Button Link (e.g. #philosophy)",
    "صورة الهيرو الرئيسية (Hero Image)": "Main Hero Banner Image",
    "صورة": "Image",
    "رفع صورة من جهازك": "Upload image from your device",
    "أو أدخل مسار / رابط الصورة المباشر:": "Or enter direct image path / URL:",

    // Vision Extra
    "الرؤية والفلسفة العميقة (Vision & Philosophy)": "Vision & Deep Philosophy",
    "تعديل عنوان القسم وبطاقات الرؤية، تكنولوجيا المهارات ومأسسة القدرات.": "Edit section title, vision cards, skills technology, and institutionalization.",
    "بطاقة الرؤية (Card 1)": "Vision Card (Card 1)",
    "الرؤية": "Vision",
    "الفقرة الأولى": "Paragraph 1",
    "الفقرة الثانية": "Paragraph 2",
    "بطاقة تكنولوجيا المهارات (Card 2)": "Skills Technology (Card 2)",
    "الفلسفة": "Philosophy",
    "نص البطاقة": "Card Text",
    "بطاقة مأسسة القدرات (Card 3)": "Institutionalizing Capabilities (Card 3)",
    "القدرات": "Capabilities",

    // Pillars Extra
    "الركائز الأربع للتقنيات الخفية (Four Pillars)": "Four Hidden Tech Pillars",
    "تعديل عناوين الركائز وعناصر كل ركيزة مع نصوص النوافذ المنبثقة التفصيلية.": "Edit pillars titles, items, and detailed popup texts.",
    "التفاصيل المنبثقة (Popup Text):": "Popup Text:",
    "العنصر 4 - الاسم": "Item 4 - Name",
    "الركيزة 2: التنظيم العاطفي والتفاعل الاجتماعي": "Pillar 2: Emotional Regulation & Social Interaction",
    "الركيزة 3: المحاكاة العقلية وإدارة الأزمات": "Pillar 3: Mental Simulation & Crisis Management",

    // Journey Extra
    "عنوان القسم": "Section Title",
    "الوصف:": "Description:",

    // Chatbot Extra
    "OpenAI GPT-4o Mini (سريع واقتصادي وموصى به)": "OpenAI GPT-4o Mini (Fast, Cost-efficient & Recommended)",
    "OpenAI GPT-4o (أعلى دقة وفهم عميق)": "OpenAI GPT-4o (Highest Accuracy & Deep Understanding)",
    "Google Gemini Flash 1.5": "Google Gemini Flash 1.5",
    "Anthropic Claude 3.5 Haiku": "Anthropic Claude 3.5 Haiku",
    "0 حرف | 0 كلمة": "0 characters | 0 words",
    "⏳ جارٍ قراءة واستخراج النصوص من الملفات المرفوعة...": "⏳ Reading and extracting texts from uploaded files...",
    "الملفات المرفوعة والمدرّبة حالياً": "Currently Uploaded & Trained Files",
    "🤖 المبتكر الذكي:": "🤖 Smart Creator:",

    // Settings Extra
    "إعادة فحص الاتصال بـ Supabase": "Re-test Supabase Connection",
    "النسخ الاحتياطي والاستيراد (Backup & Restore)": "Backup & Restore"
};

// Reverse map for English -> Arabic restoration
const ADMIN_I18N_REVERSE = {};
Object.entries(ADMIN_I18N_MAP).forEach(([ar, en]) => {
    ADMIN_I18N_REVERSE[en] = ar;
});

/**
 * Apply the requested language to the Admin Dashboard UI
 * @param {string} lang - 'ar' or 'en'
 */
function applyAdminLanguage(lang) {
    const isEn = (lang === 'en');

    // 1. Direction and typography
    document.documentElement.dir = isEn ? 'ltr' : 'rtl';
    document.documentElement.lang = isEn ? 'en' : 'ar';
    document.body.classList.toggle('lang-en', isEn);
    
    const appEl = document.getElementById('adminApp');
    if (appEl) {
        appEl.classList.toggle('lang-mode-en', isEn);
    }

    // 2. Translate text nodes across the admin interface
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        if (!parent) continue;
        
        // Skip script, style, and code blocks
        if (['SCRIPT', 'STYLE', 'CODE', 'PRE'].includes(parent.tagName)) continue;
        if (parent.classList && (parent.classList.contains('sql-code') || parent.id === 'kbModalFileText')) continue;
        
        // Skip language switcher buttons so labels and flags remain intact
        if (parent.closest('.btn-lang-tab') || parent.closest('.btn-sidebar-lang') || parent.closest('.btn-status-lang')) continue;

        // Do not alter content inside form controls (inputs / textareas)
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(parent.tagName)) continue;

        const original = node.nodeValue;
        const trimmed = original.trim();
        if (!trimmed) continue;

        if (isEn) {
            if (ADMIN_I18N_MAP[trimmed]) {
                node.nodeValue = original.replace(trimmed, ADMIN_I18N_MAP[trimmed]);
            }
        } else {
            if (ADMIN_I18N_REVERSE[trimmed]) {
                node.nodeValue = original.replace(trimmed, ADMIN_I18N_REVERSE[trimmed]);
            }
        }
    }

    // 3. Translate placeholders
    const placeholders = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    placeholders.forEach(el => {
        // Skip form inputs that hold editable CMS values
        if (el.id === 'adminTestChatInput') {
            el.placeholder = isEn ? "Type a question to test the AI assistant here..." : "اكتب سؤالاً لاختبار المساعد الذكي هنا...";
        }
    });

    // 4. Update language toggle buttons across all locations (Topbar, Sidebar, Status bar, Login Box)
    const toggleButtonPairs = [
        ['btnAdminLangAr', 'btnAdminLangEn'],
        ['btnSidebarLangAr', 'btnSidebarLangEn'],
        ['btnStatusLangAr', 'btnStatusLangEn'],
        ['btnLoginLangAr', 'btnLoginLangEn']
    ];

    toggleButtonPairs.forEach(([arId, enId]) => {
        const btnAr = document.getElementById(arId);
        const btnEn = document.getElementById(enId);
        if (btnAr) btnAr.classList.toggle('active', !isEn);
        if (btnEn) btnEn.classList.toggle('active', isEn);
    });

    // 5. Update Status bar text
    const badgeEl = document.getElementById('langBadge');
    const subTextEl = document.getElementById('langSubText');
    const autofillTextEl = document.getElementById('btnLangAutofillText');
    const barEl = document.getElementById('langStatusBar');

    if (barEl) barEl.classList.toggle('en-mode', isEn);
    if (badgeEl) {
        badgeEl.className = isEn ? 'indicator-badge en' : 'indicator-badge ar';
        badgeEl.textContent = isEn ? '🇬🇧 Editing Mode: English (EN)' : '🇸🇦 وضع التحرير: اللغة العربية (AR)';
    }
    if (subTextEl) {
        subTextEl.textContent = isEn 
            ? 'Currently editing and saving website content for the English version.'
            : 'يتم الآن تعديل وحفظ نصوص الموقع المخصصة للنسخة العربية.';
    }
    if (autofillTextEl) {
        autofillTextEl.textContent = isEn 
            ? 'Auto-Fill Approved English Template'
            : 'استعادة النموذج العربي المعتمد';
    }

    // 6. Update Active Tab Breadcrumb
    const activeNavTab = document.querySelector('.sidebar-nav .nav-item.active span');
    const breadcrumb = document.getElementById('currentTabBreadcrumb');
    if (activeNavTab && breadcrumb) {
        breadcrumb.textContent = activeNavTab.textContent;
    }

    // 7. Persist admin UI language in localStorage
    localStorage.setItem('sana_admin_lang', lang);
}

// Export functions to window
if (typeof window !== 'undefined') {
    window.ADMIN_I18N_MAP = ADMIN_I18N_MAP;
    window.applyAdminLanguage = applyAdminLanguage;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ADMIN_I18N_MAP,
        ADMIN_I18N_REVERSE,
        applyAdminLanguage
    };
}
