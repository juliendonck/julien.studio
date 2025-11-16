const isTouch = window.matchMedia("(hover: none)").matches;

let activePreview = null; // { el, trigger, type }

// Helpers
function showPreview(el, type) {
  if (!el) return;

  el.style.opacity = "1";

  if (type === "video") {
    el.play();
  }
}

function hidePreview(el, type) {
  if (!el) return;

  el.style.opacity = "0";

  if (type === "video") {
    el.pause();
    el.currentTime = 0;
  }
}

// VIDEO PREVIEW LINKS
document.querySelectorAll(".video").forEach((link) => {
  const videoId = link.dataset.preview;
  const video = document.getElementById(videoId);
  if (!video) return;

  if (isTouch) {
    // Mobile: tap to toggle
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const isThisActive = activePreview && activePreview.el === video;

      // Close currently active preview if it's not this one
      if (activePreview && !isThisActive) {
        hidePreview(activePreview.el, activePreview.type);
        activePreview = null;
      }

      if (isThisActive) {
        hidePreview(video, "video");
        activePreview = null;
      } else {
        showPreview(video, "video");
        activePreview = { el: video, trigger: link, type: "video" };
      }
    });
  } else {
    // Desktop: hover
    link.addEventListener("mouseenter", () => {
      showPreview(video, "video");
    });

    link.addEventListener("mouseleave", () => {
      hidePreview(video, "video");
    });
  }
});

// IMAGE PREVIEW LINKS
document.querySelectorAll(".hover-link").forEach((link) => {
  const imgId = link.dataset.image;
  const img = document.getElementById(imgId);
  if (!img) return;

  if (isTouch) {
    // Mobile: tap to toggle
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const isThisActive = activePreview && activePreview.el === img;

      if (activePreview && !isThisActive) {
        hidePreview(activePreview.el, activePreview.type);
        activePreview = null;
      }

      if (isThisActive) {
        hidePreview(img, "image");
        activePreview = null;
      } else {
        showPreview(img, "image");
        activePreview = { el: img, trigger: link, type: "image" };
      }
    });
  } else {
    // Desktop: hover
    link.addEventListener("mouseenter", () => {
      showPreview(img, "image");
    });

    link.addEventListener("mouseleave", () => {
      hidePreview(img, "image");
    });
  }
});

// Single global "click outside to close" for touch devices
if (isTouch) {
  document.addEventListener("click", (e) => {
    if (!activePreview) return;

    const { el, trigger, type } = activePreview;

    // If clicking the trigger or the preview itself, ignore
    if (trigger.contains(e.target) || el.contains(e.target)) {
      return;
    }

    hidePreview(el, type);
    activePreview = null;
  });
}
