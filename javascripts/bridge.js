(() => {
  const figure = document.querySelector('.bridge');
  if (!figure || !window.d3) return;

  const d3 = window.d3;
  const build = figure.querySelector('input[type="checkbox"]');
  const position = figure.querySelector('#bridge-position');
  const structure = figure.querySelector('.bridge-built');
  const beam = d3.select(figure.querySelector('.bridge-beam'));
  const load = d3.select(figure.querySelector('.bridge-load'));
  const baseline = 108;
  const span = 430;
  const start = 105;
  const samples = d3.range(81).map(index => index / 80);
  const line = d3.line().digits(2);

  function heightAt(point, weight) {
    // Mirror the right side onto the left half of the point-load solution.
    const x = point <= weight ? point : 1 - point;
    const b = point <= weight ? 1 - weight : weight;
    return baseline + 930 * b * x * (1 - b * b - x * x) / 6;
  }

  function render() {
    const weight = position.valueAsNumber / 100;
    structure.toggleAttribute('hidden', !build.checked);
    position.disabled = !build.checked;
    beam.attr('d', line(samples.map(t => [start + span * t, heightAt(t, weight)])));
    load.attr('cx', start + span * weight).attr('cy', heightAt(weight, weight) - 8);
  }

  build.addEventListener('change', render);
  position.addEventListener('input', render);
  render();
  figure.hidden = false;
})();
