// alert("we local");
function handleVideoClick() {
  const videoWrappers = document.querySelectorAll(".video-wrapper");

  videoWrappers.forEach((wrapper) => {
    wrapper.addEventListener("click", function () {
      const playOverlay = this.querySelector(".video-play-overlay");
      const video = this.querySelector("video");

      const hasPlayed = !video.paused && !video.muted && video.volume > 0;

      if (hasPlayed) {
        video.pause();
      } else if (video.paused) {
        video.play();
      } else {
        video.currentTime = 0;
        video.volume = 1;
        video.muted = false;
        video.play();
      }

      // Pause video when it's completely out of viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting && !video.paused) {
              video.pause();
            }
          });
        },
        { threshold: 0 }
      );
      observer.observe(video);
      
      if (playOverlay) {
        playOverlay.style.display = "none";
      }
    });
  });
}

// Call the function when DOM is ready
document.addEventListener("DOMContentLoaded", handleVideoClick);
