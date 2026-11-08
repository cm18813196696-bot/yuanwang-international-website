(() => {
  const header = document.querySelector('.nav-in');
  const toggle = document.querySelector('.nav-toggle');
  const pane = document.querySelector('.nav-pane');
  if (!header || !toggle || !pane) return;
  document.documentElement.classList.add('nav-ready');
  const groups = [...pane.querySelectorAll('.nav-group')];
  const closeGroups = () => groups.forEach(group => { group.open = false; });
  const closeMenu = () => {
    header.removeAttribute('data-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('.menu-label').textContent = 'Menu';
    closeGroups();
  };
  toggle.addEventListener('click', () => {
    const opening = !header.hasAttribute('data-menu-open');
    header.toggleAttribute('data-menu-open', opening);
    toggle.setAttribute('aria-expanded', String(opening));
    toggle.querySelector('.menu-label').textContent = opening ? 'Close' : 'Menu';
    if (!opening) closeGroups();
  });
  groups.forEach(group => group.addEventListener('toggle', () => {
    if (group.open) groups.forEach(other => { if (other !== group) other.open = false; });
  }));
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const openGroup = groups.find(group => group.open);
    if (openGroup) { openGroup.open = false; openGroup.querySelector('summary').focus(); }
    else if (header.hasAttribute('data-menu-open')) { closeMenu(); toggle.focus(); }
  });
  pane.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  matchMedia('(max-width: 1100px)').addEventListener('change', closeMenu);
})();
