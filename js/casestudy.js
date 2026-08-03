const caseSlides = [...document.querySelectorAll(".case-slide")];
const casePrevButton = document.querySelector(".case-prev");
const caseNextButton = document.querySelector(".case-next");
const caseSlider = document.querySelector(".case-slider");

if (
    caseSlides.length &&
    casePrevButton &&
    caseNextButton
) {

    let currentSlide = 0;

    function showCaseSlide(index, direction = "next") {

        currentSlide =
            (index + caseSlides.length) % caseSlides.length;

        caseSlides.forEach((slide, slideIndex) => {

            slide.classList.remove(
                "active",
                "slide-next",
                "slide-prev"
            );

            if (slideIndex === currentSlide) {

                // Restart animation
                void slide.offsetWidth;

                slide.classList.add("active");

                slide.classList.add(
                    direction === "next"
                        ? "slide-next"
                        : "slide-prev"
                );

            }

        });

    }

    caseNextButton.addEventListener("click", () => {

        showCaseSlide(currentSlide + 1, "next");

    });

    casePrevButton.addEventListener("click", () => {

        showCaseSlide(currentSlide - 1, "prev");

    });

    showCaseSlide(0, "next");

    let autoRotate = setInterval(() => {

        showCaseSlide(currentSlide + 1, "next");

    }, 5000);

    if (caseSlider) {

        caseSlider.addEventListener("mouseenter", () => {

            clearInterval(autoRotate);

        });

        caseSlider.addEventListener("mouseleave", () => {

            clearInterval(autoRotate);

            autoRotate = setInterval(() => {

                showCaseSlide(currentSlide + 1, "next");

            }, 5000);

        });

    }

}