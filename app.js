// alert("we local");
function handleVideoClick() {
  const videoWrappers = document.querySelectorAll(".video-wrapper");

  videoWrappers.forEach((wrapper) => {
    wrapper.addEventListener("click", function (event) {
      const video = this.querySelector("video");
      const hasPlayed = !video.paused && !video.muted && video.volume > 0;

      // hide video poster overlay
      const playOverlay = this.querySelector(".video-play-overlay");
      if (playOverlay) {
        playOverlay.style.display = "none";
      }

      // if the clicked element is volume btn logic
      const volumeBtn = this.querySelector('[f-data-video="volume-button"]');
      if (volumeBtn && volumeBtn.contains(event.target)) {
        resetCurrentPlayBtn(true);
        return; // exit
      }

      // if the clicked element is fullscreen btn logic
      const fullscreenBtn = this.querySelector('[f-data-video="fullscreen"]');
      if (fullscreenBtn && fullscreenBtn.contains(event.target)) {
        resetCurrentPlayBtn(true);
        return; // exit
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
      if (playBtn && playBtn.contains(event.target)) {
        if (video.muted) volumeBtn.click(); // play with volume on
        // restart if first time playing
        if (!playBtn.dataset.clicked) {
          video.currentTime = 0;
          playBtn.dataset.clicked = "true";
        }
        return; // exit
      }

      // Skip play/pause logic if video is in fullscreen
      if (document.fullscreenElement === video) {
        return;
      }

      // custom play or pause video logic for clicking on video itself
      if (hasPlayed) {
        video.pause();
        resetCurrentPlayBtn(false);
        showHideVideoInfo(false);
      } else if (video.paused) {
        video.play();
        resetCurrentPlayBtn(true);
        showHideVideoInfo(true);
      } else {
        // restart if first time playing
        if (!playBtn.dataset.clicked) {
          video.currentTime = 0;
          playBtn.dataset.clicked = "true";
        }
        volumeBtn.click();
        video.play();
        resetCurrentPlayBtn(true);
        showHideVideoInfo(true);
      }

      // Show/hide video info
      function showHideVideoInfo(inverse = false) {
        const videoInfo = wrapper.querySelector(".video-heading_wrapper");
        const videoControls = wrapper.querySelectorAll(
          ".time-controls-wrapper, .video-caption_wrapper"
        );

        if (videoInfo) {
          videoInfo.style.display = inverse ? "none" : "block";
        }
        if (videoControls) {
          videoControls.forEach((div) => {
            div.style.display = inverse ? "block" : "none";
            div.style.opacity = inverse ? 1 : 0;
          });
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

      // Pause video when it's completely out of viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting && !video.paused) {
              video.pause();
              resetCurrentPlayBtn(false);
              showHideVideoInfo(false);
            }
          });
        },
        { threshold: 0 }
      );
      observer.observe(video);
    });
  });
}

function resetAllPlayBtns(inverse = false) {
  const playBtns = document.querySelectorAll('[f-data-video="play-button"]');
  playBtns.forEach((btn) => {
    btn.style.display = inverse ? "none" : "block";
  });
  const pauseBtns = document.querySelectorAll('[f-data-video="pause-button"]');
  pauseBtns.forEach((btn) => {
    btn.style.display = inverse ? "block" : "none";
  });
}

// Call the function when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  resetAllPlayBtns();
  handleVideoClick();
});
