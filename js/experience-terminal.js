const tabs = [...document.querySelectorAll('.terminal-tabs [role="tab"]')];
const panels = [...document.querySelectorAll('.experience-terminal .experience-list article')];
const companies = ['port-authority', 'edgeline-analytics', 'billtrust'];
function select(index) {
  tabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    panels[i].hidden = i !== index;
  });
  document.getElementById('experience-command').textContent = `--company ${companies[index]}`;
}
tabs.forEach((tab, index) => {
  panels[index].id = `experience-output-${index}`;
  panels[index].setAttribute('role', 'tabpanel');
  panels[index].setAttribute('aria-labelledby', tab.id);
  tab.addEventListener('click', () => select(index));
  tab.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); select(next); tabs[next].focus();
  });
});
if (tabs.length) select(0);
