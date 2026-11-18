(() => {
  const figure = document.querySelector('.xenobots');
  if (!figure || !window.d3) return;

  const d3 = window.d3;
  const width = 640;
  const height = 300;
  const stage = figure.querySelector('.xenobot-stage');
  const svg = d3.select(stage.querySelector('.xenobot-view'));
  const steering = figure.querySelector('input[type="checkbox"]');
  const charge = figure.querySelector('.xenobot-charge');
  const motion = figure.querySelector('[data-motion]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const bots = [
    [269, 89], [218, 119], [309, 126], [177, 159],
    [247, 168], [301, 202], [206, 216]
  ].map(([x, y], index) => ({ x, y, vx: 0.75, vy: (index % 3 - 1) * 0.16 }));
  const target = { x: 470, y: 105 };
  let playing = !reducedMotion.matches;
  let visible = false;
  let timer;
  let previousTime = 0;

  const feedback = svg.append('line').attr('class', 'xenobot-feedback').attr('aria-hidden', 'true');
  const bodies = svg.selectAll('.xenobot-body').data(bots).join('g').attr('class', 'xenobot-body');
  const silhouettes = [
    'M-17 2C-19-6-13-13-5-14C3-18 11-11 12-6C19-4 19 7 13 11C8 16 2 14-1 12C-8 16-17 10-17 2Z',
    'M-17 2C-18-7-10-15-2-14C6-16 14-10 16-3C21 5 13 14 5 14C-6 16-16 11-17 2Z',
    'M-15-7C-12-16-2-17 5-12C14-13 19-7 17 0C21 8 14 15 6 13C0 17-10 15-13 8C-19 4-19-2-15-7Z'
  ];
  bodies.append('circle').attr('class', 'xenobot-hit').attr('r', 22);
  bodies.append('path').attr('class', 'xenobot-silhouette')
    .attr('d', (_, index) => silhouettes[index % silhouettes.length]);
  bodies.append('path').attr('class', 'xenobot-detail')
    .attr('d', 'M-10 1Q-8-7-1-8M4 8Q11 7 11 1');
  const center = svg.append('circle').attr('class', 'xenobot-center').attr('r', 6);
  const ring = svg.append('g').datum(target).attr('class', 'xenobot-target');
  ring.append('circle').attr('class', 'xenobot-hit').attr('r', 17);
  ring.append('circle').attr('class', 'xenobot-ring').attr('r', 10);

  function render() {
    const x = d3.mean(bots, bot => bot.x);
    const y = d3.mean(bots, bot => bot.y);
    bodies.attr('transform', (bot, index) => `translate(${bot.x},${bot.y}) rotate(${index * 47})`);
    center.attr('cx', x).attr('cy', y);
    feedback.attr('x1', x).attr('y1', y).attr('x2', target.x).attr('y2', target.y);
    ring.attr('transform', `translate(${target.x},${target.y})`);
  }

  function move(point, x, y) {
    point.x = Math.max(24, Math.min(width - 24, x));
    point.y = Math.max(24, Math.min(height - 24, y));
    render();
  }

  const drag = d3.drag().container(() => svg.node()).clickDistance(3)
    .on('start', (_, point) => { point.held = true; })
    .on('drag', (event, point) => { move(point, event.x, event.y); })
    .on('end', (_, point) => { point.held = false; });
  bodies.call(drag);
  ring.call(drag);
  svg.on('click', event => {
    if (event.target === svg.node()) move(target, ...d3.pointer(event, svg.node()));
  });

  const steps = new Map([
    ['ArrowUp', [0, -12]], ['ArrowDown', [0, 12]], ['ArrowLeft', [-12, 0]], ['ArrowRight', [12, 0]]
  ]);
  function allowKeys(selection, name) {
    selection.attr('tabindex', 0).attr('role', 'graphics-symbol').attr('aria-label', name)
      .attr('aria-keyshortcuts', 'ArrowUp ArrowDown ArrowLeft ArrowRight')
      .on('keydown', (event, point) => {
        const step = steps.get(event.key);
        if (!step) return;
        event.preventDefault();
        move(point, point.x + step[0], point.y + step[1]);
      });
  }
  allowKeys(bodies.filter((_, index) => index === 0), 'Xenobot, move with arrow keys');
  allowKeys(ring, 'Steering target, move with arrow keys');

  function animate(time) {
    const step = Math.min((time - previousTime) / 16.67, 2);
    previousTime = time;
    // The controller reads the same positions used to draw the center.
    const previous = bots.map(bot => ({ ...bot }));
    const correctionX = steering.checked ? (target.x - d3.mean(previous, bot => bot.x)) * 0.0015 : 0;
    const correctionY = steering.checked ? (target.y - d3.mean(previous, bot => bot.y)) * 0.0015 : 0;

    bots.forEach((bot, index) => {
      if (bot.held) return;
      let ax = correctionX, ay = correctionY;
      for (const neighbor of previous) {
        const dx = neighbor.x - bot.x;
        const dy = neighbor.y - bot.y;
        const distance = Math.hypot(dx, dy);
        if (!distance || distance > 145) continue;
        const pull = distance < 44 ? -0.008 * (44 - distance) : 0.00004 * (distance - 44);
        ax += dx * pull / distance + (neighbor.vx - previous[index].vx) * 0.008;
        ay += dy * pull / distance + (neighbor.vy - previous[index].vy) * 0.008;
      }
      if (!steering.checked) {
        ax += 0.009 * Math.cos(time / 2400);
        ay += 0.012 * Math.sin(time / 1900);
      }
      ax += (Math.max(0, 55 - bot.x) - Math.max(0, bot.x - width + 55)) * 0.02;
      ay += (Math.max(0, 55 - bot.y) - Math.max(0, bot.y - height + 55)) * 0.02;
      const damping = Math.pow(steering.checked ? 0.975 : 0.994, step);
      bot.vx = (bot.vx + ax * step) * damping;
      bot.vy = (bot.vy + ay * step) * damping;
      const speed = Math.max(1, Math.hypot(bot.vx, bot.vy) / 2.65);
      bot.x += bot.vx / speed * step;
      bot.y += bot.vy / speed * step;
    });
    render();
  }

  function updateMotion() {
    motion.setAttribute('aria-label', playing ? 'Pause motion' : 'Play motion');
    motion.dataset.playing = playing;
    if (playing && visible && !document.hidden) {
      if (timer) return;
      previousTime = 0;
      timer = d3.timer(animate);
    } else {
      timer?.stop();
      timer = undefined;
    }
  }

  function updateSteering() {
    figure.toggleAttribute('data-steering', steering.checked);
    charge.hidden = !steering.checked;
  }

  steering.addEventListener('change', updateSteering);
  motion.addEventListener('click', () => { playing = !playing; updateMotion(); });
  reducedMotion.addEventListener('change', event => { if (event.matches) playing = false; updateMotion(); });
  document.addEventListener('visibilitychange', updateMotion);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updateMotion(); }).observe(stage);
  render();
  updateSteering();
  updateMotion();
  figure.hidden = false;
})();
