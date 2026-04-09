/**
 * ARC Website — Main Application Script
 * Handles component loading, navigation, scroll reveals, and interactive elements.
 */

// ─── Configuration ──────────────────────────────────────────────────────────
const COMPONENTS = [
    'nav',
    'hero',
    'interact',
    'solution',
    'monitoring',
    'accessibility',
    'cta-footer'
];

const COMPONENT_VERSION = '20260409';
const NAV_OFFSET = 120; // px offset from top when scrolling to sections

// ─── Boot ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    handleDeepLink();
    initRevealObserver();
    initSmoothScrolling();
    initAIInteraction();
    initTelemetry();
    initFadeTransition();
});

// ─── Component Loader ───────────────────────────────────────────────────────
// Fetches and injects HTML partials into matching [data-component] mount points.
// Components without a mount point on the current page are silently skipped.
async function loadComponents() {
    const mounts = COMPONENTS
        .map(name => ({
            name,
            mount: document.querySelector(`[data-component="${name}"]`)
        }))
        .filter(entry => entry.mount);

    await Promise.all(mounts.map(async ({ name, mount }) => {
        const response = await fetch(`components/${name}.html?v=${COMPONENT_VERSION}`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            console.warn(`[ARC] Failed to load component: ${name}`);
            return;
        }
        mount.innerHTML = await response.text();
    }));
}

// ─── Deep Link Handler ──────────────────────────────────────────────────────
// When index.html loads with a hash (e.g. from a subpage nav link), scroll to
// the target section after components have been injected into the DOM.
function handleDeepLink() {
    const hash = window.location.hash;
    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);
    if (!target) return;

    // Force-reveal the target so it's visible before scrolling
    activateReveals(target);

    // Allow layout to settle after async component injection
    setTimeout(() => scrollToElement(target), 350);
}

// ─── Scroll Reveal (Intersection Observer) ──────────────────────────────────
// Elements with class "reveal" fade in when they enter the viewport.
function initRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ─── Smooth Scrolling ───────────────────────────────────────────────────────
// On the index page: intercepts anchor clicks for smooth in-page scrolling.
// On subpages (privacy, terms): lets the browser navigate natively to index.html.
function initSmoothScrolling() {
    const path = window.location.pathname;
    const isIndexPage = path === '/' || path.endsWith('/index.html');

    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const hashIndex = href.indexOf('#');
            if (hashIndex === -1) return;

            const targetId = href.substring(hashIndex);
            if (!targetId || targetId === '#') return;

            // On subpages, don't intercept cross-page links — let the browser navigate
            const pagePart = href.substring(0, hashIndex);
            if (pagePart && !isIndexPage) return;

            // On the index page, smooth scroll to the target section
            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            if (targetId === '#hero') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            activateReveals(target);
            scrollToElement(target);
        });
    });
}

// ─── AI Interaction (Question Rotator) ──────────────────────────────────────
// Cycles through AI consultation questions with a fade-in/out animation.
function initAIInteraction() {
    const questions = [
        "How is your wealth currently divided up?",
        "What big life events are you planning for next?",
        "Are you saving for anything specific right now?",
        "When do you plan to fully step away from work?",
        "How would you rate your risk tolerance today?",
        "Is your family protection plan up to date?"
    ];

    const el = document.getElementById('typing-text');
    if (!el) return;

    let index = 0;
    el.textContent = `"${questions[0]}"`;

    setInterval(() => {
        el.style.opacity = 0;
        setTimeout(() => {
            index = (index + 1) % questions.length;
            el.textContent = `"${questions[index]}"`;
            el.style.opacity = 1;
        }, 500);
    }, 2000);
}

// ─── Telemetry Pulse (Monitoring Tiles) ─────────────────────────────────────
// Simulates live status updates on the monitoring dashboard tiles.
function initTelemetry() {
    const tiles = [
        { id: 'tile-markets',    normal: 'Tracking', updates: ['Volatility Spike', 'Bull Run', 'Market Flat'] },
        { id: 'tile-protection', normal: 'Secure',   updates: ['Policy Review', 'Synced', 'Encrypted'] },
        { id: 'tile-life',      normal: 'Synced',    updates: ['Update Detected', 'Planning', 'Locked'] },
        { id: 'tile-health',    normal: 'Live',      updates: ['Vitals High', 'Rested', 'Optimized'] },
        { id: 'tile-cashflow',  normal: 'Balanced',  updates: ['Surplus', 'Budget Alert', 'Stable'] }
    ];

    setInterval(() => {
        const tileData = tiles[Math.floor(Math.random() * tiles.length)];
        const tile = document.getElementById(tileData.id);
        if (!tile) return;

        const statusText = tile.querySelector('.status-text');
        if (!statusText) return;

        if (statusText.textContent === tileData.normal) {
            // Show a random status update
            const update = tileData.updates[Math.floor(Math.random() * tileData.updates.length)];
            statusText.textContent = update;

            // Visual warning for critical updates
            if (update.includes('Spike') || update.includes('Alert')) {
                tile.classList.add('warning');
            }
        } else {
            // Reset to normal
            statusText.textContent = tileData.normal;
            tile.classList.remove('warning');
        }
    }, 4000);
}

// ─── Page Fade Transition ───────────────────────────────────────────────────
// Animated fade overlay when navigating to the Early Access form.
function initFadeTransition() {
    const overlay = document.createElement('div');
    overlay.className = 'fade-transition-overlay';
    document.body.appendChild(overlay);

    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (href && href.includes('early-access.html')) {
            e.preventDefault();
            overlay.classList.add('is-visible');
            setTimeout(() => { window.location.href = href; }, 500);
        }
    });

    // Reset overlay when returning via back/forward cache
    window.addEventListener('pageshow', (e) => {
        if (e.persisted || overlay.classList.contains('is-visible')) {
            overlay.style.transition = 'none';
            overlay.classList.remove('is-visible');
            setTimeout(() => { overlay.style.transition = ''; }, 50);
        }
    });
}

// ─── Utility Functions ──────────────────────────────────────────────────────

// Force-activates reveal animations on a target element and its children.
function activateReveals(element) {
    element.classList.add('active');
    element.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
}

// Scrolls smoothly to a target element with the configured nav offset.
function scrollToElement(element) {
    const rect = element.getBoundingClientRect();
    const top = window.pageYOffset + rect.top - NAV_OFFSET;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
}
