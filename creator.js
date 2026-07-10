document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const quickActions = document.getElementById('quickActions');
    const apiKeyInput = document.getElementById('apiKey');
    
    let chatHistory = [];
    let isFirstMessage = true;
    let currentSystemContext = ""; // stores the latest system generated to context quizzes
    
    let currentLang = localStorage.getItem('sana_lang') || 'ar';
    
    // Chat History State
    let userId = null;
    let currentSessionId = null;
    let sessionsList = [];
    const historyList = document.getElementById('historyList');
    const newChatBtn = document.getElementById('newChatBtn');

    // Initialize Auth and Load History
    (async function initMemory() {
        if (typeof supabaseClient !== 'undefined') {
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                userId = session.user.id;
                await loadChatSessions();
            }
        }
    })();
    
    const uiStrings = {
        ar: {
            placeholder: 'اكتب فكرتك أو اسألني أي سؤال...',
            quizText: 'اختبرني (امتحان ضع دائرة) في النظام الذي ابتكرته للتو.',
            imageText: 'هل يمكنك إنشاء صورة توضيحية أخرى لهذا النظام تظهر زاوية مختلفة أو استخداماً آخر؟',
            explainText: 'أشعر أن الموضوع معقد قليلاً، هل يمكنك شرحه لي بطريقة أبسط مع أمثلة من حياتي اليومية؟',
            welcomeTitle: 'كيف يمكنني مساعدتك اليوم؟',
            welcomeSub: 'أنا المبتكر الذكي، يمكنني اختراع أنظمة وعوالم جديدة كلياً، ومناقشتها معك، وتصميم امتحانات لتقييم فهمك.',
            btnQuiz: '📝 اختبرني (امتحان ضع دائرة)',
            btnImage: '🖼️ توليد صورة أخرى للنظام',
            btnExplain: '🤔 اشرح لي المزيد بتفصيل أبسط',
            systemPrompt: `أنت المبتكر الذكي، ذكاء اصطناعي عبقري ومبدع جداً هدفه اختراع أنظمة وأشياء جديدة كلياً وغير موجودة في عالمنا الحالي.
            القواعد:
            1. يجب أن ترد دائماً بصيغة JSON حصرية، وباللغة العربية.
            2. الهيكل المطلوب:
            {
              "is_quiz": boolean,
              "response": "نص الرد بتنسيق Markdown إذا كان is_quiz = false",
              "image_prompt": "وصف بالانجليزية لتوليد صورة (أو null)",
              "questions": [
                 {
                   "questionText": "السؤال",
                   "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"],
                   "correctIndex": 0,
                   "explanation": "سبب الإجابة الصحيحة"
                 }
              ]
            }`
        },
        en: {
            placeholder: 'Write your idea or ask me anything...',
            quizText: 'Test me (multiple choice quiz) on the system you just invented.',
            imageText: 'Can you generate another illustration for this system showing a different angle or use case?',
            explainText: 'I feel this is a bit complex, can you explain it simpler with everyday examples?',
            welcomeTitle: 'How can I help you today?',
            welcomeSub: 'I am the Smart Creator. I can invent entirely new systems and worlds, discuss them with you, and design quizzes to test your understanding.',
            btnQuiz: '📝 Test me (Multiple Choice)',
            btnImage: '🖼️ Generate another image',
            btnExplain: '🤔 Explain simpler',
            systemPrompt: `You are the Smart Creator, a genius AI whose goal is to invent entirely new systems and things that don't exist in our current world.
            Rules:
            1. You MUST always respond exclusively in JSON format, and in English.
            2. Required structure:
            {
              "is_quiz": boolean, // true if user asks for a quiz/questions
              "response": "Markdown formatted response if is_quiz = false",
              "image_prompt": "English description to generate an image (or null)",
              "questions": [ // filled only if is_quiz = true
                 {
                   "questionText": "Question",
                   "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                   "correctIndex": 0, // 0 to 3
                   "explanation": "Reason for correct answer"
                 }
              ]
            }`
        }
    };
    
    function updateLanguage() {
        const str = uiStrings[currentLang];
        // Only update if elements exist and weren't overwritten by chat
        if(document.querySelector('#welcomeScreen h1')) {
            document.querySelector('#welcomeScreen h1').textContent = str.welcomeTitle;
            document.querySelector('#welcomeScreen p').textContent = str.welcomeSub;
        }
        
        const qBtns = document.querySelectorAll('.btn-quick');
        if(qBtns.length >= 3) {
            qBtns[0].textContent = str.btnQuiz;
            qBtns[1].textContent = str.btnImage;
            qBtns[2].textContent = str.btnExplain;
        }
        
        if (chatHistory.length > 0) {
            chatHistory[0] = { role: 'system', content: str.systemPrompt };
        }
    }
    
    window.addEventListener('languageChanged', (e) => {
        currentLang = e.detail.lang;
        updateLanguage();
    });
    
    // Initialize system prompt
    chatHistory.push({ role: 'system', content: uiStrings[currentLang].systemPrompt });
    
    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = '60px';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value.trim() === '') {
            chatSendBtn.disabled = true;
        } else {
            chatSendBtn.disabled = false;
        }
    });
    chatInput.dispatchEvent(new Event('input'));
    
    // Handle Enter key to send
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!chatSendBtn.disabled) chatSendBtn.click();
        }
    });
    
    // Domain cards (suggestions)
    document.querySelectorAll('.domain-card').forEach(card => {
        card.addEventListener('click', () => {
            const promptAr = card.dataset.prompt;
            // Simple english fallback for predefined cards
            const promptEn = promptAr.includes('ميكانيكي') ? 'Invent a completely new mechanical device' :
                             promptAr.includes('تواصل') ? 'Invent a new communication language that doesn\'t use sound' :
                             promptAr.includes('أرقام') ? 'Invent a new number and math system' :
                             'Invent a completely different economic system';
            sendMessage(currentLang === 'ar' ? promptAr : promptEn);
        });
    });
    
    // Quick Actions
    document.querySelectorAll('.btn-quick').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const str = uiStrings[currentLang];
            if (index === 0) sendMessage(str.quizText);
            if (index === 1) sendMessage(str.imageText);
            if (index === 2) sendMessage(str.explainText);
        });
    });
    
    async function callOpenRouterAPI(messages) {
        // Fetch from our secure Vercel Serverless Function
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/gpt-4o-mini',
                response_format: { type: "json_object" },
                messages: messages
            })
        });
        
        if (!response.ok) {
            let errorMsg = 'حدث خطأ في الاتصال.';
            try {
                const error = await response.json();
                errorMsg = error.detailed_error || error.error?.message || error.error || errorMsg;
            } catch(e) {}
            throw new Error(errorMsg);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    chatSendBtn.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if (text) sendMessage(text);
    });
    
    async function sendMessage(text) {
        if (isFirstMessage) {
            welcomeScreen.style.display = 'none';
            isFirstMessage = false;
        }
        
        appendUserMessage(text);
        chatInput.value = '';
        chatInput.style.height = '60px';
        chatSendBtn.disabled = true;
        quickActions.style.display = 'none'; // hide until AI replies
        
        chatHistory.push({ role: 'user', content: text });
        
        const loadingId = showLoading();
        
        try {
            const responseStr = await callOpenRouterAPI(chatHistory);
            const responseJson = JSON.parse(responseStr);
            
            chatHistory.push({ role: 'assistant', content: responseStr });
            removeLoading(loadingId);
            
            if (responseJson.is_quiz && responseJson.questions && responseJson.questions.length > 0) {
                renderQuizMessage(responseJson.questions);
            } else {
                appendAIMessage(responseJson.response, responseJson.image_prompt);
                currentSystemContext = responseJson.response; // Update context
            }
            
            quickActions.style.display = 'flex'; // show quick actions again
            
            // Save to Database
            if (userId && typeof supabaseClient !== 'undefined') {
                try {
                    if (!currentSessionId) {
                        // Create new session
                        let titleText = chatHistory[1].content.substring(0, 30);
                        if (chatHistory[1].content.length > 30) titleText += '...';
                        
                        const { data, error } = await supabaseClient.from('chat_sessions').insert({
                            user_id: userId,
                            title: titleText,
                            messages: chatHistory
                        }).select().single();
                        
                        if (data && !error) {
                            currentSessionId = data.id;
                            await loadChatSessions();
                        }
                    } else {
                        // Update existing session
                        await supabaseClient.from('chat_sessions').update({
                            messages: chatHistory,
                            updated_at: new Date()
                        }).eq('id', currentSessionId);
                    }
                } catch (dbErr) {
                    console.error("Error saving chat:", dbErr);
                }
            }
            
        } catch (error) {
            removeLoading(loadingId);
            appendAIMessage('عذراً، واجهت مشكلة: ' + error.message, null);
            chatHistory.pop(); // remove user message so they can try again
        }
    }
    
    function appendUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'message user';
        div.innerHTML = `<div class="message-content">${text.replace(/\n/g, '<br>')}</div>`;
        chatMessages.appendChild(div);
        scrollToBottom();
    }
    
    function appendAIMessage(text, imagePrompt) {
        const div = document.createElement('div');
        div.className = 'message ai';
        
        let html = marked.parse(text || "");
        
        if (imagePrompt && typeof imagePrompt === 'string' && imagePrompt.trim() !== '') {
            const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=800&height=400&nologo=true`;
            html += `<img src="${imgUrl}" alt="صورة تم توليدها بالذكاء الاصطناعي">`;
        }
        
        div.innerHTML = `<div class="message-content">${html}</div>`;
        chatMessages.appendChild(div);
        scrollToBottom();
    }
    
    function renderQuizMessage(questions) {
        const div = document.createElement('div');
        div.className = 'message ai';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content quiz-container';
        
        const title = document.createElement('h3');
        title.textContent = 'امتحان قصير لتقييم فهمك:';
        title.style.marginBottom = '20px';
        contentDiv.appendChild(title);
        
        questions.forEach((q, qIndex) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'quiz-question';
            
            const qText = document.createElement('strong');
            qText.textContent = `${qIndex + 1}. ${q.questionText}`;
            qText.style.display = 'block';
            qText.style.marginBottom = '10px';
            qDiv.appendChild(qText);
            
            const expDiv = document.createElement('div');
            expDiv.className = 'quiz-explanation';
            expDiv.innerHTML = `<strong>السبب:</strong> ${q.explanation}`;
            
            let isAnswered = false;
            
            q.options.forEach((optText, optIndex) => {
                const optLabel = document.createElement('label');
                optLabel.className = 'quiz-option';
                
                const optInput = document.createElement('input');
                optInput.type = 'radio';
                optInput.name = `quiz_q_${Date.now()}_${qIndex}`;
                optInput.style.display = 'none'; // hide radio, we use CSS for the box
                
                optLabel.addEventListener('click', () => {
                    if (isAnswered) return;
                    isAnswered = true;
                    
                    if (optIndex === q.correctIndex) {
                        optLabel.classList.add('correct');
                    } else {
                        optLabel.classList.add('wrong');
                        // Highlight correct one
                        const correctLabel = qDiv.querySelectorAll('.quiz-option')[q.correctIndex];
                        correctLabel.classList.add('correct');
                    }
                    expDiv.style.display = 'block';
                });
                
                optLabel.appendChild(optInput);
                optLabel.appendChild(document.createTextNode(optText));
                qDiv.appendChild(optLabel);
            });
            
            qDiv.appendChild(expDiv);
            contentDiv.appendChild(qDiv);
        });
        
        div.appendChild(contentDiv);
        chatMessages.appendChild(div);
        scrollToBottom();
    }
    
    function showLoading() {
        const id = 'loading-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'message ai';
        div.innerHTML = `<div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>`;
        chatMessages.appendChild(div);
        scrollToBottom();
        return id;
    }
    
    function removeLoading(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Chat History Functions
    async function loadChatSessions() {
        if (!userId || typeof supabaseClient === 'undefined') return;
        
        try {
            const { data, error } = await supabaseClient
                .from('chat_sessions')
                .select('id, title, messages')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });
                
            if (data && !error) {
                sessionsList = data;
                renderSidebar();
            }
        } catch (e) {
            console.error("Error loading sessions", e);
        }
    }
    
    function renderSidebar() {
        if (!historyList) return;
        historyList.innerHTML = '';
        
        sessionsList.forEach(session => {
            const btn = document.createElement('button');
            btn.className = 'history-item';
            if (session.id === currentSessionId) {
                btn.classList.add('active');
            }
            btn.textContent = session.title;
            
            btn.addEventListener('click', () => loadSession(session));
            historyList.appendChild(btn);
        });
    }
    
    function loadSession(session) {
        currentSessionId = session.id;
        chatHistory = session.messages || [];
        isFirstMessage = false;
        
        // Ensure system prompt exists
        if (chatHistory.length === 0 || chatHistory[0].role !== 'system') {
            chatHistory.unshift({ role: 'system', content: uiStrings[currentLang].systemPrompt });
        } else {
            chatHistory[0].content = uiStrings[currentLang].systemPrompt; // update to current lang
        }
        
        // Update UI
        welcomeScreen.style.display = 'none';
        
        // Clear all except welcome screen
        Array.from(chatMessages.children).forEach(child => {
            if (child.id !== 'welcomeScreen') child.remove();
        });
        
        // Re-render messages
        for (let i = 1; i < chatHistory.length; i++) {
            const msg = chatHistory[i];
            if (msg.role === 'user') {
                appendUserMessage(msg.content);
            } else if (msg.role === 'assistant') {
                try {
                    const parsed = JSON.parse(msg.content);
                    if (parsed.is_quiz) {
                        renderQuizMessage(parsed.questions);
                    } else {
                        appendAIMessage(parsed.response, parsed.image_prompt);
                    }
                } catch(e) {
                    appendAIMessage(msg.content, null); // fallback if parsing fails
                }
            }
        }
        
        renderSidebar(); // Update active state
    }
    
    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            currentSessionId = null;
            chatHistory = [{ role: 'system', content: uiStrings[currentLang].systemPrompt }];
            isFirstMessage = true;
            
            // Clear UI
            Array.from(chatMessages.children).forEach(child => {
                if (child.id !== 'welcomeScreen') child.remove();
            });
            welcomeScreen.style.display = 'flex';
            renderSidebar();
        });
    }
});
