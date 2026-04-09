const COMPONENTS = [
    'nav',
    'hero',
    'interact',
    'solution',
    'monitoring',
    'accessibility',
    'cta-footer'
];

document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    initHeroSeamlessBackground();
    handleDeepLink();

    // 1. Initialize Intersection Observer for reveals
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 2. Handle smooth internal scrolling
    // Determine if we are on the main index page
    const currentPath = window.location.pathname;
    const isIndexPage = currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('/');

    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Extract the hash part
            const hashIndex = href.indexOf('#');
            if (hashIndex === -1) return;
            const targetId = href.substring(hashIndex);
            if (!targetId || targetId === '#') return;

            // Check if link points to a different page (e.g. "index.html#architecture")
            const pagePart = href.substring(0, hashIndex);
            if (pagePart && !isIndexPage) {
                // We are on a subpage (privacy, terms) and the link points to index.html
                // Let the browser handle this navigation natively — do NOT intercept
                return;
            }

            // We are on the index page, so smooth scroll to the target section
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                // Support explicit "back to top/hero" behavior
                if (targetId === '#hero') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return;
                }

                // Activate reveals immediately for target and its children
                targetElement.classList.add('active');
                targetElement.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));

                const rect = targetElement.getBoundingClientRect();
                const targetTop = window.pageYOffset + rect.top - 120;

                window.scrollTo({
                    top: Math.max(targetTop, 0),
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. AI Interaction Logic (Typewriter Effect)
    initAIInteraction();

    // 4. Telemetry Pulse Logic
    initTelemetry();

    // 5. Page Flip Transition to Early Access
    initFlipTransition();
});

async function loadComponents() {
    const mounts = COMPONENTS
        .map(name => ({
            name,
            mount: document.querySelector(`[data-component="${name}"]`)
        }))
        .filter(entry => entry.mount);

    await Promise.all(mounts.map(async ({ name, mount }) => {
        const response = await fetch(`components/${name}.html?v=20260224`, {
            cache: 'no-store'
        });
        if (!response.ok) {
            throw new Error(`Failed to load component: ${name}`);
        }
        mount.innerHTML = await response.text();
    }));
}

function handleDeepLink() {
    const hash = window.location.hash;
    if (hash && hash !== '#') {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
            // Force activation of reveal animations for target section
            targetElement.classList.add('active');
            targetElement.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));

            // Larger delay for deep links to allow layout to settle after async injections
            setTimeout(() => {
                const rect = targetElement.getBoundingClientRect();
                const targetTop = window.pageYOffset + rect.top - 120;
                window.scrollTo({
                    top: Math.max(targetTop, 0),
                    behavior: 'smooth'
                });
            }, 350);
        }
    }
}

function initAIInteraction() {
    const questions = [
        "How is your wealth currently divided up?",
        "What big life events are you planning for next?",
        "Are you saving for anything specific right now?",
        "When do you plan to fully step away from work?",
        "How would you rate your risk tolerance today?",
        "Is your family protection plan up to date?"
    ];

    let questionIndex = 0;
    const textElement = document.getElementById('typing-text');
    if (!textElement) return;

    // Set initial text
    textElement.textContent = `"${questions[0]}"`;

    setInterval(() => {
        textElement.style.opacity = 0;
        setTimeout(() => {
            questionIndex = (questionIndex + 1) % questions.length;
            textElement.textContent = `"${questions[questionIndex]}"`;
            textElement.style.opacity = 1;
        }, 500);
    }, 2000);
}

function initTelemetry() {
    const tiles = [
        { id: 'tile-markets', normal: 'Tracking', updates: ['Volatility Spike', 'Bull Run', 'Market Flat', 'Tracking'] },
        { id: 'tile-protection', normal: 'Secure', updates: ['Policy Review', 'Synced', 'Encrypted', 'Secure'] },
        { id: 'tile-life', normal: 'Synced', updates: ['Update Detected', 'Planning', 'Locked', 'Synced'] },
        { id: 'tile-health', normal: 'Live', updates: ['Vitals High', 'Rested', 'Optimized', 'Live'] },
        { id: 'tile-cashflow', normal: 'Balanced', updates: ['Surplus', 'Budget Alert', 'Stable', 'Balanced'] }
    ];

    setInterval(() => {
        // Pick a random tile to "pulse" or update
        const tileData = tiles[Math.floor(Math.random() * tiles.length)];
        const tile = document.getElementById(tileData.id);
        if (!tile) return;

        const statusText = tile.querySelector('.status-text');
        const isNormal = statusText.textContent === tileData.normal;

        if (isNormal) {
            // "Active" update
            const randomUpdate = tileData.updates[Math.floor(Math.random() * (tileData.updates.length - 1))];
            statusText.textContent = randomUpdate;

            // If it's a "warning" type update (just for visual flair)
            if (randomUpdate.includes('Spike') || randomUpdate.includes('Alert')) {
                tile.classList.add('warning');
            }
        } else {
            // Reset to normal
            statusText.textContent = tileData.normal;
            tile.classList.remove('warning');
        }
    }, 4000);
}

function initHeroSeamlessBackground() {
    const videos = Array.from(document.querySelectorAll('.hero-bg-video'));
    if (videos.length < 2) return;

    let activeIndex = 0;
    let switching = false;
    const crossfadeMs = 700;
    const switchLeadSeconds = 0.9;
    const nextStartOffsetSeconds = 0.08;

    videos.forEach((video, index) => {
        video.muted = true;
        video.playsInline = true;
        if (index !== activeIndex) {
            video.pause();
            video.currentTime = 0;
            video.classList.remove('is-active');
        } else {
            video.classList.add('is-active');
            void video.play().catch(() => { });
        }
    });

    const activeVideo = () => videos[activeIndex];
    const standbyVideo = () => videos[(activeIndex + 1) % videos.length];

    const switchVideo = async () => {
        if (switching) return;
        switching = true;

        const current = activeVideo();
        const next = standbyVideo();

        try {
            next.currentTime = nextStartOffsetSeconds;
            await next.play();
        } catch (_) {
            switching = false;
            return;
        }

        next.classList.add('is-active');
        current.classList.remove('is-active');

        setTimeout(() => {
            current.pause();
            current.currentTime = 0;
            activeIndex = (activeIndex + 1) % videos.length;
            switching = false;
        }, crossfadeMs + 40);
    };

    const tick = () => {
        const current = activeVideo();
        if (!current.duration || Number.isNaN(current.duration)) return;

        if (current.duration - current.currentTime <= switchLeadSeconds) {
            void switchVideo();
        }
    };

    videos.forEach((video) => {
        video.addEventListener('timeupdate', tick);
        video.addEventListener('ended', () => {
            void switchVideo();
        });
    });
}

function initFlipTransition() {
    const overlay = document.createElement('div');
    overlay.className = 'page-flip-overlay';
    document.body.appendChild(overlay);

    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href') && link.getAttribute('href').includes('early-access.html')) {
            e.preventDefault();
            overlay.classList.add('is-flipping');

            // Wait for animation to finish before navigating
            setTimeout(() => {
                window.location.href = link.getAttribute('href');
            }, 750);
        }
    });

    // Reset overlay in case the user navigates back to this page
    window.addEventListener('pageshow', (e) => {
        if (e.persisted || overlay.classList.contains('is-flipping')) {
            // briefly disable transition for instant reset
            overlay.style.transition = 'none';
            overlay.classList.remove('is-flipping');
            setTimeout(() => {
                overlay.style.transition = '';
            }, 50);
        }
    });
}
