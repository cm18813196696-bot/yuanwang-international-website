const locale = () => document.body.dataset.lang === 'zh' ? 'zh' : 'en';
const translation = (en, zh) => locale() === 'zh' ? zh : en;

function setText(element, en, zh) {
  element.dataset.en = en;
  element.dataset.zh = zh;
  element.textContent = translation(en, zh);
}

function pressed(buttons, selected) {
  for (const button of buttons) button.setAttribute('aria-pressed', String(button === selected));
}

const stage = document.querySelector('.product-stage');
if (stage) {
  const mount = stage.querySelector('.stage-mount');
  const poster = mount.firstElementChild;
  const status = stage.querySelector('.stage-status span');
  const copy = stage.querySelector('.stage-copy');
  const modelCopy = [copy.dataset.en, copy.dataset.zh];
  const controls = [...stage.querySelectorAll('[data-model-controls]')];
  const motion = stage.querySelector('[data-motion]');
  const water = stage.querySelector('[data-water]');
  const finish = stage.querySelector('[data-finish]');
  const views = [...stage.querySelectorAll('[data-view]')];
  const variants = [...stage.querySelectorAll('[data-variant]')];
  const details = [...stage.querySelectorAll('[data-inspect]')];
  const detailNote = stage.querySelector('.stage-detail-note');
  const renderedPath = stage.dataset.rendered;
  const overview = stage.querySelector('[data-studio-overview]');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const filmPath = stage.dataset.film;
  const filmTools = stage.querySelector('.stage-film-tools');
  const liveTools = stage.querySelector('.stage-live-tools');
  const filmToggle = stage.querySelector('[data-film-toggle]');
  const liveMode = stage.querySelector('[data-live-mode]');
  let model;
  let film;
  let modelUnavailable = false;
  let started = false;
  let playing = !reduceMotion.matches;
  let filmRequested = !reduceMotion.matches;
  let stageVisible = true;
  let dry = false;
  let selectedVariant = stage.dataset.defaultVariant;
  let selectedView = 'full';
  let selectedDetail = null;
  let modelStarting = false;

  function setDry(value) {
    dry = value;
    water?.setAttribute('aria-pressed', String(dry));
    if (water) setText(water, dry ? 'Refill pool' : 'Reveal dry shell', dry ? '恢复水面' : '查看空池结构');
    model?.water(!dry);
  }

  function showDetail(button) {
    selectedDetail = button.dataset.inspect;
    selectedView = selectedDetail;
    overview?.setAttribute('aria-pressed', 'false');
    pressed(details, button);
    pressed(views, null);
    if (detailNote) detailNote.textContent = button.dataset.detail;
    if (!model) {
      if (modelUnavailable && renderedPath) showRendered(selectedDetail);
      else if (!modelUnavailable) startModel();
      return;
    }
    model.view(selectedView);
    setPlaying(false);
    if (selectedDetail !== 'rim') setDry(true);
    setText(status, 'Detail view · ' + button.textContent.trim(), '细节视角 · ' + button.textContent.trim());
  }

  function clearDetail() {
    selectedDetail = null;
    pressed(details, null);
    overview?.setAttribute('aria-pressed', 'true');
    if (detailNote) detailNote.textContent = detailNote.dataset.default;
    setText(status, 'Live 3D · Drag to rotate', '实时三维 · 拖动旋转');
  }

  function setPlaying(value) {
    playing = value;
    model?.play(playing);
    setText(motion, playing ? 'Pause motion' : 'Play motion', playing ? '暂停动画' : '播放动画');
  }

  function refreshFilmButton() {
    const paused = film.paused;
    setText(filmToggle, paused ? 'Play 3D film' : 'Pause 3D film', paused ? '播放三维短片' : '暂停三维短片');
  }

  function playFilmIfVisible() {
    if (!film?.isConnected) return;
    if (filmRequested && stageVisible && !document.hidden) {
      film.play().catch(() => {
        if (film.isConnected) refreshFilmButton();
      });
    } else film.pause();
  }

  function showRendered(name) {
    model?.destroy();
    model = undefined;
    film?.pause();
    const image = document.createElement('img');
    image.className = 'stage-render';
    image.src = renderedPath + '/' + name + '.webp';
    image.alt = 'Suite pool 3D study: ' + ({full:'complete pool',rim:'rounded rim and grab rails',seat:'dry shell, integrated seat and step',jet:'recessed jet fitting',drain:'perforated floor drain'}[name] || name);
    image.addEventListener('error', () => { if (image.isConnected) showFilm(); }, {once:true});
    mount.replaceChildren(image);
    for (const control of controls) control.hidden = true;
    if (filmTools) filmTools.hidden = true;
    if (liveTools) liveTools.hidden = false;
    setText(copy, 'Explore the curved shell, seating and fittings in five rendered 3D views. Select a detail below, or watch the product film.', '通过五个三维渲染视角近看池体、坐台与配件，也可观看产品短片。');
    setText(status, 'Rendered 3D study · Suite pool', '三维渲染展示 · 方形私汤');
  }

  function showFilm() {
    model?.destroy();
    model = undefined;
    for (const control of controls) control.hidden = true;
    if (liveTools) liveTools.hidden = true;
    pressed(details, null);
    overview?.setAttribute('aria-pressed', 'false');
    if (!filmPath) {
      mount.replaceChildren(poster);
      setText(stage.querySelector('#model-title'), 'Water choreography', '水舞编排');
      setText(stage.querySelector('.stage-badge b'), 'Catalogue reference', '手册参考图');
      setText(status, 'Catalogue reference', '手册参考图');
      return;
    }
    if (!film) {
      film = document.createElement('video');
      film.src = filmPath;
      film.poster = poster.src;
      film.muted = true;
      film.defaultMuted = true;
      film.loop = true;
      film.playsInline = true;
      film.preload = 'metadata';
      film.setAttribute('aria-label', '3D product animation / 产品三维动画');
      film.addEventListener('play', refreshFilmButton);
      film.addEventListener('pause', refreshFilmButton);
      film.addEventListener('error', () => {
        if (!film.isConnected) return;
        mount.replaceChildren(poster);
        filmToggle.hidden = true;
        setText(status, 'Reference illustration', '参考效果图');
      });
    }
    mount.replaceChildren(film);
    const filmCopy = stage.dataset.model === 'steel'
      ? ['Watch the camera travel across the rolled rim, water surface and brushed steel.',
         '跟随镜头近看圆润池沿、流动水面和拉丝钢面。']
      : ['Watch the warm arch and underwater light play across the blue pool as the camera moves.',
         '跟随镜头观察暖色光环和水下灯光在蓝色池面上的变化。'];
    setText(copy, ...filmCopy);
    filmTools.hidden = false;
    liveMode.hidden = modelUnavailable;
    setText(status, 'Rendered 3D film · Concept study', '三维渲染短片 · 概念展示');
    refreshFilmButton();
    playFilmIfVisible();
  }

  function fallback() {
    modelUnavailable = true;
    if (renderedPath) showRendered(selectedDetail || 'full');
    else showFilm();
  }

  async function startModel() {
    if (modelStarting) return;
    modelStarting = true;
    if (liveMode) liveMode.disabled = true;
    try {
      const {mountModel} = await import('./spa-model.js?v=steel-detail-2');
      film?.pause();
      model = mountModel(mount, stage.dataset.model, selectedVariant, {
        reducedMotion: reduceMotion.matches,
        onLost: fallback,
      });
      if (filmTools) filmTools.hidden = true;
      if (liveTools) liveTools.hidden = false;
      setText(copy, ...modelCopy);
      for (const control of controls) control.hidden = false;
      pressed(variants, variants.find(button => button.dataset.variant === selectedVariant));
      pressed(views, views.find(button => button.dataset.view === selectedView));
      setText(status, 'Live 3D · Drag to rotate', '实时三维 · 拖动旋转');
      setPlaying(playing);
      if (finish) model.finish(finish.value);
      model.water(!dry);
      model.view(selectedView);
      if (selectedDetail) showDetail(details.find(button => button.dataset.inspect === selectedDetail));
    } catch (error) {
      console.warn('Interactive product viewer is unavailable.', error);
      fallback();
    } finally {
      modelStarting = false;
      if (liveMode) liveMode.disabled = false;
    }
  }

  function canRenderModel() {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2');
      context?.getExtension('WEBGL_lose_context')?.loseContext();
      return Boolean(context);
    } catch {
      return false;
    }
  }

  const nearViewport = new IntersectionObserver(([entry]) => {
    stageVisible = entry.isIntersecting;
    if (!started && stageVisible) {
      started = true;
      modelUnavailable = !canRenderModel();
      if (modelUnavailable && renderedPath) showRendered('full');
      else if (modelUnavailable || (filmPath && !stage.hasAttribute('data-prefer-live'))) showFilm();
      else startModel();
    }
    playFilmIfVisible();
  }, {rootMargin: '100px'});
  nearViewport.observe(stage);
  document.addEventListener('visibilitychange', playFilmIfVisible);
  liveMode?.addEventListener('click', startModel);
  stage.querySelector('[data-film-mode]')?.addEventListener('click', showFilm);
  filmToggle?.addEventListener('click', () => {
    filmRequested = film.paused;
    playFilmIfVisible();
  });
  motion.addEventListener('click', () => setPlaying(!playing));
  reduceMotion.addEventListener('change', event => {
    filmRequested = !event.matches;
    playFilmIfVisible();
    setPlaying(!event.matches);
  });
  for (const button of views) button.addEventListener('click', () => {
    selectedView = button.dataset.view;
    model?.view(selectedView);
    clearDetail();
    pressed(views, button);
  });
  for (const button of details) button.addEventListener('click', () => showDetail(button));
  overview?.addEventListener('click', () => {
    selectedView = 'full';
    clearDetail();
    if (model) {
      model.view('full');
      setDry(false);
      setPlaying(!reduceMotion.matches);
      pressed(views, views[0]);
    } else if (modelUnavailable) showRendered('full');
    else startModel();
  });
  for (const button of variants) button.addEventListener('click', () => {
    selectedVariant = button.dataset.variant;
    selectedView = 'full';
    model?.variant(selectedVariant);
    if (finish) model?.finish(finish.value);
    model?.water(!dry);
    model?.view('full');
    clearDetail();
    pressed(views, views[0]);
    pressed(variants, button);
  });
  for (const button of stage.querySelectorAll('[data-zoom]')) {
    button.addEventListener('click', () => model?.zoom(button.dataset.zoom === 'in' ? -.4 : .4));
  }
  finish?.addEventListener('change', () => model?.finish(finish.value));
  water?.addEventListener('click', () => {
    setDry(!dry);
  });
}

