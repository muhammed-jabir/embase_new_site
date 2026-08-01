// ========================================
// TESTIMONIAL MARQUEE — pure CSS animation
// ========================================
//
// We deliberately do NOT use Swiper's autoplay for
// the continuous movement. Swiper's autoplay.stop()
// is documented to NOT interrupt an in-flight CSS
// transition immediately (see Swiper issues #6481,
// #3986, #3134 on GitHub), and after repeated
// stop/start cycles its internal loop tracking can
// get stuck permanently — which matches exactly what
// you were seeing.
//
// A plain CSS animation + animation-play-state is a
// native browser feature: pausing it always freezes
// instantly at the current frame, and resuming always
// continues from that exact frame. No drift, no stuck
// state, no matter how many times it's toggled.

const wrapper = document.querySelector(".testimonial-slider .swiper-wrapper");

// Duplicate the slide set once so the strip loops
// seamlessly — translateX(-50%) always lands exactly
// back on the start of an identical copy.

Array.from(wrapper.children).forEach(slide=>{

    const clone = slide.cloneNode(true);

    clone.setAttribute("aria-hidden","true");

    wrapper.appendChild(clone);

});

wrapper.classList.add("marquee-track");


// ========================================
// PAUSE ENGINE
// Every reason the slider should be stopped
// (hover, video playing, section off-screen)
// lives in this Set. The animation only runs
// once ALL reasons are cleared.
// ========================================

const pauseReasons = new Set(["visibility"]); // paused until section is seen

function updatePauseState(){

    wrapper.classList.toggle("is-paused", pauseReasons.size > 0);

}

function pauseSlider(reason){

    pauseReasons.add(reason);

    updatePauseState();

}

function resumeSlider(reason){

    pauseReasons.delete(reason);

    updatePauseState();

}


// ========================================
// START ONLY WHEN SECTION IS VISIBLE
// ========================================

const testimonialSection = document.querySelector(".testimonials");

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            resumeSlider("visibility");

        }else{

            pauseSlider("visibility");

        }

    });

},{
    threshold:.35
});

observer.observe(testimonialSection);


// ========================================
// HOVER PAUSE — instant, native, never gets stuck
// ========================================

const testimonialTrack = document.querySelector(".testimonial-slider");

testimonialTrack.addEventListener("mouseenter",()=>{

    pauseSlider("hover");

});

testimonialTrack.addEventListener("mouseleave",()=>{

    resumeSlider("hover");

});


// ========================================
// VIDEO
// (queried AFTER cloning, so both the original
// and the duplicated cards work correctly)
// ========================================

const videos = document.querySelectorAll(".client-video");

videos.forEach(video=>{

    const button = video.parentElement.querySelector(".play-btn");

    button.addEventListener("click",()=>{

        videos.forEach(v=>{

            if(v!==video){

                v.pause();

                v.currentTime=0;

                v.classList.remove("playing");

                v.parentElement.querySelector(".play-btn").style.display="flex";

            }

        });

        pauseSlider("video");

        video.classList.add("playing");

        video.controls=true;

        video.play();

        button.style.display="none";

    });

});


// ========================================
// VIDEO END / VIDEO PAUSE
// ========================================

videos.forEach(video=>{

    video.addEventListener("ended",()=>{

        video.classList.remove("playing");

        video.controls=false;

        video.currentTime=0;

        video.parentElement.querySelector(".play-btn").style.display="flex";

        resumeSlider("video");

    });

    video.addEventListener("pause",()=>{

        if(video.ended) return;

        video.classList.remove("playing");

        video.parentElement.querySelector(".play-btn").style.display="flex";

        resumeSlider("video");

    });

});