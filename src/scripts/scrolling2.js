function scrollToSlide(slideId) {
  const slide = document.querySelector(`#${slideId}`);
  if (slide) {
    slide.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function getNextSlideId(currentSlideId) {
  // same as scrolling.js, doar ca am adaugat id-urile pentru pagina celestial sphere
  const slides = [
    "one-celestial",
    "two-celestial",
    "three-celestial",
    "four-celestial",
  ];
  const currentIndex = slides.indexOf(currentSlideId);
  if (currentIndex !== -1 && currentIndex < slides.length - 1) {
    return slides[currentIndex + 1];
  }
  return null;
}

function getPreviousSlideId(currentSlideId) {
  const slides = [
    "one-celestial",
    "two-celestial",
    "three-celestial",
    "four-celestial",
  ];
  const currentIndex = slides.indexOf(currentSlideId);
  if (currentIndex > 0) {
    return slides[currentIndex - 1];
  }
  return null;
}

function handleScrollButtonClick(button) {
  const currentSlide = button.closest(".slide");
  const currentSlideId = currentSlide.id;
  const nextSlideId = getNextSlideId(currentSlideId);
  scrollToSlide(nextSlideId);
}

document.querySelectorAll(".scroll-button").forEach((button) => {
  button.addEventListener("click", function () {
    handleScrollButtonClick(button);
  });
});

document.addEventListener("keydown", function (event) {
  const currentSlide = document
    .elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
    .closest(".slide");
  if (currentSlide) {
    const currentSlideId = currentSlide.id;
    if (event.key === "ArrowDown") {
      const nextSlideId = getNextSlideId(currentSlideId);
      scrollToSlide(nextSlideId);
    } else if (event.key === "ArrowUp") {
      const previousSlideId = getPreviousSlideId(currentSlideId);
      scrollToSlide(previousSlideId);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".scroll-button").forEach((button) => {
    button.addEventListener("click", () => {
      handleScrollButtonClick(button);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const sideMenu = document.getElementById("side-menu");
  const toggleMenuIcon = document.getElementById("drpicon");
  const closeMenuButton = document.getElementById("close-menu");

  function toggleMenu() {
    sideMenu.classList.toggle("hidden");
  }

  toggleMenuIcon.addEventListener("click", toggleMenu);

  document.addEventListener("click", (event) => {
    if (
      !sideMenu.contains(event.target) &&
      !toggleMenuIcon.contains(event.target)
    ) {
      if (!sideMenu.classList.contains("hidden")) {
        sideMenu.classList.add("hidden");
      }
    }
  });
});
