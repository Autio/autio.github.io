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
  const contourStep = 0.2;
  const bearings = d3.range(48).map(index => {
    const angle = tau * index / 48;
    return [Math.cos(angle), Math.sin(angle)];
  });
  const sampleTimes = d3.range(16).map(index => (index - 15) * 0.075);
  const trailLine = d3.line().curve(d3.curveCatmullRom).digits(1);
  const contourLine = d3.line().curve(d3.curveCatmullRomClosed).digits(1);
  const outlines = [
    'M-14 2C-16-5-10-12-4-12C1-14 10-12 13-6C17-1 14 7 9 10C5 12 2 8 1 5C0 2-2 2-3 6C-4 11-7 14-11 12C-15 10-15 6-14 2Z',
    'M-14 1C-15-5-10-11-5-12C0-14 4-10 7-10C13-10 16-5 15 1C16 8 10 13 4 12C0 14-4 11-6 9C-10 11-14 7-14 1Z',
    'M-13-4C-12-12-5-14 0-11C5-14 13-10 14-3C18 2 14 8 9 9C5 13-2 14-5 10C-11 12-15 7-14 1Z'
  ];

  const glow = svg.select('defs').append('radialGradient').attr('id', 'xenobot-warmth');
  glow.append('stop').attr('offset', '0%').attr('stop-color', '#bd6746').attr('stop-opacity', 0.85);
  glow.append('stop').attr('offset', '100%').attr('stop-color', '#d69670').attr('stop-opacity', 0);
  const trails = svg.append('g').selectAll('path').data(bodies).join('path')
    .attr('class', 'xenobot-trail');
  const livingContour = svg.append('path').attr('class', 'xenobot-contour');
  const lifted = svg.append('g');
  const liftedContour = lifted.append('path').attr('class', 'xenobot-lift');
  const landmarks = lifted.selectAll('circle').data(d3.range(0, 48, 8)).join('circle')
    .attr('class', 'xenobot-landmark').attr('r', 1.65);
  const arrow = svg.append('path').attr('class', 'xenobot-return')
    .attr('d', 'M445 233Q390 273 315 229').attr('marker-end', 'url(#xenobot-arrowhead)');
  const shapes = svg.append('g').selectAll('g').data(bodies).join('g');
  shapes.append('path').attr('class', 'xenobot-silhouette').attr('d', index => outlines[index % outlines.length]);
  const warmth = shapes.append('ellipse').attr('fill', 'url(#xenobot-warmth)')
    .attr('cx', -4).attr('cy', -2).attr('rx', 8.5).attr('ry', 6.5);
  shapes.append('path').attr('class', 'xenobot-detail')
    .attr('d', 'M-10-2Q-8-8-2-8M5-7Q10-6 10-2M6 1Q9 4 6 7M-10 3l1 3');

  let playing = !reducedMotion.matches;
  let visible = false;
  let elapsed = 0;
  let timer;

  function point(index, seconds) {
    const angle = tau * index / bodies.length + seconds * 0.25 + 0.22 * Math.sin(seconds * 0.8 + index);
    const radius = 0.86 + 0.24 * Math.sin(index * 2.3 + seconds * 0.55);
    return [211 + Math.cos(angle) * 100 * radius, 155 + Math.sin(angle) * 88 * radius];
  }

  function contourSample(seconds) {
    const positions = bodies.map(index => point(index, seconds));
    // Blend the bodies that support each bearing, so a change of outermost body
    // cannot add or remove a vertex from the contour.
    return bearings.map(([dx, dy]) => {
      let sum = 0, x = 0, y = 0;
      positions.forEach(([px, py]) => {
        const weight = Math.exp(0.085 * ((px - 211) * dx + (py - 155) * dy));
        sum += weight;
        x += weight * px;
        y += weight * py;
      });
      return [x / sum + 22 * dx, y / sum + 22 * dy];
    });
  }

  function contourAt(seconds) {
    const start = Math.floor(seconds / contourStep) * contourStep;
    const next = contourSample(start + contourStep);
    const amount = (seconds - start) / contourStep;
    return contourSample(start).map(([x, y], index) => [
      x + (next[index][0] - x) * amount,
      y + (next[index][1] - y) * amount
    ]);
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
      const scale = 0.86 + 0.04 * (index % 4) + 0.045 * Math.sin(seconds * 1.8 + index);
      return `translate(${x},${y}) rotate(${rotation}) scale(${scale})`;
    });
    warmth.attr('opacity', index => 0.72 + 0.25 * Math.sin(seconds * 2.4 + index));
    livingContour.attr('d', contourLine(contourAt(seconds)));
    const imprint = contourAt(seconds - phase + 2.2);
    liftedContour.attr('d', contourLine(imprint));
    landmarks.attr('cx', index => imprint[index][0]).attr('cy', index => imprint[index][1]);
    lifted.attr('transform', `translate(${progress * 259},${progress * -8})`).attr('opacity', opacity);
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
