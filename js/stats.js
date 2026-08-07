
(function () {
  "use strict";

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("[stats-scroll] GSAP core or ScrollTrigger plugin not loaded — check script order.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const MOBILE_MQL = window.matchMedia("(max-width: 768px)");
  let activeTweens = [];
  function initStatsScroll() {
    if (activeTweens.length) return; // already running — avoid duplicate ScrollTriggers
    const blueTween = gsap.to(".stat-card--blue", {
      y: -130,
      ease: "none",
      scrollTrigger: {
        trigger: ".stats",
        start: "top 70%",
        end: "bottom 30%",
        scrub: 1,
      },
    });

    const peachTween = gsap.to(".stat-card--peach", {
      y: 130,
      ease: "none",
      scrollTrigger: {
        trigger: ".stats",
        start: "top 70%",
        end: "bottom 30%",
        scrub: 1.4,
      },
    });

    activeTweens = [blueTween, peachTween];
  }
  function destroyStatsScroll() {
    activeTweens.forEach((tween) => {
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    });
    activeTweens = [];

    gsap.set(".stat-card", { clearProps: "transform" });
  }

  function handleModeChange() {
    if (MOBILE_MQL.matches) {
      destroyStatsScroll();
    } else {
      initStatsScroll();
    }
  }

  function boot() {
    handleModeChange();

    if (MOBILE_MQL.addEventListener) {
      MOBILE_MQL.addEventListener("change", handleModeChange);
    } else {
      MOBILE_MQL.addListener(handleModeChange); // Safari < 14
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();