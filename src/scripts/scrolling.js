function scrollToNextSlide(nextSlideId) {
    const nextSlide = document.querySelector(`#${nextSlideId}`);
    if (nextSlide) {
      nextSlide.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add event listener to all buttons with class 'scroll-button'
document.querySelectorAll('.scroll-button').forEach(button => {
    button.addEventListener('click', function() {
        const currentSlide = button.closest('.slide');
        const currentSlideId = currentSlide.id;
        const nextSlideId = getNextSlideId(currentSlideId);
        scrollToNextSlide(nextSlideId);
    });
});

function getNextSlideId(currentSlideId) {
    const slides = ['one', 'two', 'three', 'four'];
    const currentIndex = slides.indexOf(currentSlideId);
    if (currentIndex !== -1 && currentIndex < slides.length - 1) {
        return slides[currentIndex + 1];
    }
    return null;
}

function getPreviousSlideId(currentSlideId) {
    const slides = ['one', 'two', 'three', 'four'];
    const currentIndex = slides.indexOf(currentSlideId);
    if (currentIndex > 0) {
        return slides[currentIndex - 1];
    }
    return null;
}

// Add event listener for arrow-down key press
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowDown') {
        const currentSlide = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2).closest('.slide');
        if (currentSlide) {
            const currentSlideId = currentSlide.id;
            const nextSlideId = getNextSlideId(currentSlideId);
            scrollToNextSlide(nextSlideId);
        }
    }
});

// Add event listener for arrow-up key press
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        const currentSlide = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2).closest('.slide');
        if (currentSlide) {
            const currentSlideId = currentSlide.id;
            const previousSlideId = getPreviousSlideId(currentSlideId);
            scrollToNextSlide(previousSlideId);
        }
    }
});