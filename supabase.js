// تهيئة Supabase
// يرجى استبدال هذه القيم بالمفاتيح الخاصة بمشروعك في Supabase

const SUPABASE_URL = 'https://faovafodbyauohwremth.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhb3ZhZm9kYnlhdW9od3JlbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNTU4ODEsImV4cCI6MjA5ODgzMTg4MX0.p8QvMw3jj_Nx3VdJ-0WZFRg7CGnA8dI-ZJYyI8M4qh4';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
