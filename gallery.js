(() => {
  'use strict';

  const gallery = document.querySelector('#gallery');
  const grid = gallery?.querySelector('#gallery-grid');
  if (!grid) return;

  const items = [...grid.querySelectorAll('.gallery-item[data-gallery-src]')];
  const more = gallery.querySelector('#gallery-more');
  const status = gallery.querySelector('#gallery-status');
  const pageSize = 12;
  let visible = Math.min(pageSize, items.length);

  function updateVisible() {
    items.forEach((item, index) => { item.hidden = index >= visible; });
    if (status) status.textContent = `Показано ${visible} из ${items.length}`;
    if (more) more.hidden = visible >= items.length;
  }

  if (more) {
    more.addEventListener('click', () => {
      const firstNew = visible;
      visible = Math.min(visible + pageSize, items.length);
      updateVisible();
      // Keep the reading position at the first photograph just revealed.
      items[firstNew]?.focus({preventScroll: true});
      items[firstNew]?.scrollIntoView({block: 'nearest', behavior: 'instant'});
    });
    updateVisible();
  } else if (status) {
    status.textContent = `Показано ${items.length} из ${items.length}`;
  }

  const dialog = document.querySelector('#photo-dialog');
  const view = dialog?.querySelector('#photo-view');
  const caption = dialog?.querySelector('#photo-caption');
  const counter = dialog?.querySelector('#photo-counter');
  const close = dialog?.querySelector('.photo-close');
  const previous = dialog?.querySelector('.photo-prev');
  const next = dialog?.querySelector('.photo-next');
  if (!dialog || !view || typeof dialog.showModal !== 'function') return;

  let loading = dialog.querySelector('#photo-loading');
  if (!loading) {
    loading = document.createElement('p');
    loading.id = 'photo-loading';
    loading.className = 'photo-loading';
    loading.setAttribute('role', 'status');
    dialog.append(loading);
  }
  let current = 0;
  let opener = null;
  let request = 0;
  let outsidePress = false;
  let addedBodyLock = false;

  function show(index) {
    current = (index + items.length) % items.length;
    const item = items[current];
    const source = item.dataset.gallerySrc;
    const description = item.dataset.galleryAlt || item.querySelector('img')?.alt || 'Фотография NEW DENT CLINIC';
    const pending = ++request;
    if (caption) caption.textContent = description;
    if (counter) counter.textContent = `${current + 1} / ${items.length}`;
    dialog.classList.add('is-loading');
    view.setAttribute('aria-busy', 'true');
    loading.textContent = 'Загрузка фотографии…';

    const image = new Image();
    image.decoding = 'async';
    image.onload = async () => {
      try { await image.decode(); } catch { /* A loaded image can still be displayed. */ }
      if (pending !== request || !dialog.open) return;
      view.src = source;
      view.alt = description;
      view.removeAttribute('aria-busy');
      dialog.classList.remove('is-loading');
      loading.textContent = '';
    };
    image.onerror = () => {
      if (pending !== request || !dialog.open) return;
      view.removeAttribute('src');
      view.alt = description;
      view.removeAttribute('aria-busy');
      dialog.classList.remove('is-loading');
      loading.textContent = 'Не удалось загрузить фотографию. Откройте соседнюю или попробуйте ещё раз.';
    };
    image.src = source;
  }

  items.forEach((item, index) => {
    item.setAttribute('aria-haspopup', 'dialog');
    item.setAttribute('aria-controls', dialog.id);
    item.addEventListener('click', () => {
      opener = item;
      show(index);
      if (!dialog.open) {
        dialog.showModal();
        addedBodyLock = !document.body.classList.contains('photo-locked');
        document.body.classList.add('photo-locked');
      }
      close?.focus({preventScroll: true});
    });
  });

  close?.addEventListener('click', () => dialog.close());
  previous?.addEventListener('click', () => show(current - 1));
  next?.addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
  });
  const isOutside = event => {
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  };
  dialog.addEventListener('pointerdown', event => { outsidePress = event.target === dialog && isOutside(event); });
  dialog.addEventListener('click', event => {
    if (outsidePress && event.target === dialog && isOutside(event)) dialog.close();
    outsidePress = false;
  });
  dialog.addEventListener('close', () => {
    ++request;
    if (addedBodyLock) document.body.classList.remove('photo-locked');
    addedBodyLock = false;
    dialog.classList.remove('is-loading');
    view.removeAttribute('aria-busy');
    loading.textContent = '';
    if (opener?.isConnected) opener.focus({preventScroll: true});
  });
})();
