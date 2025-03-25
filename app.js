// alert("we local");
function handleVideoClick() {
  const videoWrappers = document.querySelectorAll(".video-wrapper");

  const isUpcomingRetreatsPage =
    window.location.pathname.includes("/upcoming-retreats");

  // Exit if no video wrappers found
  if (!videoWrappers.length) return;

  videoWrappers.forEach((wrapper) => {
    wrapper.addEventListener("click", function (event) {
      const video = this.querySelector("video");
      const hasPlayed = !video.paused && !video.muted && video.volume > 0;

      // hide video poster overlay
      const playOverlay = this.querySelector(".video-play-overlay");
      if (playOverlay) {
        playOverlay.style.display = "none";
      }

      // ignore pause btn clicks
      const pauseBtn = this.querySelector('[f-data-video="pause-button"]');
      if (pauseBtn && pauseBtn.contains(event.target)) {
        return; // exit
      }

      // ignore volume change clicks
      const volumeSlider = this.querySelector('[f-data-video="volume-slider"]');
      if (volumeSlider && volumeSlider.contains(event.target)) {
        return; // exit
      }

      // ignore videoTimeline clicks
      const videoTimeline = wrapper.querySelector(".time-controls-wrapper");
      if (videoTimeline && videoTimeline.contains(event.target)) {
        return; // exit
      }

      const playBtn = this.querySelector('[f-data-video="play-button"]');
      const volumeBtn = this.querySelector('[f-data-video="volume-button"]');

      if (playBtn && playBtn.contains(event.target)) {
        if (video.muted) volumeBtn.click(); // play with volume on
        // restart if first time playing
        if (!playBtn.dataset.clicked) {
          video.currentTime = 0;
          playBtn.dataset.clicked = "true";
        }
        video.loop = false;
        pauseOtherVideos(video);
        showHideVideoInfo(true);
        return; // exit
      }

      // if the clicked element is volume btn logic
      if (volumeBtn && volumeBtn.contains(event.target)) {
        if (!playBtn.dataset.clicked) {
          resetCurrentPlayBtn(true);
          showHideVideoInfo(true);
          video.loop = false;
          playBtn.dataset.clicked = "true";
        }
        if (!volumeBtn.dataset.clicked) {
          volumeBtn.dataset.clicked = "true";
        }
        return; // exit
      }

      // if the clicked element is fullscreen btn logic
      const fullscreenBtn = this.querySelector('[f-data-video="fullscreen"]');
      if (fullscreenBtn && fullscreenBtn.contains(event.target)) {
        if (
          !hasPlayed ||
          !playBtn.dataset.clicked ||
          !volumeBtn.dataset.clicked
        ) {
          if (video.muted) volumeBtn.click();
        }
        return; // exit
      }

      // handle fullscreen play/pause
      video.addEventListener("play", () => {
        if (document.fullscreenElement === video) {
          resetCurrentPlayBtn(true);
          showHideVideoInfo(true);
          return;
        }
      });
      video.addEventListener("pause", () => {
        if (document.fullscreenElement === video) {
          resetCurrentPlayBtn(false);
          showHideVideoInfo(false);
          return;
        }
      });

      // Skip play/pause logic if video itself is clicked in fullscreen
      if (document.fullscreenElement === video) {
        if (video.paused) {
          resetCurrentPlayBtn(true);
          showHideVideoInfo(true);
        } else {
          resetCurrentPlayBtn(false);
          showHideVideoInfo(false);
        }
        return;
      }

      // play / pause functionality if volume btn has been clicked
      if (volumeBtn.dataset.clicked) {
        if (video.paused) {
          pauseOtherVideos(video);
          video.play();
          video.loop = false;
          resetCurrentPlayBtn(true);
          showHideVideoInfo(true);
        } else {
          video.pause();
          resetCurrentPlayBtn(false);
          showHideVideoInfo(false);
        }
        return;
      }

      // custom play or pause video logic for clicking on video itself
      if (hasPlayed) {
        video.pause();
        resetCurrentPlayBtn(false);
        showHideVideoInfo(false);
      } else if (video.paused) {
        pauseOtherVideos(video);
        video.play();
        video.loop = false;
        resetCurrentPlayBtn(true);
        showHideVideoInfo(true);
      } else {
        // restart if first time playing
        if (!playBtn.dataset.clicked) {
          video.currentTime = 0;
          playBtn.dataset.clicked = "true";
        }
        volumeBtn.click();
        pauseOtherVideos(video);
        video.play();
        video.loop = false;
        resetCurrentPlayBtn(true);
        showHideVideoInfo(true);
      }

      // Show/hide video info
      function showHideVideoInfo(inverse = false) {
        const videoInfo = wrapper.querySelector(".video-heading_wrapper");
        const timeControls = wrapper.querySelector(".time-controls-wrapper");
        const videoCaption = wrapper.querySelector(".video-caption_wrapper");

        if (videoInfo) {
          videoInfo.style.display = inverse ? "none" : "block";
        }

        // Handle time controls for all screen sizes
        if (timeControls) {
          timeControls.style.display = inverse ? "flex" : "none";
          timeControls.style.opacity = inverse ? 1 : 0;
        }

        // Handle video caption only for screens larger than 767px
        if (videoCaption && window.innerWidth > 767) {
          videoCaption.style.display = inverse ? "block" : "none";
          videoCaption.style.opacity = inverse ? 1 : 0;
        }
      }

      // Reset play/pause buttons for current video
      function resetCurrentPlayBtn(inverse = false) {
        const playBtn = wrapper.querySelector('[f-data-video="play-button"]');
        const pauseBtn = wrapper.querySelector('[f-data-video="pause-button"]');

        if (playBtn) {
          playBtn.style.display = inverse ? "none" : "block";
        }
        if (pauseBtn) {
          pauseBtn.style.display = inverse ? "block" : "none";
        }
      }

      // Pause video when 15% or less is in viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.intersectionRatio <= 0.15 &&
              !video.paused &&
              !video.muted &&
              video.volume > 0
            ) {
              video.pause();
              resetCurrentPlayBtn(false);
              showHideVideoInfo(false);
            }
          });
        },
        {
          threshold: [0, 0.15], // Track both when completely hidden and at 15% visible
          rootMargin: "0px", // No margin adjustment needed
        }
      );
      observer.observe(video);
    });
  });
}

