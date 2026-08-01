const parallaxSection = document.querySelector(".stats");
const parallaxEls = document.querySelectorAll(".stats [data-speed]");

function updateParallax() {

    const rect = parallaxSection.getBoundingClientRect();

    const viewportCenter = window.innerHeight / 2;

    const sectionCenter = rect.top + rect.height / 2;

    const distance = viewportCenter - sectionCenter;

    // normalize across full entry-to-exit travel so it crosses 0 evenly
    const totalTravel = (rect.height / 2) + viewportCenter;

    const progress = Math.max(-1, Math.min(1, distance / totalTravel));

    parallaxEls.forEach(el => {

        const speed = Number(el.dataset.speed);

        let offset = progress * speed;
        offset = Math.max(-100, Math.min(100, offset)); // keep motion sane both ways

        el.style.setProperty("--py", offset);

    });

}

window.addEventListener("scroll", updateParallax);

window.addEventListener("resize", updateParallax);

updateParallax();