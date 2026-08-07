

(function () {
  "use strict";

  const CYCLE_SECONDS = 42; // matches the original @keyframes duration
  const DESKTOP_MQL = window.matchMedia("(min-width: 769px)");
  const MOBILE_MQL = window.matchMedia("(max-width: 768px)"); // matches your CSS breakpoint exactly

  let teardown = null;
  let mobileTeardown = null;

  function initMarquee() {
    const section = document.querySelector(".testimonials");
    const container = document.querySelector(".testimonial-slider");
    const wrapper = container && container.querySelector(".swiper-wrapper");

    if (!section || !container || !wrapper) {
      console.warn("[testimonial-marquee] Required elements not found.");
      return null;
    }
    if (typeof gsap === "undefined") {
      console.warn("[testimonial-marquee] GSAP not loaded — check script order.");
      return null;
    }

   
    let originalCount = wrapper.dataset.originalCount
      ? parseInt(wrapper.dataset.originalCount, 10)
      : null;

    if (!wrapper.dataset.cloned) {
      const originalSlides = Array.from(wrapper.children);
      originalCount = originalSlides.length;
      wrapper.dataset.originalCount = String(originalCount);

      originalSlides.forEach((slide) => {
        const clone = slide.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("inert", "");
        wrapper.appendChild(clone);
      });
      wrapper.dataset.cloned = "true";
    }

  
    wrapper.classList.add("marquee-track");
    wrapper.style.animation = "none";
    wrapper.style.willChange = "transform";
    container.style.cursor = "grab";
    gsap.set(wrapper, { x: 0 });

    // ---------------------------------------------------------
    // 3. Measure the exact loop distance (transform-invariant —
    //    safe to call any time, even mid-drag).
    // ---------------------------------------------------------
    function measureLoopWidth() {
      const wrapperRect = wrapper.getBoundingClientRect();
      const firstClone = wrapper.children[originalCount];
      return firstClone.getBoundingClientRect().left - wrapperRect.left;
    }

    let loopWidth = measureLoopWidth();
    let speed = loopWidth / CYCLE_SECONDS; // px/sec — preserves original pacing
    let xPos = 0;
    let wrapFn = gsap.utils.wrap(-loopWidth, 0);

    // ---------------------------------------------------------
    // 4. One flag set decides whether the ticker is allowed to
    //    move the track. Hover, drag, and "a video is playing"
    //    are independent reasons that can each block movement;
    //    the marquee only runs when none of them are true.
    // ---------------------------------------------------------
    let isHover = false;
    let isDragging = false;
    let isVideoPlaying = false;

    function isRunning() {
      return !isHover && !isDragging && !isVideoPlaying;
    }

    const ticker = (time, deltaMs) => {
      if (!isRunning()) return;
      xPos -= speed * (deltaMs / 1000);
      xPos = wrapFn(xPos);
      gsap.set(wrapper, { x: xPos });
    };
    gsap.ticker.add(ticker);

    function onEnter() {
      isHover = true;
    }
    function onLeave() {
      isHover = false;
    }
    section.addEventListener("mouseenter", onEnter);
    section.addEventListener("mouseleave", onLeave);

    let pointerId = null;
    let dragStartClientX = 0;
    let dragStartXPos = 0;

    function onPointerDown(e) {
      if (e.target.closest(".play-btn")) return; // requirement 19: button stays clickable
      isDragging = true;
      pointerId = e.pointerId;
      dragStartClientX = e.clientX;
      dragStartXPos = xPos;
      container.style.cursor = "grabbing";
      if (container.setPointerCapture) {
        try {
          container.setPointerCapture(pointerId);
        } catch (err) {
          /* Safari occasionally throws on capture of an already-released id — safe to ignore */
        }
      }
    }

    function onPointerMove(e) {
      if (!isDragging || e.pointerId !== pointerId) return;
      const diff = e.clientX - dragStartClientX;
      xPos = wrapFn(dragStartXPos + diff);
      gsap.set(wrapper, { x: xPos });
    }

    function endDrag(e) {
      if (!isDragging || (pointerId !== null && e.pointerId !== pointerId)) return;
      isDragging = false;
      pointerId = null;
      container.style.cursor = "grab";
      // xPos already holds the released position — ticker resumes from here, no snap.
    }

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);


    const videoWraps = Array.from(container.querySelectorAll(".testimonial-video"));
    const cleanups = [];

    videoWraps.forEach((videoWrap) => {
      const video = videoWrap.querySelector("video");
      const button = videoWrap.querySelector(".play-btn");
      if (!video || !button) return;

      button.style.zIndex = "5"; // requirement 9: stays above native controls

      const icon = button.querySelector("img");
      const PLAY_ICON = "assets/svgs/playbutton.svg";
      const PAUSE_ICON = "assets/svgs/pausebutton.svg"; // adjust path if your pause asset lives elsewhere

      function setButtonState(isPlaying) {
        button.classList.toggle("playing", isPlaying);
        button.classList.toggle("paused", !isPlaying);
        button.setAttribute("aria-label", isPlaying ? "Pause video" : "Play video");
        if (icon) icon.src = isPlaying ? PAUSE_ICON : PLAY_ICON;
      }

      const onButtonClick = () => {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      };

      const onPlay = () => {
        isVideoPlaying = true;
        setButtonState(true);
        video.controls = true; // requirements 2–4: reveal native seek/volume/fullscreen/PiP UI
        // requirement 17: only one video plays at a time
        videoWraps.forEach((otherWrap) => {
          const otherVideo = otherWrap.querySelector("video");
          if (otherVideo && otherVideo !== video && !otherVideo.paused) {
            otherVideo.pause();
          }
        });
      };

      const onStopped = () => {
        setButtonState(false);
        video.controls = false; // requirements 5–6: hide native controls, custom button takes over again
        isVideoPlaying = videoWraps.some((w) => {
          const v = w.querySelector("video");
          return v && !v.paused && !v.ended;
        });
      };

      const onEnded = () => {
        onStopped();
        video.currentTime = 0; // requirement 5: reset to 0 on end only, not on a manual pause
      };

      button.addEventListener("click", onButtonClick);
      video.addEventListener("play", onPlay);
      video.addEventListener("pause", onStopped);
      video.addEventListener("ended", onEnded);

      cleanups.push(() => {
        button.removeEventListener("click", onButtonClick);
        video.removeEventListener("play", onPlay);
        video.removeEventListener("pause", onStopped);
        video.removeEventListener("ended", onEnded);
      });
    });

    let resizeRaf = null;
    function onResize() {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        loopWidth = measureLoopWidth();
        speed = loopWidth / CYCLE_SECONDS;
        wrapFn = gsap.utils.wrap(-loopWidth, 0);
        xPos = wrapFn(xPos);
      });
    }
    window.addEventListener("resize", onResize);

    return function destroy() {
      gsap.ticker.remove(ticker);
      section.removeEventListener("mouseenter", onEnter);
      section.removeEventListener("mouseleave", onLeave);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("resize", onResize);
      cleanups.forEach((fn) => fn());
      wrapper.style.animation = "";
      wrapper.style.willChange = "";
      container.style.cursor = "";
      gsap.set(wrapper, { clearProps: "x" });
    };
  }

  function initMobileVideos() {
    const videoWraps = Array.from(document.querySelectorAll(".testimonial-video"));
    if (!videoWraps.length) {
      console.warn("[mobile-video] No .testimonial-video elements found.");
      return null;
    }

    let activeVideo = null;
    const cleanups = [];

    videoWraps.forEach((videoWrap) => {
      const video = videoWrap.querySelector("video");
      const button = videoWrap.querySelector(".play-btn");
      if (!video || !button) return;

      button.style.zIndex = "5"; // requirement 9: stays above native controls

      const icon = button.querySelector("img");
      const PLAY_ICON = "assets/svgs/playbutton.svg";
      const PAUSE_ICON = "assets/svgs/pausebutton.svg"; // adjust path if your pause asset lives elsewhere

      function setButtonState(isPlaying) {
        button.classList.toggle("playing", isPlaying);
        button.classList.toggle("paused", !isPlaying);
        button.setAttribute("aria-label", isPlaying ? "Pause video" : "Play video");
        if (icon) icon.src = isPlaying ? PAUSE_ICON : PLAY_ICON;
      }

      const onButtonClick = () => {
        // Only one video may play at once: stop whichever one is
        // currently active (if it isn't this one) before starting this one.
        if (activeVideo && activeVideo !== video && !activeVideo.paused) {
          activeVideo.pause();
        }

        if (video.paused) {
          video.controls = true; // show native controls
          video.play();
          activeVideo = video;
        } else {
          video.pause(); // native pause path handled below in onPause
        }
      };

      const onPlay = () => {
        setButtonState(true);
        video.controls = true;
        activeVideo = video;
      };

      const onPause = () => {
        // Keep current frame — do NOT touch currentTime here.
        setButtonState(false);
        // Controls stay visible per requirement; only the icon changes.
        if (activeVideo === video) activeVideo = null;
      };

      const onEnded = () => {
        setButtonState(false);
        video.controls = false;
        video.currentTime = 0;
        if (activeVideo === video) activeVideo = null;
      };

      button.addEventListener("click", onButtonClick);
      video.addEventListener("play", onPlay);
      video.addEventListener("pause", onPause);
      video.addEventListener("ended", onEnded);

      cleanups.push(() => {
        button.removeEventListener("click", onButtonClick);
        video.removeEventListener("play", onPlay);
        video.removeEventListener("pause", onPause);
        video.removeEventListener("ended", onEnded);
      });
    });

    return function destroyMobileVideos() {
      cleanups.forEach((fn) => fn());
      activeVideo = null;
    };
  }

  function handleModeChange() {
    if (DESKTOP_MQL.matches) {
      if (!teardown) teardown = initMarquee();
    } else if (teardown) {
      teardown();
      teardown = null;
    }
  }
  function handleMobileModeChange() {
    if (MOBILE_MQL.matches) {
      if (!mobileTeardown) mobileTeardown = initMobileVideos();
    } else if (mobileTeardown) {
      mobileTeardown();
      mobileTeardown = null;
    }
  }

  function boot() {
    handleModeChange();
    if (DESKTOP_MQL.addEventListener) {
      DESKTOP_MQL.addEventListener("change", handleModeChange);
    } else {
      DESKTOP_MQL.addListener(handleModeChange); // Safari < 14
    }

    handleMobileModeChange();
    if (MOBILE_MQL.addEventListener) {
      MOBILE_MQL.addEventListener("change", handleMobileModeChange);
    } else {
      MOBILE_MQL.addListener(handleMobileModeChange); // Safari < 14
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();