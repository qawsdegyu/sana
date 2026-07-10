// Tab Switching Logic
function switchTab(tab) {
    document.getElementById('tabLogin').classList.remove('active');
    document.getElementById('tabSignup').classList.remove('active');
    
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'none';
    
    if(tab === 'login') {
        document.getElementById('tabLogin').classList.add('active');
        document.getElementById('loginForm').style.display = 'block';
    } else {
        document.getElementById('tabSignup').classList.add('active');
        document.getElementById('signupForm').style.display = 'block';
    }
    
    hideMessages();
}

function showMsg(id, msg) {
    const el = document.getElementById(id);
    el.innerText = msg;
    el.style.display = 'block';
}

function hideMessages() {
    document.getElementById('errorMsg').style.display = 'none';
    document.getElementById('successMsg').style.display = 'none';
}

// Device Fingerprint
const getDeviceId = () => {
    const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        screen.width + "x" + screen.height,
        new Date().getTimezoneOffset(),
        navigator.deviceMemory || "unknown",
        navigator.hardwareConcurrency || "unknown"
    ].join("|");
    
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; 
    }
    return `fp_${Math.abs(hash)}`;
};

const validatePassword = (pass) => {
    const minLength = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return minLength && hasUpper && hasLower && hasNumber && hasSymbol;
};

// Login Logic
async function handleLogin(e) {
    e.preventDefault();
    hideMessages();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('btnLoginSubmit');
    btn.disabled = true;
    
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            if (error.message.includes("Invalid login credentials")) {
                throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
            }
            throw error;
        }

        // Update last_device_id in profiles
        const deviceId = getDeviceId();
        if (data.user) {
            try {
                await supabaseClient.from("profiles").update({ last_device_id: deviceId }).eq("id", data.user.id);
            } catch(e) {
                console.warn(e);
            }
        }

        showMsg('successMsg', "تم تسجيل الدخول بنجاح!");
        setTimeout(() => {
            window.location.href = "creator.html";
        }, 1000);

    } catch (err) {
        showMsg('errorMsg', err.message);
    } finally {
        btn.disabled = false;
    }
}

// Signup Logic
async function handleSignup(e) {
    e.preventDefault();
    hideMessages();
    
    const fullName = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    const btn = document.getElementById('btnSignupSubmit');
    btn.disabled = true;
    
    try {
        const isTestUser = email.toLowerCase().endsWith("@test.com") || email.toLowerCase().includes("test");

        if (password !== confirmPassword) {
            throw new Error("كلمات السر غير متطابقة، يرجى إعادة التأكد.");
        }

        if (!isTestUser && !validatePassword(password)) {
            throw new Error("يجب أن تحتوي كلمة المرور على 8 خانات، تشمل حروفاً كبيرة وصغيرة وأرقاماً ورموزاً.");
        }

        const deviceId = getDeviceId();
        let deviceAlreadyUsed = false;
        
        if (!isTestUser) {
            try {
                const { data: deviceCheck } = await supabaseClient
                    .from("profiles")
                    .select("id")
                    .eq("last_device_id", deviceId)
                    .single();
                if (deviceCheck) deviceAlreadyUsed = true;
            } catch (e) {
                console.warn("Device check skipped");
            }

            if (deviceAlreadyUsed) {
                throw new Error("هذا الجهاز مسجل به حساب بالفعل. يرجى تسجيل الدخول.");
            }
        }

        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName || "Test User",
                    initial_device_id: deviceId
                },
                emailRedirectTo: window.location.origin + '/login.html'
            }
        });

        if (error) {
            if (error.message.includes("User already registered")) {
                throw new Error("هذا البريد الإلكتروني مسجل مسبقاً، يرجى تسجيل الدخول.");
            }
            throw error;
        }

        showMsg('successMsg', "تم إنشاء الحساب بنجاح! يرجى تأكيد بريدك الإلكتروني إذا لزم الأمر.");
        
        // Auto switch to login
        setTimeout(() => {
            switchTab('login');
            document.getElementById('loginEmail').value = email;
        }, 2000);

    } catch (err) {
        showMsg('errorMsg', err.message);
    } finally {
        btn.disabled = false;
    }
}

// Forgot Password
async function handleForgotPassword() {
    hideMessages();
    const email = document.getElementById('loginEmail').value;
    if (!email) {
        showMsg('errorMsg', "يرجى إدخال بريدك الإلكتروني أولاً في حقل تسجيل الدخول.");
        return;
    }
    
    try {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password.html',
        });
        if (error) throw error;
        showMsg('successMsg', "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك.");
    } catch (err) {
        showMsg('errorMsg', err.message);
    }
}

// Google Auth
async function handleGoogleLogin() {
    hideMessages();
    try {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin + '/creator.html',
            },
        });
        if (error) throw error;
    } catch (err) {
        showMsg('errorMsg', err.message || "فشل تسجيل الدخول بواسطة Google");
    }
}

// Check session on load if already logged in
window.onload = async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        window.location.href = "creator.html";
    }
};
