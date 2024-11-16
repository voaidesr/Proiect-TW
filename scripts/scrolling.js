function scrollToNextSlide() {
    const nextSlide = document.querySelector('#two');
    if (nextSlide) {
      nextSlide.scrollIntoView({ behavior: 'smooth' });
    }
  }