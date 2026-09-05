// تهيئة Supabase مع دعم التحديث من لوحة التحكم أو القيم الافتراضية
const SAVED_URL = typeof localStorage !== 'undefined' ? localStorage.getItem('sana_supabase_url') : null;
const SAVED_KEY = typeof localStorage !== 'undefined' ? localStorage.getItem('sana_supabase_key') : null;

const SUPABASE_URL = SAVED_URL || 'https://faovafodbyauohwremth.supabase.co';
const SUPABASE_ANON_KEY = SAVED_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhb3ZhZm9kYnlhdW9od3JlbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNTU4ODEsImV4cCI6MjA5ODgzMTg4MX0.p8QvMw3jj_Nx3VdJ-0WZFRg7CGnA8dI-ZJYyI8M4qh4';

let supabaseClient = null;
if (typeof window !== 'undefined' && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
