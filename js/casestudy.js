// ==========================================
// CASE STUDY SLIDER
// MANUAL ARROW CONTROL ONLY
// ==========================================

const caseSlides = Array.from(
    document.querySelectorAll(".case-slide")
);

const casePrevButton = document.querySelector(".case-prev");
const caseNextButton = document.querySelector(".case-next");


if (
    caseSlides.length > 0 &&
    casePrevButton &&
    caseNextButton
) {

    let currentSlide = 0;


    // ==========================================
    // SHOW SLIDE
    // ==========================================

    function showCaseSlide(index, direction) {

        currentSlide =
            (index + caseSlides.length) %
            caseSlides.length;


        caseSlides.forEach((slide, slideIndex) => {

            slide.classList.remove(
                "active",
                "slide-next",
                "slide-prev"
            );


            if (slideIndex === currentSlide) {

                slide.classList.add("active");

                // Restart animation
                void slide.offsetWidth;


                if (direction === "next") {

                    slide.classList.add("slide-next");

                }

                if (direction === "prev") {

                    slide.classList.add("slide-prev");

                }

            }

        });

    }


    // ==========================================
    // DOWN ARROW → NEXT
    // ==========================================

    caseNextButton.addEventListener("click", () => {

        showCaseSlide(
            currentSlide + 1,
            "next"
        );

    });


    // ==========================================
    // UP ARROW → PREVIOUS
    // ==========================================

    casePrevButton.addEventListener("click", () => {

        showCaseSlide(
            currentSlide - 1,
            "prev"
        );

    });


    // ==========================================
    // INITIAL SLIDE
    // ==========================================

    showCaseSlide(0);

}