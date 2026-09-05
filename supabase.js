// تهيئة Supabase مع دعم التحديث من لوحة التحكم أو القيم الافتراضية
const SAVED_URL = typeof localStorage !== 'undefined' ? localStorage.getItem('sana_supabase_url') : null;
const SAVED_KEY = typeof localStorage !== 'undefined' ? localStorage.getItem('sana_supabase_key') : null;

const SUPABASE_URL = SAVED_URL || 'https://kpzuyjtjixiwgheucudi.supabase.co';
const SUPABASE_ANON_KEY = SAVED_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwenV5anRqaXhpd2doZXVjdWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MTM2NDYsImV4cCI6MjEwMzk4OTY0Nn0.xnnDn4U7eVimq3BoE4slmQW41BdGfGvLAs_wTbocawQ';

let supabaseClient = null;
if (typeof window !== 'undefined' && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
