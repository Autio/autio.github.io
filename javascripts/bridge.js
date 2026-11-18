(() => {
  const figure = document.querySelector('.bridge');
  if (!figure || !window.d3) return;

  const d3 = window.d3;
  const build = figure.querySelector('.bridge-build');
  const load = figure.querySelector('#bridge-load');
  const arrow = d3.select(figure.querySelector('.bridge-load-arrow'));
  const beam = d3.select(figure.querySelector('.bridge-beam'));
  const supports = [133, 507];
  const ends = [103, 537];
  const baseline = 112;
  const depth = 14;
  const samples = [ends[0], ...d3.range(81).map(i => supports[0] + (supports[1] - supports[0]) * i / 80), ends[1]];
  const deck = d3.area().x(point => point.x).y0(point => point.y).y1(point => point.y + depth).digits(2);
  let built = false;

  function render() {
    const fraction = load.valueAsNumber / 100;
    const deflection = 29 * fraction;
    const halfSpan = (supports[1] - supports[0]) / 2;
    beam.attr('d', deck(samples.map(x => {
      const distance = Math.min(x - supports[0], supports[1] - x) / halfSpan;
      // The bend is fixed at the bearings and continues into the short overhangs.
      const ordinate = distance < 0 ? 1.5 * distance : (3 * distance - distance ** 3) / 2;
      return { x, y: baseline + deflection * ordinate };
    })));

    const tip = baseline + deflection - 5;
    const start = tip - (16 + 25 * fraction);
    arrow.attr('hidden', fraction === 0 ? '' : null)
      .attr('d', `M320 ${start}V${tip}m-5 -6l5 6 5 -6`);
  }

  build.addEventListener('click', () => {
    built = !built;
    figure.toggleAttribute('data-built', built);
    load.disabled = !built;
    build.textContent = built ? 'Back to plan' : 'Build bridge';
    render();
  });
  load.addEventListener('input', render);
  render();
  figure.querySelector('.bridge-controls').hidden = false;
})();
