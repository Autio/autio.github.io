(() => {
  const host = document.getElementById('immanent-ai-figure-host');
  if (!host) return;
  const root = host.attachShadow({ mode: 'open' });
  root.append(host.querySelector('template').content.cloneNode(true));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /**
   * Figure 4: Interactive Editorial Schematic & Pure-JS Looping GIF Encoder
   */
  const canvas = root.getElementById('schematicCanvas');
  const ctx = canvas.getContext('2d');
  const couplingInput = root.getElementById('regime-input');

  const PALETTE = {
    bg: '#fcfbf8',
    paperDark: '#f3f0ea',
    ink: '#1c1b18',
    inkSoft: '#4e4b43',
    inkMuted: '#7a766c',
    hairline: '#dcd7cc',
    indigo: '#39496b',
    indigoLight: 'rgba(57, 73, 107, 0.12)',
    terracotta: '#b85038',
    terracottaLight: 'rgba(184, 80, 56, 0.14)',
    sage: '#3d6b58',
    sageLight: 'rgba(61, 107, 88, 0.14)',
    amber: '#b07d2b',
    amberLight: 'rgba(176, 125, 43, 0.14)'
  };

  const STAGES = [
    {
      title: '1. The Split: Separate Residences',
      desc: 'Assigning form to a separate address turns a distinction within intelligibility into an unexplained transaction between pre-existing patterns above and passive matter below.',
      badge: 'Two Addresses',
      badgeColor: '#b85038'
    },
    {
      title: '2. Immanent Self-Organization',
      desc: 'The upper warehouse dissolves into the living collective. Parts make and remake the relations through which the whole takes shape and acts, generating stable forms from within.',
      badge: 'Determinate Unity',
      badgeColor: '#3d6b58'
    },
    {
      title: '3. Relational State-Space Modeling',
      desc: 'Change local coupling, then compare the forecast with the simulated response. The thresholds predict where the boundary will fail, repair itself, or reorganize.',
      badge: 'Prospective Heuristic',
      badgeColor: '#39496b'
    },
    {
      title: '4. Concrete Thresholds',
      desc: 'Determinate negation asks what breaks when a form moves into a new medium. A program executes, a chemical front needs a feed, and a living boundary must be made and remade by the activity it makes possible.',
      badge: 'Regime Transitions',
      badgeColor: '#b07d2b'
    }
  ];

  // Simulation & Loop State
  let currentStage = 0;
  let stageTransition = 0;
  let autoPlay = !reducedMotion.matches;
  const STAGE_DURATION_MS = 4600;
  let stageElapsedMs = 0;
  let lastFrameTime = null;
  let time = 0;
  let frame = null;
  let visible = false;
  let exporting = false;

  function requestDraw() {
    if (frame === null) frame = requestAnimationFrame(draw);
  }

  const MEDIA = ['Biological', 'Chemical', 'Computational'];
  const THRESHOLD = { maintenance: 0.55, branching: 0.78, gradient: 0.35 };
  const TRIALS = {
    collapse: 'Boundary collapse below the maintenance threshold',
    recover: 'Repair toward a single boundary',
    branch: 'Repair into a two-lobed boundary',
    front: 'A sustained front while the gradient is fed',
    dissolve: 'Dissolution of the chemical front',
    execute: 'Execution under an imposed rule'
  };
  const clamp = value => Math.max(0, Math.min(1, value));
  let nextLoopMedium = 0;
  let model = createModel();

  function createModel(medium = 0, coupling = 0.72, integrity = 0.94) {
    return { medium, coupling, integrity, gradient: true, branch: 0, cost: 0,
      previous: coupling, forecast: null, elapsed: 0, observed: false };
  }

  function predict(state) {
    if (state.medium === 2) return 'execute';
    if (state.medium === 1) {
      return state.gradient && state.coupling >= THRESHOLD.gradient ? 'front' : 'dissolve';
    }
    if (state.coupling < THRESHOLD.maintenance) return 'collapse';
    return state.coupling >= THRESHOLD.branching ? 'branch' : 'recover';
  }

  function startTrial() {
    model.forecast = predict(model);
    model.elapsed = 0;
    model.observed = false;
    advanceModel(0);
  }

  function changeMedium(index) {
    // Carry the coupling across media and let the new conditions act on the form.
    model = createModel(index, model.coupling, 0.45);
    startTrial();
  }

  function advanceModel(dt) {
    const outcome = predict(model);
    const repairs = outcome === 'branch' || outcome === 'recover';
    const targetIntegrity = repairs || outcome === 'execute' ? 0.94 : outcome === 'front' ? 0.8 : 0;
    const speed = repairs ? 2.1 : outcome === 'front' ? 1.5 : 1.8;
    const branchTarget = outcome === 'branch' ? 1 : 0;
    const flux = repairs ? Math.max(0, targetIntegrity - model.integrity) * speed +
      0.35 * Math.abs(branchTarget - model.branch) : 0;
    model.cost = repairs ? 0.04 + flux : 0;
    model.integrity += (targetIntegrity - model.integrity) * (1 - Math.exp(-speed * dt));
    model.branch += (branchTarget - model.branch) * (1 - Math.exp(-2.5 * dt));
    model.elapsed += dt;
    model.observed = model.elapsed > 0.18 &&
      Math.abs(targetIntegrity - model.integrity) < 0.10 &&
      (outcome !== 'branch' || model.branch > 0.85);
  }

  let perturbationWave = { active: false, x: 0, y: 0, radius: 0, alpha: 0, color: PALETTE.indigo };

  const NUM_NODES = 22;
  let nodes = [];

  function initNodes() {
    nodes = [];
    for (let i = 0; i < NUM_NODES; i++) {
      const angle = (i / NUM_NODES) * Math.PI * 2;
      nodes.push({
        id: i,
        x: 0.5 + Math.cos(angle) * 0.14,
        y: 0.65 + Math.sin(angle) * 0.14,
        vx: 0,
        vy: 0,
        targetX: 0.5,
        targetY: 0.5,
        phase: Math.random() * Math.PI * 2,
        charge: 0.5 + 0.5 * Math.sin(i * 0.7),
        radius: 5.5 + (i % 3) * 1.1
      });
    }
  }

  function updateNodeTargets(t) {
    const splitProgress = stageTransition;
    const centerY = 0.74 * (1 - splitProgress) + 0.52 * splitProgress;
    const centerX = 0.5;

    for (let i = 0; i < NUM_NODES; i++) {
      const n = nodes[i];
      if (currentStage === 0 && splitProgress < 0.25) {
        const cols = 6;
        const row = Math.floor(i / cols);
        const col = i % cols;
        n.targetX = 0.34 + col * 0.064;
        n.targetY = 0.64 + row * 0.068;
      } else {
        if (i < 16) {
          const a = (i / 16) * Math.PI * 2 + Math.sin(t * 0.4) * 0.08;
          n.targetX = centerX + Math.cos(a) * 0.17;
          n.targetY = centerY + Math.sin(a) * 0.13;
        } else {
          const innerA = ((i - 16) / 6) * Math.PI * 2 - t * 0.3;
          n.targetX = centerX + Math.cos(innerA) * 0.065;
          n.targetY = centerY + Math.sin(innerA) * 0.055;
        }
      }
    }
  }

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    requestDraw();
  }

  new ResizeObserver(resizeCanvas).observe(canvas.parentElement);

  function setStage(idx, resetTimer = true) {
    currentStage = idx;
    if (resetTimer) {
      stageElapsedMs = 0;
      root.getElementById('loop-progress-bar').style.width = '0%';
    }

    for (let i = 0; i < 4; i++) {
      const tab = root.getElementById(`tab-${i}`);
      tab.setAttribute('aria-pressed', String(i === idx));
      if (i === idx) {
        tab.classList.add('active');
        tab.classList.remove('bg-[#faf8f5]');
      } else {
        tab.classList.remove('active');
        tab.classList.add('bg-[#faf8f5]');
      }
    }

    const meta = STAGES[idx];
    root.getElementById('stage-title').textContent = meta.title;
    root.getElementById('stage-desc').textContent = meta.desc;
    const badge = root.getElementById('stage-badge');
    badge.textContent = meta.badge;
    badge.style.color = meta.badgeColor;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    triggerWave(w * 0.5, h * 0.52, meta.badgeColor);
    updateTelemetry();
  }

  function manualSelectStage(idx) {
    if (exporting) return;
    setStage(idx, true);
  }

  function manualNextStage() {
    if (exporting) return;
    setStage((currentStage + 1) % STAGES.length, true);
  }

  function toggleAutoPlay() {
    if (exporting) return;
    autoPlay = !autoPlay;
    updatePlayback();
  }

  function updatePlayback() {
    root.getElementById('autoplay-btn').setAttribute('aria-pressed', String(autoPlay));
    const label = root.getElementById('autoplay-label');
    const dot = root.getElementById('autoplay-dot');
    const feedback = root.getElementById('intervention-feedback');
    if (autoPlay) {
      label.textContent = 'Loop: Playing';
      dot.classList.add('animate-pulse');
      dot.style.backgroundColor = '#3d6b58';
      feedback.textContent = 'Auto-loop active across all four stages';
    } else {
      label.textContent = 'Loop: Paused';
      dot.classList.remove('animate-pulse');
      dot.style.backgroundColor = '#b07d2b';
      feedback.textContent = 'Loop paused for manual inspection';
    }
  }

  function triggerIntervention(type) {
    if (exporting) return;
    const feedback = root.getElementById('intervention-feedback');
    autoPlay = false;
    updatePlayback();

    if (type === 'reset') {
      model = createModel();
      nextLoopMedium = 0;
      setStage(0, true);
      feedback.textContent = 'Reset to Stage I';
      return;
    }

    if (currentStage < 2) setStage(type === 'substrate' ? 3 : 2, true);
    if (type === 'substrate') {
      changeMedium((model.medium + 1) % MEDIA.length);
      feedback.textContent = `Transferred to ${MEDIA[model.medium]} at the same coupling`;
    } else if (type === 'gradient') {
      model.gradient = !model.gradient;
      model.previous = model.coupling;
      startTrial();
      feedback.textContent = model.gradient ? 'External gradient restored' : 'External gradient removed';
    } else {
      model.previous = model.coupling;
      const change = type === 'dissociate' ? -0.32 : type === 'bioelectric' ? 0.18 : -0.08;
      model.coupling = clamp(Math.round((model.coupling + change) * 100) / 100);
      if (model.medium !== 2) model.integrity = clamp(model.integrity - (type === 'dissociate' ? 0.38 : 0.26));
      startTrial();
      feedback.textContent = `Coupling ${model.previous.toFixed(2)} → ${model.coupling.toFixed(2)}`;
    }

    updateTelemetry();
  }

  function triggerWave(x, y, color) {
    perturbationWave = {
      active: true,
      x,
      y,
      radius: 12,
      alpha: 0.65,
      color
    };
  }

  function updateTelemetry() {
    const panel = root.getElementById('regime-panel');
    panel.hidden = currentStage < 2;
    root.getElementById('telemetry-panel').toggleAttribute('data-regime', !panel.hidden);
    const gradient = root.getElementById('gradient-control');
    gradient.hidden = panel.hidden || model.medium !== 1;
    if (!panel.hidden) {
      gradient.textContent = model.gradient ? 'Remove gradient' : 'Restore gradient';
      updateRegimeTelemetry();
      return;
    }
    root.getElementById('tel-attractor').textContent = 'Native Whole';
    root.getElementById('tel-coupling').textContent = currentStage === 0 ? '0.12 (Passive)' : '0.84 (Active)';
    root.getElementById('tel-horizon').textContent = 'Retrospective';
    root.getElementById('tel-substrate').textContent = MEDIA[0];
  }

  function updateRegimeTelemetry() {
    const put = (id, value) => {
      const field = root.getElementById('regime-' + id);
      if (field.textContent !== value) field.textContent = value;
    };
    const { medium, cost, integrity, coupling, forecast, observed } = model;
    const autonomy = medium === 0 && cost > 0 ? integrity : 0;
    const state = autonomy > 0.64 ? 'Self-Determining / Teleological' :
      (cost > 0 || (medium === 1 && model.gradient && coupling >= THRESHOLD.gradient && integrity > 0.2))
        ? 'Dissipative / Driven' : 'Mechanism / Passive';
    put('cost', cost.toFixed(2) + (cost > 0.12 ? ' · repair' : ''));
    put('autonomy', `${Math.round(autonomy * 100)}% ${autonomy > 0 ? '· internal' : '· imposed or absent'}`);
    put('state', state);
    put('medium', MEDIA[medium]);
    put('coupling', `Coupling ${coupling.toFixed(2)}`);
    put('thresholds', medium === 0 ? '0.55 maintenance · 0.78 reorganization' :
      medium === 1 ? '0.35 gradient capture · external feed required' : 'Execution follows the supplied rule');
    put('forecast', forecast ? 'Prediction · ' + TRIALS[forecast] : '');
    const shape = medium !== 0 ? '' : model.branch > 0.85 ? ' · two lobes' :
      integrity < 0.10 ? ' · boundary lost' : '';
    const measurement = medium === 2 ? 'rule executing' :
      `boundary integrity ${Math.round(integrity * 100)}%${shape}`;
    put('observed', `Simulation · ${measurement}${forecast ? (observed ? ' · settled' : ' · evolving') : ''}`);

    root.getElementById('regime-track').hidden = medium === 2;
    root.getElementById('regime-maintenance-mark').style.left =
      (medium === 1 ? THRESHOLD.gradient : THRESHOLD.maintenance) * 100 + '%';
    root.getElementById('regime-branch-mark').hidden = medium !== 0;
    root.getElementById('regime-branch-mark').style.left = THRESHOLD.branching * 100 + '%';
    root.getElementById('regime-previous').style.left = model.previous * 100 + '%';
    if (couplingInput.valueAsNumber !== coupling) couplingInput.value = String(coupling);
  }

  couplingInput.addEventListener('input', () => {
    if (exporting) return;
    autoPlay = false;
    updatePlayback();
    model.previous = model.coupling;
    model.coupling = couplingInput.valueAsNumber;
    if (model.medium === 0 && model.previous !== model.coupling) model.integrity *= 0.9;
    startTrial();
    updateRegimeTelemetry();
    requestDraw();
  });

  canvas.addEventListener('pointerdown', (e) => {
    if (currentStage >= 2) {
      triggerIntervention('local');
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    triggerWave(px, py, PALETTE.indigo);

    if (currentStage === 0) {
      setStage(1, true);
    }

    nodes.forEach(n => {
      const nx = n.x * w;
      const ny = n.y * h;
      const dist = Math.hypot(nx - px, ny - py);
      if (dist < 110) {
        const force = (1 - dist / 110) * 0.03;
        const angle = Math.atan2(ny - py, nx - px);
        n.vx += Math.cos(angle) * force;
        n.vy += Math.sin(angle) * force;
        n.charge = Math.min(1, n.charge + 0.35);
      }
    });

    root.getElementById('intervention-feedback').textContent =
      'Local perturbation: network re-equilibrating couplings';
  });

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function drawRegime(w, h) {
    const cx = w * 0.5;
    const cy = h * 0.48;
    const radius = Math.min(w * 0.27, h * 0.29);
    const { medium, integrity, coupling, branch, gradient, cost } = model;
    ctx.fillStyle = PALETTE.bg;
    ctx.fillRect(0, 0, w, h);

    if (medium === 2) {
      const columns = 7;
      const spacing = radius / 3;
      const active = Math.floor(time * 8) % 21;
      ctx.strokeStyle = PALETTE.hairline;
      ctx.strokeRect(cx - spacing * 3.8, cy - spacing * 1.65, spacing * 7.6, spacing * 3.3);
      for (let i = 0; i < 21; i++) {
        const x = cx + (i % columns - 3) * spacing;
        const y = cy + (Math.floor(i / columns) - 1) * spacing;
        ctx.globalAlpha = i === active ? 1 : 0.22 + 0.5 * coupling;
        ctx.fillStyle = PALETTE.indigo;
        ctx.fillRect(x - 3, y - 3, 6, 6);
      }
    } else if (medium === 1) {
      if (gradient) {
        const feed = ctx.createLinearGradient(cx - radius * 1.6, 0, cx + radius, 0);
        feed.addColorStop(0, PALETTE.amberLight);
        feed.addColorStop(1, PALETTE.bg);
        ctx.fillStyle = feed;
        ctx.fillRect(cx - radius * 1.6, cy - radius * 0.82, radius * 2.6, radius * 1.64);
        ctx.strokeStyle = PALETTE.amber;
        ctx.beginPath();
        ctx.moveTo(cx - radius * 1.45, cy);
        ctx.lineTo(cx - radius * 0.8, cy);
        ctx.lineTo(cx - radius * 0.9, cy - 5);
        ctx.moveTo(cx - radius * 0.8, cy);
        ctx.lineTo(cx - radius * 0.9, cy + 5);
        ctx.stroke();
      }
      ctx.globalAlpha = integrity;
      ctx.strokeStyle = PALETTE.terracotta;
      for (let i = 0; i < 5; i++) {
        const y = cy + (i - 2) * radius * 0.24;
        ctx.beginPath();
        ctx.moveTo(cx - radius * 0.63, y);
        ctx.quadraticCurveTo(cx + radius * 0.34, y - radius * 0.42 * integrity, cx + radius, y);
        ctx.stroke();
      }
    } else {
      function membrane(angle, scale = 1) {
        const waist = 1 + branch * 0.48 * Math.cos(2 * angle);
        return [cx + Math.cos(angle) * radius * waist * scale,
          cy + Math.sin(angle) * radius * waist * scale * 0.79];
      }
      // Integrity is the fraction of membrane segments that still connect.
      const segments = 64;
      ctx.strokeStyle = cost > 0.12 ? PALETTE.terracotta : PALETTE.sage;
      ctx.lineWidth = 1.4 + Math.min(1, cost);
      for (let i = 0; i < segments; i++) {
        const connection = ((i * 29) % segments) / segments;
        if (connection >= integrity) continue;
        const a = i * Math.PI * 2 / segments;
        const b = (i + 1.15) * Math.PI * 2 / segments;
        ctx.beginPath();
        ctx.moveTo(...membrane(a));
        ctx.lineTo(...membrane(b));
        ctx.stroke();
      }
      ctx.fillStyle = PALETTE.sage;
      for (let i = 0; i < NUM_NODES; i++) {
        const a = i * Math.PI * 2 / NUM_NODES;
        const scale = 0.72 + (1 - integrity) * (0.25 + (i % 4) * 0.16);
        ctx.globalAlpha = 0.35 + 0.6 * integrity;
        ctx.beginPath();
        ctx.arc(...membrane(a, scale), 2.5 + coupling * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
    ctx.fillStyle = PALETTE.inkSoft;
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const label = medium === 2 ? 'Externally specified rule' :
      medium === 1 ? (gradient ? 'Gradient fed' : 'Gradient removed') :
        (integrity < 0.12 ? 'Boundary lost' : cost > 0.12 ? 'Repair underway' :
          branch > 0.6 ? 'Two-lobed boundary' : 'Single boundary');
    ctx.fillText(label, cx, h * 0.81, w - 24);
  }

  function draw(timestamp) {
    frame = null;
    if (lastFrameTime === null) lastFrameTime = timestamp;
    const dt = Math.min(timestamp - lastFrameTime, 100);
    lastFrameTime = timestamp;
    const still = reducedMotion.matches && !autoPlay && !exporting;
    time = still ? 0 : time + dt * 0.001;

    // Advance seamless continuous loop if playing
    if (autoPlay) {
      stageElapsedMs += dt;
      const pct = Math.min(100, (stageElapsedMs / STAGE_DURATION_MS) * 100);
      root.getElementById('loop-progress-bar').style.width = `${pct}%`;
      if (stageElapsedMs >= STAGE_DURATION_MS) {
        const next = (currentStage + 1) % STAGES.length;
        if (next === 3) {
          changeMedium(nextLoopMedium);
          nextLoopMedium = (nextLoopMedium + 1) % MEDIA.length;
        }
        setStage(next, true);
      }
    }

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (currentStage >= 2) {
      advanceModel(still ? 0.35 : exporting ? 0 : dt / 1000);
      updateRegimeTelemetry();
      drawRegime(w, h);
      if (exporting || (visible && (!still || (model.forecast && !model.observed)))) requestDraw();
      return;
    }

    const targetSplit = currentStage === 0 ? 0 : 1;
    stageTransition += (targetSplit - stageTransition) * (still ? 1 : 0.07);

    updateNodeTargets(time);

    nodes.forEach(n => {
      const spring = currentStage === 0 ? 0.08 : 0.045;
      n.vx += (n.targetX - n.x) * spring;
      n.vy += (n.targetY - n.y) * spring;
      n.vx *= 0.84;
      n.vy *= 0.84;
      n.x += n.vx;
      n.y += n.vy;
    });

    // Solid background fill (also ensures clean GIF frame capture)
    ctx.fillStyle = PALETTE.bg;
    ctx.fillRect(0, 0, w, h);

    // Subtle architectural grid
    ctx.strokeStyle = 'rgba(220, 215, 204, 0.36)';
    ctx.lineWidth = 1;
    const gridStep = 36;
    for (let gx = gridStep; gx < w; gx += gridStep) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, h);
      ctx.stroke();
    }
    for (let gy = gridStep; gy < h; gy += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(w, gy);
      ctx.stroke();
    }

    // STAGE I: PLATONIC WAREHOUSE
    const platonicAlpha = Math.max(0, 1 - stageTransition * 1.35);
    if (platonicAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = platonicAlpha;

      const boxW = Math.min(w * 0.82, 600);
      const boxH = h * 0.31;
      const boxX = (w - boxW) / 2;
      const boxY = h * 0.08 + stageTransition * 70;

      ctx.fillStyle = PALETTE.paperDark;
      roundRect(ctx, boxX, boxY, boxW, boxH, 10);
      ctx.fill();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = PALETTE.inkMuted;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = PALETTE.ink;
      ctx.font = '600 13px "Newsreader", Georgia, serif';
      ctx.textAlign = 'left';
      ctx.fillText('PLATONIC SPACE (Second Address / Pre-Existing Forms)', boxX + 14, boxY + 22);

      const archetypes = ['Prime Ratio', 'Xenobot Form', 'Limb Pattern', 'Attractor #402'];
      archetypes.forEach((label, idx) => {
        const ax = boxX + (boxW / 4) * (idx + 0.5);
        const ay = boxY + boxH * 0.6 + Math.sin(time * 1.5 + idx) * 3;
        ctx.beginPath();
        ctx.arc(ax, ay, 16, 0, Math.PI * 2);
        ctx.strokeStyle = PALETTE.indigo;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = PALETTE.inkSoft;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, ax, ay + 28);
      });

      const dividerY = h * 0.46;
      ctx.beginPath();
      ctx.moveTo(w * 0.08, dividerY);
      ctx.lineTo(w * 0.92, dividerY);
      ctx.strokeStyle = PALETTE.terracotta;
      ctx.lineWidth = 1.3;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = PALETTE.terracotta;
      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('UNEXPLAINED PASSAGE ("INGRESS" ACROSS ONTOLOGICAL SPLIT)', w * 0.5, dividerY - 6);

      [-0.16, 0, 0.16].forEach((offset, idx) => {
        const arrowX = w * (0.5 + offset);
        const pulse = (time * 1.2 + idx * 0.3) % 1;
        const startY = boxY + boxH + 6;
        const endY = h * 0.56;
        const curY = startY + (endY - startY) * pulse;

        ctx.beginPath();
        ctx.moveTo(arrowX, startY);
        ctx.lineTo(arrowX, endY);
        ctx.strokeStyle = 'rgba(184, 80, 56, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(arrowX, curY, 3, 0, Math.PI * 2);
        ctx.fillStyle = PALETTE.terracotta;
        ctx.fill();
      });

      ctx.fillStyle = PALETTE.inkMuted;
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MUTE MATTER (Passive Cellular Parts)', w * 0.5, h * 0.92);

      ctx.restore();
    }

    // STAGE II+ IMMANENT LABELING
    if (stageTransition > 0.15) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, (stageTransition - 0.15) * 1.25);

      if (currentStage === 1) {
        ctx.fillStyle = PALETTE.sage;
        ctx.font = '600 13px "Newsreader", Georgia, serif';
        ctx.textAlign = 'left';
        ctx.fillText('IMMANENT SELF-ORGANIZATION (Single Actuality)', 18, 28);
        ctx.fillStyle = PALETTE.inkSoft;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText('Parts make and remake the relations through which the whole acts', 18, 44);
      }

      ctx.fillStyle = PALETTE.ink;
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('NATIVE WHOLE', w * 0.5, h - 16);

      ctx.restore();
    }

    // RELATIONAL COUPLING EDGES
    const couplingStrength = currentStage === 0 ? 0.18 : 1.0;
    const maxDist = currentStage === 0 ? 68 : 118;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const x1 = n1.x * w;
        const y1 = n1.y * h;
        const x2 = n2.x * w;
        const y2 = n2.y * h;
        const d = Math.hypot(x2 - x1, y2 - y1);

        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.65 * couplingStrength;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);

          ctx.strokeStyle = currentStage === 0
            ? `rgba(138, 133, 122, ${alpha})` : `rgba(61, 107, 88, ${alpha})`;
          ctx.lineWidth = currentStage === 0 ? 1 : 1.55;
          ctx.stroke();

          if (currentStage >= 1 && (i + j) % 4 === 0) {
            const sigT = (time * 1.4 + i * 0.2) % 1;
            const sx = x1 + (x2 - x1) * sigT;
            const sy = y1 + (y2 - y1) * sigT;
            ctx.beginPath();
            ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = PALETTE.sage;
            ctx.fill();
          }
        }
      }
    }

    // NODES
    nodes.forEach((n) => {
      const nx = n.x * w;
      const ny = n.y * h;
      const pulseR = n.radius + (currentStage >= 1 ? Math.sin(time * 3 + n.phase) * 1.1 : 0);

      if (currentStage >= 1) {
        ctx.beginPath();
        ctx.arc(nx, ny, pulseR + 4.5, 0, Math.PI * 2);
        ctx.fillStyle = n.charge > 0.55 ? PALETTE.indigoLight : PALETTE.sageLight;
        ctx.fill();
      }

      ctx.fillStyle = currentStage === 0
        ? '#d6d1c4'
        : (n.charge > 0.55 ? PALETTE.indigo : PALETTE.sage);
      ctx.strokeStyle = PALETTE.ink;
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.arc(nx, ny, pulseR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // PERTURBATION WAVE
    if (perturbationWave.active) {
      perturbationWave.radius += 4.5;
      perturbationWave.alpha *= 0.94;
      ctx.save();
      ctx.beginPath();
      ctx.arc(perturbationWave.x, perturbationWave.y, perturbationWave.radius, 0, Math.PI * 2);
      ctx.strokeStyle = perturbationWave.color;
      ctx.globalAlpha = perturbationWave.alpha;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      if (perturbationWave.alpha < 0.02) {
        perturbationWave.active = false;
      }
    }

    if (visible && !still || exporting) requestDraw();
  }

  /**
   * Lightweight Pure-JS Animated GIF89a Encoder (Uncompressed LZW Clear-Code Stream)
   * Captures a complete seamless 4-stage loop of the schematic into a downloadable .gif
   */
  function buildLoopingGifBlob(framesRgba, width, height, delayCs) {
    // Build a fixed 64-color editorial palette covering parchment, ink, indigo, terracotta, sage, amber
    const palette = [];
    const levels = [0, 85, 170, 255];
    for (let r of levels) {
      for (let g of levels) {
        for (let b of levels) {
          palette.push([r, g, b]);
        }
      }
    }
    // Override first 8 entries with exact theme colors for crisp rendering
    const themeColors = [
      [252, 251, 248], // #fcfbf8 bg
      [243, 240, 234], // #f3f0ea paperDark
      [28, 27, 24],    // #1c1b18 ink
      [78, 75, 67],    // #4e4b43 inkSoft
      [57, 73, 107],   // #39496b indigo
      [184, 80, 56],   // #b85038 terracotta
      [61, 107, 88],   // #3d6b58 sage
      [176, 125, 43]   // #b07d2b amber
    ];
    for (let i = 0; i < themeColors.length; i++) {
      palette[i] = themeColors[i];
    }

    function nearestColorIndex(r, g, b) {
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < 64; i++) {
        const pr = palette[i][0];
        const pg = palette[i][1];
        const pb = palette[i][2];
        const dr = r - pr;
        const dg = g - pg;
        const db = b - pb;
        const d = dr * dr + dg * dg + db * db;
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
          if (d === 0) break;
        }
      }
      return bestIdx;
    }

    const bytes = [];
    const writeStr = (s) => { for (let i = 0; i < s.length; i++) bytes.push(s.charCodeAt(i)); };
    const writeU16 = (v) => { bytes.push(v & 0xff, (v >> 8) & 0xff); };

    // Header & Logical Screen Descriptor (64 colors -> size field = 5)
    writeStr('GIF89a');
    writeU16(width);
    writeU16(height);
    bytes.push(0x80 | 0x70 | 0x05); // Global Color Table Flag, 8-bit color res, 64 entries
    bytes.push(0); // Background color index
    bytes.push(0); // Pixel aspect ratio

    // Global Color Table (64 * 3 bytes)
    for (let i = 0; i < 64; i++) {
      bytes.push(palette[i][0], palette[i][1], palette[i][2]);
    }

    // NETSCAPE2.0 Infinite Loop Application Extension
    bytes.push(0x21, 0xff, 0x0b);
    writeStr('NETSCAPE2.0');
    bytes.push(0x03, 0x01, 0x00, 0x00, 0x00);

    // Encode each frame using valid LZW stream with periodic Clear Codes
    const minCodeSize = 7; // 128 clear code, 129 end code
    const clearCode = 128;
    const endCode = 129;

    for (const rgba of framesRgba) {
      // Graphic Control Extension
      bytes.push(0x21, 0xf9, 0x04, 0x00);
      writeU16(delayCs);
      bytes.push(0x00, 0x00);

      // Image Descriptor
      bytes.push(0x2c);
      writeU16(0);
      writeU16(0);
      writeU16(width);
      writeU16(height);
      bytes.push(0x00);

      // Image Data (LZW)
      bytes.push(minCodeSize);
      const lzwBytes = [];
      let bitBuf = 0;
      let bitCount = 0;
      const codeBits = 8;

      const pushCode = (code) => {
        bitBuf |= (code << bitCount);
        bitCount += codeBits;
        while (bitCount >= 8) {
          lzwBytes.push(bitBuf & 0xff);
          bitBuf >>= 8;
          bitCount -= 8;
        }
      };

      pushCode(clearCode);
      const totalPixels = width * height;
      for (let p = 0; p < totalPixels; p++) {
        const off = p * 4;
        const idx = nearestColorIndex(rgba[off], rgba[off + 1], rgba[off + 2]);
        pushCode(idx);
        // Reset dictionary every 110 codes so code width stays strictly 8 bits
        if ((p + 1) % 110 === 0) {
          pushCode(clearCode);
        }
      }
      pushCode(endCode);
      if (bitCount > 0) {
        lzwBytes.push(bitBuf & 0xff);
      }

      // Write sub-blocks (max 255 bytes each)
      for (let offset = 0; offset < lzwBytes.length; offset += 255) {
        const chunkLen = Math.min(255, lzwBytes.length - offset);
        bytes.push(chunkLen);
        for (let k = 0; k < chunkLen; k++) {
          bytes.push(lzwBytes[offset + k]);
        }
      }
      bytes.push(0x00); // Block terminator
    }

    bytes.push(0x3b); // GIF Trailer
    return new Blob([new Uint8Array(bytes)], { type: 'image/gif' });
  }

  async function exportLoopingGif() {
    if (exporting) return;
    exporting = true;
    const btnLabel = root.getElementById('gif-btn-label');
    const feedback = root.getElementById('intervention-feedback');
    const saved = { model, autoPlay, currentStage, stageElapsedMs, nodes, time,
      stageTransition, perturbationWave };
    autoPlay = false;
    model = createModel();
    initNodes();
    btnLabel.textContent = 'Rendering loop…';
    feedback.textContent = 'Capturing the four stages…';
    requestDraw();

    try {
      const offscreen = document.createElement('canvas');
      const width = 480;
      const height = 270;
      offscreen.width = width;
      offscreen.height = height;
      const output = offscreen.getContext('2d');
      const frames = [];

      for (let frameIndex = 0; frameIndex < 24; frameIndex++) {
        const stage = Math.floor(frameIndex / 6);
        if (currentStage !== stage) setStage(stage, false);
        if (stage < 2) {
          stageTransition += ((stage === 0 ? 0 : 1) - stageTransition) * 0.35;
        } else if (frameIndex === 13) {
          model.coupling = 0.90;
          model.integrity = 0.60;
          startTrial();
        } else if (frameIndex === 20) {
          changeMedium(1);
        } else if (frameIndex === 21) {
          model.gradient = false;
          startTrial();
        } else if (frameIndex === 22) {
          changeMedium(2);
        }
        if (stage >= 2) advanceModel(0.34);

        await new Promise(resolve => requestAnimationFrame(resolve));
        output.drawImage(canvas, 0, 0, width, height);
        output.fillStyle = 'rgba(250, 248, 245, 0.92)';
        output.fillRect(0, 0, width, 24);
        output.fillStyle = PALETTE.ink;
        output.font = '600 11px Georgia, serif';
        const title = STAGES[stage].title + (stage >= 2 ? ' · ' + MEDIA[model.medium] : '');
        output.fillText(title, 10, 16);
        frames.push(output.getImageData(0, 0, width, height).data);
      }

      const blob = buildLoopingGifBlob(frames, width, height, 24);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'against-platonic-space-figure-4.gif';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      feedback.textContent = 'Saved against-platonic-space-figure-4.gif';
    } catch {
      feedback.textContent = 'GIF export failed. Try again.';
    } finally {
      ({ model, autoPlay, stageElapsedMs, nodes, time, stageTransition } = saved);
      setStage(saved.currentStage, false);
      perturbationWave = saved.perturbationWave;
      exporting = false;
      btnLabel.textContent = 'Export Looping GIF';
      requestDraw();
    }
  }

  async function copyFigureLink() {
    const label = root.getElementById('copy-btn-label');
    const feedback = root.getElementById('intervention-feedback');
    const link = new URL(location.href);
    link.hash = 'immanent-ai-figure-host';
    try {
      await navigator.clipboard.writeText(link.href);
      label.textContent = 'Link copied';
      setTimeout(() => { label.textContent = 'Copy figure link'; }, 2500);
    } catch {
      feedback.textContent = link.href;
    }
  }

  const listeners = {
    next: manualNextStage,
    play: toggleAutoPlay,
    gif: exportLoopingGif,
    copy: copyFigureLink
  };
  root.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
      listeners[button.dataset.action]();
      requestDraw();
    });
  });
  root.querySelectorAll('[data-stage]').forEach(button => {
    button.addEventListener('click', () => {
      manualSelectStage(Number(button.dataset.stage));
      requestDraw();
    });
  });
  root.querySelectorAll('[data-intervention]').forEach(button => {
    button.addEventListener('click', () => {
      triggerIntervention(button.dataset.intervention);
      requestDraw();
    });
  });
  canvas.addEventListener('pointerdown', requestDraw);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    lastFrameTime = null;
    if (visible) requestDraw();
  }).observe(host);
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      autoPlay = false;
      updatePlayback();
    }
    requestDraw();
  });

  initNodes();
  resizeCanvas();
  setStage(0, true);
  updatePlayback();
  requestDraw();
})();
