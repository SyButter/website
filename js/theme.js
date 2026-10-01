(() => {
  const key = 'syed-portfolio-theme';
  const root = document.documentElement;
  let theme = 'dark';
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch { /* Theme still works when browser storage is unavailable. */ }

  function applyTheme(value) {
    theme = value;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelectorAll('.theme-toggle').forEach(button => {
      const dark = theme === 'dark';
      button.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
      button.querySelector('.theme-icon').textContent = dark ? '☀' : '☾';
      button.querySelector('.theme-label').textContent = dark ? 'Light' : 'Dark';
    });
  }
  applyTheme(theme);
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(theme);
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.addEventListener('click', () => {
        applyTheme(theme === 'dark' ? 'light' : 'dark');
        try { localStorage.setItem(key, theme); } catch { /* Use in-memory state. */ }
      });
    });
  });
  window.addEventListener('storage', event => {
    if (event.key === key) applyTheme(event.newValue === 'light' ? 'light' : 'dark');
  });
})();
