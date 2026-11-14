/* Optional, local-only type comparison; the normal landing remains the baseline. */
(() => {
  const url = new URL(window.location.href);
  if (!url.searchParams.has('fonts')) return;

  const choices = [
    { id: 'original', name: 'Nunito Sans', note: 'Прежний', sample: 'Папки', family: '"Nunito Sans"', weight: 800 },
    { id: 'golos-text', name: 'Golos Text', note: 'Спокойный, собранный', sample: 'Папки', family: '"Golos Text"', weight: 650 },
    { id: 'oswald', name: 'Oswald', note: 'Узкий, плакатный', sample: 'Папки', family: 'Oswald', weight: 500 },
    { id: 'pt-serif', name: 'PT Serif', note: 'Выбран · книжный, бумажный', sample: 'Папки', family: '"PT Serif"', weight: 400 },
    { id: 'ibm-plex-mono', name: 'IBM Plex Mono', note: 'Технический, точный', sample: 'Папки', family: '"IBM Plex Mono"', weight: 500 },
    { id: 'unbounded', name: 'Unbounded', note: 'Широкий, выразительный', sample: 'Папки', family: 'Unbounded', weight: 450 }
  ];
  let selected = choices.find(choice => choice.id === url.searchParams.get('fonts')) || choices.find(choice => choice.id === 'pt-serif');
  let allText = url.searchParams.get('scope') === 'all' && selected.id !== 'original';
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet';
  sheet.href = 'font-preview.css';
  document.head.append(sheet);

  const panel = document.createElement('aside');
  panel.className = 'font-preview';
  panel.setAttribute('aria-label', 'Примерка шрифтов');
  panel.innerHTML = `
    <details class="font-preview-panel" open>
      <summary class="font-preview-summary">
        <span>Примерка шрифтов <span class="font-preview-current"></span></span>
        <span class="font-preview-toggle" aria-hidden="true"></span>
      </summary>
      <div class="font-preview-content">
        <fieldset class="font-options">
          <legend class="visually-hidden">Шрифт страницы</legend>
          ${choices.map((choice, index) => `
            <label class="font-option" style='--sample-family: ${choice.family}; --sample-weight: ${choice.weight}'>
              <input type="radio" name="preview-font" value="${choice.id}" aria-label="${choice.name}${index === 0 ? ' — прежний' : ''}">
              <span class="font-option-name">${index === 0 ? '00' : '0' + index} / ${choice.name}</span>
              <span class="font-option-sample" aria-hidden="true">${choice.sample}</span>
              <span class="font-option-note">${choice.note}</span>
            </label>`).join('')}
        </fieldset>
        <div class="font-preview-footer">
          <label class="font-preview-scope"><input type="checkbox" name="preview-all"> Весь текст</label>
          <span class="font-preview-hint">По умолчанию — заголовки и название. Основной текст — Inter.</span>
          <a class="font-preview-exit">Без примерки ↗</a>
        </div>
        <p class="font-preview-status" role="status" aria-live="polite"></p>
      </div>
    </details>`;
  document.querySelector('.page-shell').before(panel);
  const scope = panel.querySelector('[name="preview-all"]');
  const current = panel.querySelector('.font-preview-current');
  const status = panel.querySelector('.font-preview-status');
  const exitUrl = new URL(url);
  exitUrl.searchParams.delete('fonts');
  exitUrl.searchParams.delete('scope');
  panel.querySelector('.font-preview-exit').href = exitUrl.href;

  function applySelection(writeUrl = true) {
    document.documentElement.dataset.fontPreview = selected.id;
    document.documentElement.dataset.fontScope = allText ? 'all' : 'headings';
    panel.querySelector(`[value="${selected.id}"]`).checked = true;
    scope.checked = allText;
    scope.disabled = selected.id === 'original';
    current.textContent = ' / ' + selected.name;
    status.textContent = selected.id === 'original'
      ? 'Прежний вариант: Nunito Sans в заголовках, Inter в основном тексте.'
      : `${selected.name} · ${allText ? 'весь текст страницы' : 'заголовки и название'}. ${selected.note}.`;
    if (!writeUrl) return;
    const url = new URL(window.location.href);
    url.searchParams.set('fonts', selected.id);
    if (allText) url.searchParams.set('scope', 'all');
    else url.searchParams.delete('scope');
    // A file:// preview may restrict History; comparison still works in place.
    try { window.history.replaceState(null, '', url); } catch (_) { /* no persistence needed */ }
  }

  panel.addEventListener('change', event => {
    if (event.target.name === 'preview-font') {
      selected = choices.find(choice => choice.id === event.target.value);
      if (selected.id === 'original') allText = false;
    } else if (event.target === scope) {
      allText = scope.checked;
    } else return;
    applySelection();
  });
  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    selected = choices.find(choice => choice.id === params.get('fonts')) || choices.find(choice => choice.id === 'pt-serif');
    allText = params.get('scope') === 'all' && selected.id !== 'original';
    applySelection(false);
  });
  applySelection();
})();
