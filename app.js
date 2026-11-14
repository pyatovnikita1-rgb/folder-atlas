const videos = [...document.querySelectorAll('video')];
videos.forEach((video) => {
  video.addEventListener('play', () => {
    videos.forEach((other) => { if (other !== video) other.pause(); });
  });
  const showError = () => {
    if (video.parentElement.querySelector('.media-error')) return;
    const note = document.createElement('p');
    note.className = 'media-error';
    note.textContent = 'Не удалось загрузить видео. ';
    const link = document.createElement('a');
    link.href = video.querySelector('source').getAttribute('src');
    link.textContent = 'Открыть ролик отдельно';
    note.append(link);
    video.after(note);
  };
  video.addEventListener('error', showError);
  video.querySelector('source').addEventListener('error', showError);
});


// Keep native details semantics; enhance only the height transition.
const faqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finishFaqTransitions = [];

document.querySelectorAll('.faq-list details').forEach((details) => {
  if (typeof details.animate !== 'function') return;
  const summary = details.querySelector('summary');
  let targetOpen = details.open;
  let animation = null;

  const settle = () => {
    if (animation) {
      animation.onfinish = null;
      animation.cancel();
      animation = null;
    }
    details.open = targetOpen;
    details.style.removeProperty('height');
    details.style.removeProperty('overflow');
    delete details.dataset.faqTarget;
  };
  finishFaqTransitions.push(() => { if (animation) settle(); });

  summary.addEventListener('click', (event) => {
    event.preventDefault();
    // A native toggle (for example find-in-page) can change open between clicks.
    if (!animation) targetOpen = details.open;
    targetOpen = !targetOpen;
    if (faqMotion.matches) {
      settle();
      return;
    }

    const startHeight = details.getBoundingClientRect().height;
    if (animation) {
      animation.onfinish = null;
      animation.cancel();
    }
    details.open = true;
    details.style.height = 'auto';
    const style = getComputedStyle(details);
    const borders = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    const endHeight = targetOpen
      ? details.getBoundingClientRect().height
      : summary.getBoundingClientRect().height + borders;
    details.style.height = `${startHeight}px`;
    details.style.overflow = 'hidden';
    details.dataset.faqTarget = targetOpen ? 'open' : 'closed';

    const current = details.animate(
      [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
      { duration: targetOpen ? 300 : 220, easing: 'cubic-bezier(.2, 0, 0, 1)', fill: 'both' }
    );
    animation = current;
    current.onfinish = () => { if (animation === current) settle(); };
  });
});

const settleAllFaq = () => finishFaqTransitions.forEach(finish => finish());
window.addEventListener('resize', settleAllFaq);
faqMotion.addEventListener('change', settleAllFaq);
