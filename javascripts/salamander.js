(() => {
  const figure = document.querySelector('.salamander');
  if (!figure) return;

  const limb = figure.querySelector('[data-movable-limb]');
  const root = figure.querySelector('.salamander-root');
  const slider = figure.querySelector('#salamander-root');
  const action = figure.querySelector('[data-limb-action]');
  let missing = false;

  function updateRoot() {
    const x = slider.valueAsNumber;
    const y = 94 + 4 * ((x - 280) / 50) ** 2;
    limb.setAttribute('transform', `translate(${x} ${y})`);
    root.setAttribute('cx', x);
    root.setAttribute('cy', y);
  }

  slider.addEventListener('input', updateRoot);
  action.addEventListener('click', () => {
    missing = !missing;
    limb.classList.toggle('is-missing', missing);
    root.classList.toggle('is-missing', missing);
    slider.disabled = !missing;
    action.textContent = missing ? 'Regrow limb' : 'Remove limb';
  });
  updateRoot();
  figure.hidden = false;
})();