const catalogue = document.querySelector('.catalog-gallery');
const viewer = document.querySelector('.catalog-viewer');
if (catalogue && viewer) {
  const filters = [...catalogue.querySelectorAll('[data-filter-category]')];
  const groups = [...catalogue.querySelectorAll('[data-category]')];
  const previous = viewer.querySelector('[data-viewer-previous]');
  const next = viewer.querySelector('[data-viewer-next]');
  const zoom = viewer.querySelector('[data-viewer-zoom]');
  const close = viewer.querySelector('form button');
  const image = viewer.querySelector('img');
  const scrollArea = viewer.querySelector('.viewer-image');
  const caption = viewer.querySelector('#viewer-caption');
  let links = [];
  let index = 0;
  let opener;

  function select(filter) {
    pressed(filters, filter);
    const group = groups.find(item => item.dataset.category === filter.dataset.filterCategory);
    for (const item of groups) item.hidden = item !== group;
    links = [...group.querySelectorAll('[data-gallery-image]')];
  }

  function render() {
    const link = links[index];
    const thumbnail = link.querySelector('img');
    const label = translation(thumbnail.dataset.labelEn, thumbnail.dataset.labelZh);
    image.src = link.href;
    image.alt = label;
    caption.textContent = label;
    previous.disabled = index === 0;
    next.disabled = index === links.length - 1;
    zoom.setAttribute('aria-pressed', 'false');
    scrollArea.classList.remove('is-zoomed');
    scrollArea.scrollTo(0, 0);
  }

  function step(delta) {
    const candidate = index + delta;
    if (candidate < 0 || candidate >= links.length) return;
    index = candidate;
    render();
  }

  catalogue.querySelector('.catalog-filters').hidden = false;
  const fromHash = location.hash.startsWith('#gallery-') && location.hash.slice('#gallery-'.length);
  select(filters.find(item => item.dataset.filterCategory === fromHash) ?? filters[0]);
  for (const button of filters) {
    button.setAttribute('aria-controls', 'gallery-' + button.dataset.filterCategory);
    button.addEventListener('click', () => select(button));
  }
  catalogue.addEventListener('click', event => {
    const link = event.target.closest('[data-gallery-image]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || !viewer.showModal) return;
    index = links.indexOf(link);
    if (index < 0) return;
    event.preventDefault();
    opener = link;
    viewer.showModal();
    render();
    close.focus();
  });
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  zoom.addEventListener('click', () => {
    const zoomed = scrollArea.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-pressed', String(zoomed));
    if (!zoomed) scrollArea.scrollTo(0, 0);
  });
  viewer.addEventListener('keydown', event => {
    if (scrollArea.classList.contains('is-zoomed')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      step(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  viewer.addEventListener('click', event => {
    if (event.target === viewer) {
      const bounds = viewer.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
    }
  });
  viewer.addEventListener('close', () => {
    image.removeAttribute('src');
    opener?.focus();
  });
}

function localizeAccessibility() {
  for (const element of document.querySelectorAll('[data-label-en][data-label-zh]')) {
    const label = translation(element.dataset.labelEn, element.dataset.labelZh);
    if (element.tagName === 'IMG') element.alt = label;
    else element.setAttribute('aria-label', label);
  }
}
localizeAccessibility();
new MutationObserver(localizeAccessibility).observe(document.body, {
  attributes: true, attributeFilter: ['data-lang'],
});
