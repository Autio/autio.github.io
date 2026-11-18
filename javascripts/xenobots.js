(() => {
  const figure = document.querySelector('.xenobots');
  if (!figure || !window.d3) return;

  const d3 = window.d3;
  const svg = d3.select(figure.querySelector('.xenobot-view'));
  const joined = figure.querySelector('input[type="checkbox"]');
  const charge = figure.querySelector('.xenobot-charge');
  const bots = [
    { x: 218, y: 130, shape: 'M-25 1C-30-10-18-24-5-22C5-27 19-17 20-10C33-5 30 12 17 17C10 24 0 22-5 18C-16 25-29 13-25 1Z' },
    { x: 414, y: 112, shape: 'M-25 3C-29-9-17-21-3-21C9-27 24-16 25-6C33 6 22 20 9 20C-4 27-25 17-25 3Z' }
  ].map(bot => ({ ...bot, trail: [] }));
  const link = svg.append('line').attr('class', 'xenobot-link');
  const trails = svg.selectAll('.xenobot-trail').data(bots).join('path').attr('class', 'xenobot-trail');
  const line = d3.line().x(point => point.x).y(point => point.y);
  const bodies = svg.selectAll('.xenobot-body').data(bots).join('g').attr('class', 'xenobot-body')
    .attr('tabindex', 0).attr('role', 'graphics-symbol')
    .attr('aria-label', (_, index) => `Xenobot ${index + 1}, move with arrow keys`)
    .attr('aria-keyshortcuts', 'ArrowUp ArrowDown ArrowLeft ArrowRight');
  bodies.append('circle').attr('class', 'xenobot-hit').attr('r', 35);
  bodies.append('path').attr('class', 'xenobot-silhouette').attr('d', bot => bot.shape);
  bodies.append('path').attr('class', 'xenobot-detail')
    .attr('d', 'M-15 3Q-14-10-3-12M5 11Q16 10 17 1M-3 13H0');

  function render() {
    const [first, second] = bots;
    bodies.attr('transform', bot => `translate(${bot.x},${bot.y})`);
    trails.attr('d', bot => line([...bot.trail, bot]));
    link.attr('x1', first.x).attr('y1', first.y).attr('x2', second.x).attr('y2', second.y);
  }

  function move(bot, x, y) {
    const moving = joined.checked ? bots : [bot];
    const dx = Math.max(35 - d3.min(moving, b => b.x), Math.min(605 - d3.max(moving, b => b.x), x - bot.x));
    const dy = Math.max(35 - d3.min(moving, b => b.y), Math.min(215 - d3.max(moving, b => b.y), y - bot.y));
    const other = bots.find(body => body !== bot);
    if (!joined.checked && Math.hypot(bot.x + dx - other.x, bot.y + dy - other.y) < 64) return;
    moving.forEach(body => {
      const last = body.trail.at(-1);
      if (!last || Math.hypot(body.x - last.x, body.y - last.y) > 4) {
        body.trail.push({ x: body.x, y: body.y });
        if (body.trail.length > 42) body.trail.shift();
      }
      body.x += dx;
      body.y += dy;
    });
    render();
  }

  bodies.call(d3.drag().container(() => svg.node())
    .on('drag', (event, bot) => move(bot, event.x, event.y)));
  const directions = { ArrowUp: [0, -12], ArrowDown: [0, 12], ArrowLeft: [-12, 0], ArrowRight: [12, 0] };
  bodies.on('keydown', (event, bot) => {
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    move(bot, bot.x + direction[0], bot.y + direction[1]);
  });

  function updateConnection() {
    bots.forEach(bot => { bot.trail = []; });
    figure.toggleAttribute('data-joined', joined.checked);
    charge.hidden = !joined.checked;
    render();
  }

  joined.addEventListener('change', updateConnection);
  updateConnection();
  figure.hidden = false;
})();
