(() => {
  const figure = document.querySelector('.flock');
  if (!figure || !window.d3) return;

  const d3 = window.d3;
  const width = 640;
  const height = 300;
  const stage = figure.querySelector('.flock-stage');
  const svg = d3.select(stage.querySelector('.flock-view'));
  const steering = figure.querySelector('input[type="checkbox"]');
  const charge = figure.querySelector('.flock-charge');
  const motion = figure.querySelector('[data-motion]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const birds = [
    [272, 125], [222, 138], [308, 151], [179, 162], [244, 171], [286, 187],
    [208, 191], [327, 200], [254, 219], [173, 220], [216, 238]
  ].map(([x, y], index) => ({ x, y, vx: 0.75, vy: (index % 3 - 1) * 0.16 }));
  const target = { x: 470, y: 105 };
  let playing = !reducedMotion.matches;
  let visible = false;
  let timer;
  let previousTime = 0;

  const dots = svg.selectAll('.flock-bird').data(birds).join('g').attr('class', 'flock-bird');
  dots.append('circle').attr('class', 'flock-hit').attr('r', 15);
  dots.append('circle').attr('class', 'flock-dot').attr('r', 5);
  const center = svg.append('circle').attr('class', 'flock-center').attr('r', 6);
  const ring = svg.append('g').datum(target).attr('class', 'flock-target');
  ring.append('circle').attr('class', 'flock-hit').attr('r', 17);
  ring.append('circle').attr('class', 'flock-ring').attr('r', 10);

  function render() {
    dots.attr('transform', bird => `translate(${bird.x},${bird.y})`);
    center.attr('cx', d3.mean(birds, bird => bird.x)).attr('cy', d3.mean(birds, bird => bird.y));
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
  dots.call(drag);
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
  allowKeys(dots.filter((_, index) => index === 0), 'Bird, move with arrow keys');
  allowKeys(ring, 'Steering target, move with arrow keys');

  function animate(time) {
    const step = Math.min((time - previousTime) / 16.67, 2);
    previousTime = time;
    // Read neighbors from the same frame so iteration order does not steer the flock.
    const previous = birds.map(bird => ({ ...bird }));

    birds.forEach((bird, index) => {
      if (bird.held) return;
      let ax = 0, ay = 0;
      for (const neighbor of previous) {
        const dx = neighbor.x - bird.x;
        const dy = neighbor.y - bird.y;
        const distance = Math.hypot(dx, dy);
        if (!distance || distance > 145) continue;
        const pull = distance < 31 ? -0.008 * (31 - distance) : 0.000016 * (distance - 31);
        ax += dx * pull / distance + (neighbor.vx - previous[index].vx) * 0.008;
        ay += dy * pull / distance + (neighbor.vy - previous[index].vy) * 0.008;
      }
      if (steering.checked) {
        ax += (target.x - bird.x) * 0.0015;
        ay += (target.y - bird.y) * 0.0015;
      } else {
        ax += 0.009 * Math.cos(time / 2400);
        ay += 0.012 * Math.sin(time / 1900);
      }
      ax += (Math.max(0, 55 - bird.x) - Math.max(0, bird.x - width + 55)) * 0.02;
      ay += (Math.max(0, 55 - bird.y) - Math.max(0, bird.y - height + 55)) * 0.02;
      const damping = Math.pow(steering.checked ? 0.975 : 0.994, step);
      bird.vx = (bird.vx + ax * step) * damping;
      bird.vy = (bird.vy + ay * step) * damping;
      const speed = Math.max(1, Math.hypot(bird.vx, bird.vy) / 2.65);
      bird.x += bird.vx / speed * step;
      bird.y += bird.vy / speed * step;
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
