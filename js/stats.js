const parallaxSection = document.querySelector('.stats');
const cards = document.querySelectorAll('.stat-card');
const watermark = document.querySelector('.stats__watermark');

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}


/* ==========================================
   CHECK MOBILE
========================================== */

function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
}


/* ==========================================
   RESET PARALLAX
========================================== */

function resetParallax() {

    cards.forEach((card) => {
        card.style.transform = 'none';
    });

    if (watermark) {
        watermark.style.transform = 'none';
    }
}


/* ==========================================
   UPDATE PARALLAX
========================================== */

function updateParallax() {

    if (!parallaxSection || cards.length === 0) {
        return;
    }


    /* --------------------------------------
       MOBILE
       Completely disable animation
    -------------------------------------- */

    if (isMobile()) {
        resetParallax();
        return;
    }


    /* --------------------------------------
       DESKTOP
       Parallax enabled
    -------------------------------------- */

    if (!watermark) {
        return;
    }

    const rect = parallaxSection.getBoundingClientRect();

    const viewportCenter = window.innerHeight / 2;

    const sectionCenter =
        rect.top + rect.height / 2;

    const distance =
        viewportCenter - sectionCenter;

    const totalTravel =
        Math.max(rect.height * 0.72, 1);

    const progress =
        clamp(
            distance / totalTravel,
            -1,
            1
        );


    /* --------------------------------------
       RESET WHEN OUTSIDE VIEW
    -------------------------------------- */

    if (
        rect.bottom < -120 ||
        rect.top > window.innerHeight + 120
    ) {
        resetParallax();
        return;
    }


    /* --------------------------------------
       CARD PARALLAX
    -------------------------------------- */

    cards.forEach((card) => {

        const speed =
            Number(card.dataset.speed) || 0;

        const offset =
            -progress * speed * 0.55;

        card.style.transform =
            `translateY(${offset}px)`;
    });


    /* --------------------------------------
       WATERMARK PARALLAX
    -------------------------------------- */

    watermark.style.transform =
        `translate(-50%, -50%) translateY(${-progress * 80}px)`;
}


/* ==========================================
   REQUEST ANIMATION FRAME
========================================== */

let ticking = false;

function requestParallaxUpdate() {

    if (ticking) {
        return;
    }

    ticking = true;

    window.requestAnimationFrame(() => {

        updateParallax();

        ticking = false;
    });
}


/* ==========================================
   EVENTS
========================================== */

window.addEventListener(
    'scroll',
    requestParallaxUpdate,
    { passive: true }
);

window.addEventListener(
    'resize',
    requestParallaxUpdate
);


/* ==========================================
   INITIAL UPDATE
========================================== */

requestParallaxUpdate();