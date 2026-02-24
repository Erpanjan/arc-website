document.addEventListener('DOMContentLoaded', () => {
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
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 120,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. AI Interaction Logic (Typewriter Effect)
    initAIInteraction();

    // 4. Telemetry Pulse Logic
    initTelemetry();
});

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
        { id: 'tile-markets', label: 'Financial Markets', normal: 'Tracking', updates: ['Volatility Spike', 'Bull Run', 'Market Flat', 'Tracking'] },
        { id: 'tile-protection', label: 'Protection Pulse', normal: 'Secure', updates: ['Policy Review', 'Synced', 'Encrypted', 'Secure'] },
        { id: 'tile-life', label: 'Life Circumstances', normal: 'Synced', updates: ['Update Detected', 'Planning', 'Locked', 'Synced'] },
        { id: 'tile-health', label: 'Personal Health', normal: 'Live', updates: ['Vitals High', 'Rested', 'Optimized', 'Live'] },
        { id: 'tile-cashflow', label: 'Cashflow Health', normal: 'Balanced', updates: ['Surplus', 'Budget Alert', 'Stable', 'Balanced'] }
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
