(() => {
  const figure = document.querySelector('.vortex');
  if (!figure || !window.d3) return;

  const d3 = window.d3;
  const motion = figure.querySelector('[data-motion]');
  const sliders = Array.from(figure.querySelectorAll('input[type="range"]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const tau = Math.PI * 2;
  const radius = 167;
  const svg = d3.select(figure.querySelector('.vortex-flow'));
  const field = svg.append('g').attr('transform', 'translate(320,220)');
  const line = d3.line().curve(d3.curveCatmullRom).digits(2);
  const guides = [0.22, 0.42, 0.62, 0.82, 1];
  const angles = d3.range(97).map(step => step * tau / 96);
  const samples = d3.range(73).map(step => step / 72);
  const streams = d3.range(36).map(index => ({
    angle: index * Math.PI * (3 - Math.sqrt(5)),
    start: 0.27 + (index % 12) * 0.065,
    phase: (index * 0.618034) % 1,
    warm: index % 7 === 0
  }));
  const rings = field.append('g').selectAll('path').data(guides).join('path')
    .attr('class', scale => scale === 1 ? 'vortex-rim' : 'vortex-guide');
  const traces = field.append('g').selectAll('path').data(streams).join('path')
    .attr('class', stream => stream.warm ? 'vortex-trace vortex-warm' : 'vortex-trace');
  field.append('circle').attr('class', 'vortex-drain').attr('r', 9);
  const tracers = field.append('g').selectAll('circle').data(streams).join('circle')
    .attr('class', stream => stream.warm ? 'vortex-particle vortex-warm' : 'vortex-particle')
    .attr('r', stream => stream.warm ? 2.1 : 1.5);

  let circulation, draw, distortion;
  let playing = !reducedMotion.matches;
  let visible = false;
  let elapsed = 0;
  let previousTime = null;
  let frame = null;

  function point(radial, angle) {
    // The boundary deformation fades toward the fixed center of the drain.
    const stretch = 1 + radial * distortion * (0.24 * Math.cos(2 * angle - 0.5) + 0.16 * Math.sin(3 * angle + 0.7));
    const distance = radius * radial * stretch;
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  }

  function streamline(stream, time) {
    const falloff = draw * 3.4;
    const spiral = stream.start * Math.exp(-falloff * time);
    const turn = circulation * (1.8 * time + 2.9 * (time - time * (spiral + stream.start) / 2));
    return point(0.055 + 0.945 * spiral, stream.angle + turn);
  }

  function drawTracers() {
    tracers.each(function (stream) {
      const phase = (stream.phase + elapsed * 0.000105) % 1;
      const [x, y] = streamline(stream, phase);
      const opacity = Math.min(1, phase * 12, (1 - phase) * 12);
      d3.select(this).attr('transform', `translate(${x.toFixed(2)},${y.toFixed(2)})`).attr('opacity', opacity);
    });
  }

  function animate(time) {
    if (previousTime !== null) elapsed += Math.min(time - previousTime, 50);
    previousTime = time;
    drawTracers();
    frame = requestAnimationFrame(animate);
  }

  function updateMotion() {
    motion.setAttribute('aria-label', playing ? 'Pause motion' : 'Play motion');
    motion.dataset.playing = playing;
    if (playing && visible && !document.hidden && (circulation || draw)) {
      if (frame === null) frame = requestAnimationFrame(animate);
    } else if (frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
      previousTime = null;
    }
  }

  function render() {
    [circulation, draw, distortion] = sliders.map(slider => slider.valueAsNumber / 100);
    rings.attr('d', scale => line(angles.map(angle => point(scale, angle))));
    traces.attr('d', stream => line(samples.map(time => streamline(stream, time))));
    tracers.attr('visibility', circulation || draw ? 'visible' : 'hidden');
    drawTracers();
    updateMotion();
  }

  sliders.forEach(slider => slider.addEventListener('input', render));
  motion.addEventListener('click', () => { playing = !playing; updateMotion(); });
  figure.querySelector('[data-reset]').addEventListener('click', () => {
    sliders.forEach(slider => { slider.value = slider.defaultValue; });
    elapsed = 0;
    render();
  });
  reducedMotion.addEventListener('change', event => { if (event.matches) playing = false; updateMotion(); });
  document.addEventListener('visibilitychange', updateMotion);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updateMotion(); })
    .observe(figure.querySelector('.vortex-stage'));

  render();
  figure.hidden = false;
})();