function resetAllPlayBtns(inverse = false) {
  const playBtns = document.querySelectorAll('[f-data-video="play-button"]');
  const pauseBtns = document.querySelectorAll('[f-data-video="pause-button"]');

  // Exit if no buttons found
  if (!playBtns.length && !pauseBtns.length) return;

  playBtns.forEach((btn) => {
    btn.style.display = inverse ? "none" : "block";
  });
  pauseBtns.forEach((btn) => {
    btn.style.display = inverse ? "block" : "none";
  });
}

// Utility function to pause all other playing videos
function pauseOtherVideos(currentVideo) {
  const allVideos = document.querySelectorAll("video");

  // Exit if no videos found
  if (!allVideos.length) return;

  allVideos.forEach((otherVideo) => {
    if (
      otherVideo !== currentVideo &&
      !otherVideo.paused &&
      !otherVideo.muted &&
      otherVideo.volume > 0
    ) {
      otherVideo.pause();
      // Reset the play/pause buttons for the paused video's wrapper
      const otherWrapper = otherVideo.closest(".video-wrapper");
      if (otherWrapper) {
        const resetBtn = (inverse = false) => {
          const playBtn = otherWrapper.querySelector(
            '[f-data-video="play-button"]'
          );
          const pauseBtn = otherWrapper.querySelector(
            '[f-data-video="pause-button"]'
          );
          if (playBtn) playBtn.style.display = inverse ? "none" : "block";
          if (pauseBtn) pauseBtn.style.display = inverse ? "block" : "none";
        };
        resetBtn(false);
        // Hide video info for the paused video
        const videoInfo = otherWrapper.querySelector(".video-heading_wrapper");
        const videoControls = otherWrapper.querySelectorAll(
          ".time-controls-wrapper, .video-caption_wrapper"
        );
        if (videoInfo) videoInfo.style.display = "block";
        if (videoControls) {
          videoControls.forEach((div) => {
            div.style.display = "none";
            div.style.opacity = 0;
          });
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Only run if we have video elements on the page
  const hasVideos = document.querySelectorAll("video").length > 0;
  if (!hasVideos) return;

  resetAllPlayBtns();
  handleVideoClick();
});
