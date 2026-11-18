(() => {
  const figure = document.querySelector('.bridge');
  if (!figure) return;

  const action = figure.querySelector('.bridge-build');
  const note = figure.querySelector('.bridge-note');
  const steps = {
    plan: { next: 'built', action: 'Build bridge', note: '' },
    built: { next: 'unsupported', action: 'Remove right support', note: '' },
    unsupported: { next: 'plan', action: 'Back to plan', note: 'The drawing specifies a span. Its supports make it load-bearing.' }
  };

  action.addEventListener('click', () => {
    const next = steps[figure.dataset.state].next;
    figure.dataset.state = next;
    action.textContent = steps[next].action;
    note.textContent = steps[next].note;
  });

  figure.querySelector('.bridge-controls').hidden = false;
})();
