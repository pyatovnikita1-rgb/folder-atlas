// Russian remains complete in HTML; this local dictionary enhances the same page.
const english = {
  "title": "Folder Atlas — see what’s taking up space on your Mac",
  "description": "Folder Atlas is a local disk analyzer for Mac. Explore folders and files in a tree and a clear visual map. Find what takes up space and reveal it in Finder.",
  "skip": "Skip to content",
  "brandLabel": "Folder Atlas — back to top",
  "navigationLabel": "Main navigation",
  "navHow": "How it works",
  "navPlans": "Roadmap",
  "navQuestions": "Questions",
  "languageLabel": "Page language",
  "heroTitle": "See what’s taking up space on your Mac",
  "heroDescription": "Find large folders and files on the map. Ask Codex what you could clean up.",
  "download": "Download for macOS",
  "platform": "For Macs with Apple Silicon",
  "version": "Version 0.3.9 · ZIP",
  "overviewLabel": "Review disk usage with Codex, 30 seconds, no sound, Russian interface",
  "walkthroughLabel": "Folder Atlas in action, 27 seconds, no sound, Russian interface",
  "videoFallback": "Your browser does not support embedded video. ",
  "overviewOpen": "Open the Codex review",
  "walkthroughOpen": "Open the demo",
  "overviewCaption": "Review disk usage with Codex",
  "overviewDuration": "· 30 seconds",
  "walkthroughCaption": "Real actions",
  "walkthroughDuration": "· 27 seconds",
  "silent": "No sound",
  "overviewDescription": "Click “Review with Codex” and send the prepared request. In this Russian demo, Codex finds two versions of an installer and asks which one to keep.",
  "stepsTitle": "Three steps to understanding your disk",
  "stepChoose": "Choose a disk<br>or folder",
  "stepFind": "Find what takes<br>up space",
  "stepRemove": "Remove what you don’t need",
  "walkthroughTitle": "From the big picture<br>to the right file",
  "walkthroughCopy": "Select a folder on the map to see which files take up the most space.",
  "walkthroughDescription": "Explore the map and file tree using demo data from an earlier build with a Russian interface.",
  "roadmapEyebrow": "Roadmap",
  "roadmapTitle": "What’s next for Folder Atlas",
  "roadmapDescription": "Building tools around your disk map.",
  "roadmapTiming": "No dates are set yet. Priorities may change.",
  "roadmapAlt": "Three groups of roadmap tiles: MCP, logs and scan history.",
  "inProgress": "In progress",
  "planned": "Planned",
  "mcpTitle": "First launch<br> with Codex",
  "mcpCopy": "We’re testing the MCP connection and folder permission prompts on a fresh Mac account.",
  "feedbackTitle": "Feedback<br> and error logs",
  "feedbackCopy": "Ask a question or send diagnostic information after reviewing it.",
  "historyTitle": "Scan history<br> and comparison",
  "historyCopy": "See what appeared, grew or disappeared on your disk.",
  "faqEyebrow": "Know before your first scan",
  "faqTitle": "A few things<br>worth knowing.",
  "faqDeleteQuestion": "Does Folder Atlas delete files for me?",
  "faqDeleteAnswer": "No. It helps you find large folders and files and reveal them in Finder. You decide what to keep and what to remove. You delete files manually in Finder.",
  "faqPrivacyQuestion": "Are my files sent anywhere?",
  "faqPrivacyAnswer": "Analysis runs locally on your Mac. Folder Atlas reads names, folder structure and metadata without opening file contents. The scan result is saved on your computer.",
  "faqMcpAnswer": "If you connect Codex or another agent through MCP, it can request names, paths and sizes from the saved scan.",
  "faqSizeQuestion": "Is the size on the map the space I’ll free up?",
  "faqSizeAnswer": "The map shows the allocated blocks of files and folders. It does not predict how much space deletion will free: the disk may contain shared blocks, compressed files and system snapshots.",
  "faqAccessAnswer": "Inaccessible folders are marked separately, so results may be incomplete. An unknown size does not mean a folder is empty.",
  "faqScanQuestion": "Does scanning start automatically?",
  "faqScanAnswer": "A scan starts when you request one. Choose a disk or folder in the app, or ask Codex to scan it while Folder Atlas is open. You can reopen a saved scan at any time.",
  "ctaTitle": "Runs locally on your Mac.",
  "footerTagline": "Room for clarity.",
  "backTop": "Back to top"
};
const languageKey = 'folder-atlas.website.language';
const isLanguage = (value) => value === 'ru' || value === 'en';
let currentLanguage = 'ru';
const localizedNodes = [...document.querySelectorAll('[data-i18n]')].map((element) => {
  const attribute = element.dataset.i18nAttr;
  return { element, attribute, russian: attribute ? element.getAttribute(attribute) : element.innerHTML };
});
const mediaMessages = {
  ru: { error: 'Не удалось загрузить видео. ', open: 'Открыть ролик отдельно' },
  en: { error: 'The video could not be loaded. ', open: 'Open the video separately' }
};
function refreshMediaErrors() {
  document.querySelectorAll('.media-error').forEach((note) => {
    note.querySelector('span').textContent = mediaMessages[currentLanguage].error;
    note.querySelector('a').textContent = mediaMessages[currentLanguage].open;
  });
}

