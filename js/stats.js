const parallaxSection = document.querySelector('.stats');
const cards = document.querySelectorAll('.stat-card');
const watermark = document.querySelector('.stats__watermark');

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function resetParallax() {
    cards.forEach((card) => {
        card.style.transform = 'translateY(0px)';
    });

    watermark.style.transform = 'translate(-50%, -50%) translateY(0px)';
}

function updateParallax() {
    if (!parallaxSection || !watermark || cards.length === 0) {
        return;
    }

    const rect = parallaxSection.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const sectionCenter = rect.top + rect.height / 2;
    const distance = viewportCenter - sectionCenter;
    const totalTravel = Math.max(rect.height * 0.72, 1);
    const progress = clamp(distance / totalTravel, -1, 1);

    if (rect.bottom < -120 || rect.top > window.innerHeight + 120) {
        resetParallax();
        return;
    }

    cards.forEach((card) => {
        const speed = Number(card.dataset.speed) || 0;
        const offset = -progress * speed * 0.55;
        card.style.transform = `translateY(${offset}px)`;
    });

    watermark.style.transform = `translate(-50%, -50%) translateY(${-progress * 80}px)`;
}

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

window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
window.addEventListener('resize', requestParallaxUpdate);

requestParallaxUpdate();
