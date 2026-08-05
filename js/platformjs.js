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

    const platformOverview =
        document.querySelector(".platform-overview");

    if (!platformOverview) {
        return;
    }


    const observer = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                const activeItem =
                    document.querySelector(".platform-item.active");

                if (!activeItem) {
                    return;
                }

                const right =
                    activeItem.querySelector(".platform-right");


                /* -----------------------------------------
                   SECTION ENTERS SCREEN
                ----------------------------------------- */

                if (entry.isIntersecting) {

                    if (right) {

                        /*
                         * Remove animation first
                         */
                        right.classList.remove("is-visible");


                        /*
                         * Force browser to register
                         * the hidden state
                         */
                        void right.offsetWidth;


                        /*
                         * Start animation again
                         */
                        requestAnimationFrame(function () {

                            right.classList.add("is-visible");

                        });

                    }

                }


                /* -----------------------------------------
                   SECTION LEAVES SCREEN
                ----------------------------------------- */

                else {

                    if (right) {

                        /*
                         * Reset animation so it can
                         * play again next time
                         */
                        right.classList.remove("is-visible");

                    }

                }

            });

        },
        {
            threshold: 0.25
        }
    );


    observer.observe(platformOverview);

});