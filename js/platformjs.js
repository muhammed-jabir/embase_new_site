document.addEventListener("DOMContentLoaded", function () {

    const platformRight = document.querySelector(".platform-right");

    if (!platformRight) {
        return;
    }

    const observer = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    platformRight.classList.add("is-visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.25
        }
    );

    observer.observe(platformRight);

});