const videos = [...document.querySelectorAll('video')];
videos.forEach((video) => {
  video.addEventListener('play', () => {
    videos.forEach((other) => { if (other !== video) other.pause(); });
  });
  const showError = () => {
    if (video.parentElement.querySelector('.media-error')) return;
    const note = document.createElement('p');
    note.className = 'media-error';
    const message = document.createElement('span');
    note.append(message);
    const link = document.createElement('a');
    link.href = video.querySelector('source').getAttribute('src');
    note.append(link);
    video.after(note);
    refreshMediaErrors();
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


function preferredLanguage() {
  const query = new URLSearchParams(window.location.search).get('lang');
  if (isLanguage(query)) return query;
  try {
    const stored = window.localStorage.getItem(languageKey);
    if (isLanguage(stored)) return stored;
  } catch (_) { /* The Russian page also works when storage is unavailable. */ }
  return 'ru';
}

function applyLanguage(language, remember = false) {
  if (!isLanguage(language)) return;
  // Settle to the last requested FAQ state before its text changes height.
  settleAllFaq();
  currentLanguage = language;
  document.documentElement.lang = language;
  localizedNodes.forEach(({ element, attribute, russian }) => {
    const value = language === 'en' ? english[element.dataset.i18n] : russian;
    if (value === undefined) return;
    if (attribute) element.setAttribute(attribute, value);
    // Only static copy is replaced; video/details and their state stay intact.
    else element.innerHTML = value;
  });
  const subtitles = document.querySelector('#overview-video track[srclang="en"]');
  if (subtitles) subtitles.track.mode = language === 'en' ? 'showing' : 'disabled';
  const artwork = document.querySelector('.roadmap-art');
  const source = language === 'en' ? 'assets/roadmap-map-en.png' : 'assets/roadmap-map.png';
  if (artwork.getAttribute('src') !== source) artwork.setAttribute('src', source);
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });
  refreshMediaErrors();
  if (!remember) return;
  try { window.localStorage.setItem(languageKey, language); } catch (_) { /* Selection still applies for this visit. */ }
  const url = new URL(window.location.href);
  url.searchParams.set('lang', language);
  try { window.history.replaceState(null, '', url); } catch (_) { /* file:// may restrict History. */ }
}

document.querySelectorAll('[data-language]').forEach((button) => {
  button.addEventListener('click', () => applyLanguage(button.dataset.language, true));
});
window.addEventListener('popstate', () => applyLanguage(preferredLanguage()));
applyLanguage(preferredLanguage());
document.querySelector('.language-switch').hidden = false;
