(() => {
  const figure = document.querySelector('.bridge');
  if (!figure || !window.d3) return;

  const d3 = window.d3;
  const build = figure.querySelector('input[type="checkbox"]');
  const load = figure.querySelector('#bridge-load');
  const structure = figure.querySelector('.bridge-built');
  const arrow = d3.select(figure.querySelector('.bridge-load-arrow'));
  const beam = d3.select(figure.querySelector('.bridge-beam'));
  const baseline = 108;
  const line = d3.line().digits(2);
  const samples = d3.range(81).map(index => index / 80);

  function render() {
    const fraction = load.valueAsNumber / 100;
    const deflection = 25 * fraction;
    structure.toggleAttribute('hidden', !build.checked);
    load.disabled = !build.checked;
    beam.attr('d', line(samples.map(point => {
      const x = Math.min(point, 1 - point) * 2;
      return [105 + 430 * point, baseline + deflection * (3 * x - x ** 3) / 2];
    })));
    arrow.attr('hidden', fraction === 0 ? '' : null)
      .attr('transform', `translate(0,${16 + deflection})`).attr('opacity', 0.45 + fraction * 0.55);
  }

  build.addEventListener('change', render);
  load.addEventListener('input', render);
  render();
  figure.hidden = false;
})();
