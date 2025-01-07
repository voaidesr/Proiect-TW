function scrollToNextSlide(nextSlideId) {
    const nextSlide = document.querySelector(`#${nextSlideId}`);
    if (nextSlide) {
      nextSlide.scrollIntoView({ behavior: 'smooth' });
    }
  }