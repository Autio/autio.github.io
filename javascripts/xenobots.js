(() => {
  const figure = document.querySelector('.xenobots');
  if (!figure || !window.d3) return;

  const d3 = window.d3;
  const stage = figure.querySelector('.xenobot-stage');
  const svg = d3.select(stage.querySelector('.xenobot-view'));
  const motion = figure.querySelector('[data-motion]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const bodies = d3.range(8);
  const tau = 2 * Math.PI;
  const loop = 11;
  const sampleTimes = d3.range(16).map(index => (index - 15) * 0.075);
  const trailLine = d3.line().curve(d3.curveCatmullRom).digits(1);
  const contourLine = d3.line().curve(d3.curveCatmullRomClosed).digits(1);
  const outlines = [
    'M-10 1C-13-5-7-10-2-9C4-12 10-7 9-4C15-1 12 6 6 8C3 12-2 9-4 8C-9 11-13 5-10 1Z',
    'M-11 1C-12-4-6-9 0-9C5-12 10-7 11-2C14 3 9 9 3 9C-3 12-11 7-11 1Z'
  ];

  const trails = svg.append('g').selectAll('path').data(bodies).join('path')
    .attr('class', 'xenobot-trail');
  const livingContour = svg.append('path').attr('class', 'xenobot-contour');
  const liftedContour = svg.append('path').attr('class', 'xenobot-lift');
  const arrow = svg.append('path').attr('class', 'xenobot-return')
    .attr('d', 'M445 233Q390 273 315 229').attr('marker-end', 'url(#xenobot-arrowhead)');
  const shapes = svg.append('g').selectAll('g').data(bodies).join('g');
  shapes.append('path').attr('class', 'xenobot-silhouette').attr('d', index => outlines[index % 2]);
  shapes.append('path').attr('class', 'xenobot-detail').attr('d', 'M-5 1Q-4-4 1-4M2 5Q6 4 6 1');

  let playing = !reducedMotion.matches;
  let visible = false;
  let elapsed = 0;
  let timer;

  function point(index, seconds) {
    const angle = tau * index / bodies.length + seconds * 0.25 + 0.22 * Math.sin(seconds * 0.8 + index);
    const radius = 0.86 + 0.24 * Math.sin(index * 2.3 + seconds * 0.55);
    return [211 + Math.cos(angle) * 100 * radius, 155 + Math.sin(angle) * 88 * radius];
  }

  function contourAt(seconds) {
    const envelope = bodies.map(index => {
      const [x, y] = point(index, seconds);
      return [211 + 1.25 * (x - 211), 155 + 1.25 * (y - 155)];
    });
    return contourLine(d3.polygonHull(envelope));
  }

  function render(seconds) {
    const phase = seconds % loop;
    const progress = d3.easeCubicInOut(Math.max(0, Math.min(1, (phase - 2.2) / 2.3)));
    const opacity = Math.min(1, Math.max(0, (phase - 2.2) * 2), Math.max(0, (loop - phase) * 1.2));
    trails.attr('d', index => trailLine(sampleTimes.map(offset => point(index, seconds + offset))));
    shapes.attr('transform', index => {
      const [x, y] = point(index, seconds);
      const [nextX, nextY] = point(index, seconds + 0.05);
      const rotation = Math.atan2(nextY - y, nextX - x) * 180 / Math.PI;
      return `translate(${x},${y}) rotate(${rotation})`;
    });
    livingContour.attr('d', contourAt(seconds));
    liftedContour.attr('d', contourAt(seconds - phase + 2.2))
      .attr('transform', `translate(${progress * 259},${progress * -8})`).attr('opacity', opacity);
    arrow.attr('opacity', opacity * Math.max(0, Math.min(1, (phase - 4.5) * 1.2)));
  }

  function updateMotion() {
    motion.setAttribute('aria-label', playing ? 'Pause motion' : 'Play motion');
    motion.dataset.playing = playing;
    if (playing && visible && !document.hidden) {
      if (timer) return;
      const start = elapsed;
      timer = d3.timer(time => { elapsed = start + time / 1000; render(elapsed); });
    } else {
      timer?.stop();
      timer = undefined;
    }
  }

  motion.addEventListener('click', () => { playing = !playing; updateMotion(); });
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      playing = false;
      elapsed = 6.5;
      render(elapsed);
    }
    updateMotion();
  });
  document.addEventListener('visibilitychange', updateMotion);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updateMotion(); }).observe(stage);
  if (!playing) elapsed = 6.5;
  render(elapsed);
  updateMotion();
  figure.hidden = false;
})();
