(function () {
  const gallery = document.querySelector(".photo-gallery");
  const lightbox = document.getElementById("photo-lightbox");
  if (!gallery || !lightbox) return;

  const image = lightbox.querySelector("img");
  const caption = lightbox.querySelector(".photo-lightbox-caption");
  const closeButton = lightbox.querySelector(".photo-lightbox-close");

  function openPhoto(link) {
    image.src = link.href;
    image.alt = link.querySelector("img")?.alt || "";
    caption.textContent = link.querySelector("span")?.textContent || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closePhoto() {
    lightbox.hidden = true;
    image.removeAttribute("src");
    document.body.style.overflow = "";
  }

  gallery.addEventListener("click", (event) => {
    const link = event.target.closest(".photo-card");
    if (!link) return;
    event.preventDefault();
    openPhoto(link);
  });

  closeButton.addEventListener("click", closePhoto);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closePhoto();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closePhoto();
  });
})();
