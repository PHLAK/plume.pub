function initCarousel(carousel) {
    const track = carousel.querySelector('[data-carousel-track]');
    const prevButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    const indicators = [...carousel.querySelectorAll('[data-carousel-indicators] > button')];
    const slides = [...track.children];

    if (!track || slides.length === 0) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const currentIndex = () => {
        const index = Math.round(track.scrollLeft / track.clientWidth);
        return Math.min(slides.length - 1, Math.max(0, index));
    };

    const goTo = (index) => {
        const target = (index + slides.length) % slides.length;
        track.scrollTo({ left: target * track.clientWidth, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    };

    const syncIndicators = () => {
        const index = currentIndex();

        indicators.forEach((indicator, i) => {
            indicator.firstElementChild.classList.toggle('opacity-50', i !== index);

            if (i === index) {
                indicator.setAttribute('aria-current', 'true');
            } else {
                indicator.removeAttribute('aria-current');
            }
        });
    };

    prevButton?.addEventListener('click', () => goTo(currentIndex() - 1));
    nextButton?.addEventListener('click', () => goTo(currentIndex() + 1));
    indicators.forEach((indicator, i) => indicator.addEventListener('click', () => goTo(i)));

    let scrollFrame = null;
    track.addEventListener('scroll', () => {
        if (scrollFrame !== null) return;

        scrollFrame = requestAnimationFrame(() => {
            scrollFrame = null;
            syncIndicators();
        });
    }, { passive: true });

    syncIndicators();
}

document.querySelectorAll('[data-carousel]').forEach(initCarousel);