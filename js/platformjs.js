document.addEventListener("DOMContentLoaded", function () {

    const tabs = document.querySelectorAll(".platform-tabs .tab");
    const platformItems = document.querySelectorAll(".platform-item");


    /* =========================================================
       TAB SWITCHING
    ========================================================= */

    tabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            const target = this.dataset.tab;

            /* Active tab */
            tabs.forEach(function (item) {
                item.classList.remove("active");
            });

            this.classList.add("active");


            /* Hide all platform items + reset animations */
            platformItems.forEach(function (item) {

                item.classList.remove("active");

                const right = item.querySelector(".platform-right");

                if (right) {
                    right.classList.remove("is-visible");
                }

            });


            /* Show selected platform */
            const selectedItem = document.querySelector(
                '.platform-item[data-content="' + target + '"]'
            );

            if (!selectedItem) {
                return;
            }

            selectedItem.classList.add("active");


            /* Trigger animation */
            const selectedRight =
                selectedItem.querySelector(".platform-right");

            if (selectedRight) {

                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        selectedRight.classList.add("is-visible");
                    });
                });

            }

        });

    });


    /* =========================================================
       REPEAT ANIMATION WHEN PLATFORM SECTION ENTERS VIEW
    ========================================================= */

    const platformOverview = document.querySelector(".platform-overview");

if (!platformOverview) {
    return;
}

let hasAnimated = false;

const observer = new IntersectionObserver(function(entries) {

    entries.forEach(function(entry) {

        if (!entry.isIntersecting || hasAnimated) {
            return;
        }

        const activeItem = document.querySelector(".platform-item.active");

        if (!activeItem) {
            return;
        }

        const right = activeItem.querySelector(".platform-right");

        if (right) {
            right.classList.remove("is-visible");

            void right.offsetWidth;

            requestAnimationFrame(function () {
                right.classList.add("is-visible");
            });
        }

        hasAnimated = true;

        // Stop observing after first animation
        observer.unobserve(platformOverview);

    });

}, {
    threshold: 0.25
});

observer.observe(platformOverview);
});