/**
 * app.js - Unified Application Entry Point
 * 
 * This script is loaded on every page and orchestrates:
 * 1. Navbar rendering (via components/navbar.js, loaded before this)
 * 2. Supabase initialization (via supabase.js, loaded before this)
 * 3. Auth state management (via auth-state.js)
 * 4. Translation system initialization (via translations.js + lang.js)
 * 
 * Script loading order in HTML should be:
 *   supabase CDN -> supabase.js -> components/navbar.js -> app.js
 *   -> translations.js -> lang.js -> [page-specific scripts]
 * 
 * Note: This file intentionally does not contain the logic of its
 * dependencies. It serves as the glue and initialization coordinator.
 */

// Auth state check runs automatically via auth-state.js
// Lang system runs automatically via lang.js DOMContentLoaded
// Navbar is rendered synchronously by components/navbar.js

// No additional initialization needed here at this time.
// This file exists as the future entry point for shared app-level
// logic (e.g., global error handling, analytics, service workers).
