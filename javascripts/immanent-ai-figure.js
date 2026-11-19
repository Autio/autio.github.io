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

  // Concise, non-AI academic prose matching Autio's register
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
      desc: 'A statistical model wraps the collective as an epistemic instrument, learning how local bioelectric and mechanical shifts reorganize the whole before the tissue traverses that path.',
      badge: 'Prospective Heuristic',
      badgeColor: '#39496b'
    },
    {
      title: '4. Cross-Medium Structural Invariants',
      desc: 'Convergence across cellular, chemical, and silicon systems reflects the shared relational constraints required for any differentiated whole to maintain coherence under change.',
      badge: 'Shared Invariants',
      badgeColor: '#b07d2b'
    }
  ];

  // Simulation & Loop State
  let currentStage = 0;
  let stageTransition = 0;
  let aiLensAlpha = 0;
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

  let morphMode = 'embryo'; // 'embryo' | 'xenobot' | 'twoheaded'
  const SUBSTRATES = ['Cellular', 'Chemical', 'Silicon'];
  let substrateIdx = 0;

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
      } else if (morphMode === 'embryo') {
        if (i < 16) {
          const a = (i / 16) * Math.PI * 2 + Math.sin(t * 0.4) * 0.08;
          n.targetX = centerX + Math.cos(a) * 0.17;
          n.targetY = centerY + Math.sin(a) * 0.13;
        } else {
          const innerA = ((i - 16) / 6) * Math.PI * 2 - t * 0.3;
          n.targetX = centerX + Math.cos(innerA) * 0.065;
          n.targetY = centerY + Math.sin(innerA) * 0.055;
        }
      } else if (morphMode === 'xenobot') {
        const spin = t * 0.85;
        const ring = i < 14 ? 0.145 : 0.07;
        const count = i < 14 ? 14 : 8;
        const idx = i < 14 ? i : i - 14;
        const a = (idx / count) * Math.PI * 2 + spin;
        const orbitX = Math.cos(t * 0.55) * 0.06;
        const orbitY = Math.sin(t * 0.7) * 0.04;
        n.targetX = centerX + orbitX + Math.cos(a) * ring;
        n.targetY = centerY + orbitY + Math.sin(a) * ring;
      } else if (morphMode === 'twoheaded') {
        const isLeft = i % 2 === 0;
        const halfIdx = Math.floor(i / 2);
        const totalHalf = NUM_NODES / 2;
        const a = (halfIdx / totalHalf) * Math.PI * 2 + Math.sin(t * 0.5) * 0.1;
        const poleX = isLeft ? centerX - 0.135 : centerX + 0.135;
        n.targetX = poleX + Math.cos(a) * 0.095;
        n.targetY = centerY + Math.sin(a) * 0.11;
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

    // Cycle subtle demonstrative states during Stage IV of the automatic loop
    if (autoPlay && idx === 3) {
      substrateIdx = (substrateIdx + 1) % SUBSTRATES.length;
    } else if (autoPlay && idx === 0) {
      substrateIdx = 0;
      morphMode = 'embryo';
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
    setStage(idx, true);
  }

  function manualNextStage() {
    setStage((currentStage + 1) % STAGES.length, true);
  }

  function toggleAutoPlay() {
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
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const feedback = root.getElementById('intervention-feedback');

    if (currentStage === 0 && type !== 'reset') {
      setStage(2, true);
    }

    if (type === 'dissociate') {
      morphMode = 'xenobot';
      nodes.forEach(n => {
        n.vx += (Math.random() - 0.5) * 0.035;
        n.vy += (Math.random() - 0.5) * 0.035;
      });
      triggerWave(w * 0.5, h * 0.52, PALETTE.terracotta);
      feedback.textContent = 'Dissociated: cells remake relations into motile collective';
    } else if (type === 'bioelectric') {
      morphMode = morphMode === 'twoheaded' ? 'embryo' : 'twoheaded';
      nodes.forEach(n => {
        n.charge = 1 - n.charge;
      });
      triggerWave(w * 0.5, h * 0.52, PALETTE.indigo);
      feedback.textContent = morphMode === 'twoheaded'
        ? 'ΔV prompt applied: collective settles into bipolar attractor'
        : 'ΔV prompt applied: native single-axis organization restored';
    } else if (type === 'substrate') {
      substrateIdx = (substrateIdx + 1) % SUBSTRATES.length;
      triggerWave(w * 0.5, h * 0.52, PALETTE.amber);
      feedback.textContent = `Medium switched to ${SUBSTRATES[substrateIdx]}: invariant coupling preserved`;
    } else if (type === 'reset') {
      morphMode = 'embryo';
      substrateIdx = 0;
      setStage(0, true);
      feedback.textContent = 'Reset to Stage I';
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
    const attractorNames = {
      embryo: 'Native Whole',
      xenobot: 'Motile Collective',
      twoheaded: 'Bipolar (2-Axis)'
    };
    const couplings = {
      embryo: '0.84 (Active)',
      xenobot: '0.91 (Remade)',
      twoheaded: '0.88 (Bifurcated)'
    };

    root.getElementById('tel-attractor').textContent = attractorNames[morphMode];
    root.getElementById('tel-coupling').textContent = currentStage === 0 ? '0.12 (Passive)' : couplings[morphMode];
    root.getElementById('tel-horizon').textContent = currentStage >= 2 ? 'Prospective (+Δt)' : 'Retrospective';
    root.getElementById('tel-substrate').textContent = SUBSTRATES[substrateIdx];
  }

  canvas.addEventListener('pointerdown', (e) => {
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
        setStage((currentStage + 1) % STAGES.length, true);
      }
    }

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    const targetSplit = currentStage === 0 ? 0 : 1;
    stageTransition += (targetSplit - stageTransition) * (still ? 1 : 0.07);

    const targetAiAlpha = currentStage >= 2 ? 1 : 0;
    aiLensAlpha += (targetAiAlpha - aiLensAlpha) * (still ? 1 : 0.07);

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

    // STAGE III & IV: RELATIONAL MODEL MANIFOLD
    if (aiLensAlpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = aiLensAlpha;

      const cx = w * 0.5;
      const cy = h * 0.52;
      const rx = Math.min(w * 0.36, 255);
      const ry = Math.min(h * 0.34, 150);

      const grad = ctx.createRadialGradient(cx, cy, rx * 0.25, cx, cy, rx * 1.15);
      grad.addColorStop(0, 'rgba(57, 73, 107, 0.02)');
      grad.addColorStop(0.7, 'rgba(57, 73, 107, 0.08)');
      grad.addColorStop(1, 'rgba(57, 73, 107, 0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx * 1.15, ry * 1.15, 0, 0, Math.PI * 2);
      ctx.fill();

      [0.72, 0.92, 1.08].forEach((scale, idx) => {
        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          rx * scale,
          ry * scale,
          Math.sin(time * 0.3 + idx) * 0.04,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = idx === 1 ? 'rgba(57, 73, 107, 0.32)' : 'rgba(57, 73, 107, 0.16)';
        ctx.lineWidth = idx === 1 ? 1.3 : 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      const numTraj = 6;
      for (let i = 0; i < numTraj; i++) {
        const a = (i / numTraj) * Math.PI * 2 + time * 0.25;
        const x1 = cx + Math.cos(a) * (rx * 0.52);
        const y1 = cy + Math.sin(a) * (ry * 0.52);
        const x2 = cx + Math.cos(a + 0.22) * (rx * 0.95);
        const y2 = cy + Math.sin(a + 0.22) * (ry * 0.95);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(
          cx + Math.cos(a + 0.1) * (rx * 0.78),
          cy + Math.sin(a + 0.1) * (ry * 0.78),
          x2,
          y2
        );
        ctx.strokeStyle = 'rgba(61, 107, 88, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x2, y2, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = PALETTE.sage;
        ctx.fill();
      }

      ctx.fillStyle = PALETTE.indigo;
      ctx.font = '600 13px "Newsreader", Georgia, serif';
      ctx.textAlign = 'left';
      ctx.fillText('RELATIONAL TRANSITION MODEL (Epistemic Heuristic)', 18, 28);

      ctx.fillStyle = PALETTE.inkSoft;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('Maps local coupling shifts to prospective global attractors', 18, 44);

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

      const basinLabels = {
        embryo: 'ACTIVE ATTRACTOR: Coherent Gastrula / Native Whole',
        xenobot: 'ACTIVE ATTRACTOR: Dissociated Motile Collective',
        twoheaded: 'ACTIVE ATTRACTOR: Bifurcated Bipolar Organization'
      };
      ctx.fillStyle = PALETTE.ink;
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(basinLabels[morphMode], w * 0.5, h - 16);

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

          let strokeCol = `rgba(61, 107, 88, ${alpha})`;
          if (currentStage === 0) {
            strokeCol = `rgba(138, 133, 122, ${alpha})`;
          } else if (substrateIdx === 1) {
            strokeCol = `rgba(184, 80, 56, ${alpha})`;
          } else if (substrateIdx === 2) {
            strokeCol = `rgba(57, 73, 107, ${alpha})`;
          }

          ctx.strokeStyle = strokeCol;
          ctx.lineWidth = currentStage === 0 ? 1 : 1.55;
          ctx.stroke();

          if (currentStage >= 1 && (i + j) % 4 === 0) {
            const sigT = (time * 1.4 + i * 0.2) % 1;
            const sx = x1 + (x2 - x1) * sigT;
            const sy = y1 + (y2 - y1) * sigT;
            ctx.beginPath();
            ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = currentStage >= 2 ? PALETTE.indigo : PALETTE.sage;
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

      if (substrateIdx === 2 && currentStage >= 1) {
        ctx.beginPath();
        ctx.rect(nx - pulseR * 0.85, ny - pulseR * 0.85, pulseR * 1.7, pulseR * 1.7);
        ctx.fill();
        ctx.stroke();
      } else if (substrateIdx === 1 && currentStage >= 1) {
        ctx.beginPath();
        ctx.moveTo(nx, ny - pulseR * 1.15);
        ctx.lineTo(nx + pulseR * 1.15, ny);
        ctx.lineTo(nx, ny + pulseR * 1.15);
        ctx.lineTo(nx - pulseR * 1.15, ny);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(nx, ny, pulseR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
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
    requestDraw();
    const btnLabel = root.getElementById('gif-btn-label');
    const feedback = root.getElementById('intervention-feedback');
    btnLabel.textContent = 'Rendering Loop...';
    feedback.textContent = 'Capturing 4-stage loop frames for GIF...';

    const offscreen = document.createElement('canvas');
    const gifW = 480;
    const gifH = 270;
    offscreen.width = gifW;
    offscreen.height = gifH;
    const octx = offscreen.getContext('2d');

    const frames = [];
    const wasPlaying = autoPlay;
    const savedStage = currentStage;
    autoPlay = false;

    // Capture 24 frames (6 frames per stage across all 4 stages)
    const totalFrames = 24;
    for (let f = 0; f < totalFrames; f++) {
      const targetStg = Math.floor(f / 6);
      if (currentStage !== targetStg) {
        setStage(targetStg, false);
      }
      // Advance physics slightly for smooth motion in the GIF
      stageTransition += ((currentStage === 0 ? 0 : 1) - stageTransition) * 0.35;
      aiLensAlpha += ((currentStage >= 2 ? 1 : 0) - aiLensAlpha) * 0.35;
      updateNodeTargets(f * 0.28);
      nodes.forEach(n => {
        n.x += (n.targetX - n.x) * 0.35;
        n.y += (n.targetY - n.y) * 0.35;
      });

      await new Promise(r => requestAnimationFrame(r));
      octx.drawImage(canvas, 0, 0, gifW, gifH);
      // Draw stage caption strip at top of GIF frame
      octx.fillStyle = 'rgba(250, 248, 245, 0.92)';
      octx.fillRect(0, 0, gifW, 24);
      octx.fillStyle = '#1c1b18';
      octx.font = '600 11px Georgia, serif';
      octx.fillText(STAGES[targetStg].title, 10, 16);

      frames.push(octx.getImageData(0, 0, gifW, gifH).data);
    }

    const blob = buildLoopingGifBlob(frames, gifW, gifH, 24); // 240ms per frame (~5.7s full loop)
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'against-platonic-space-figure-4.gif';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 4000);

    setStage(savedStage, true);
    autoPlay = wasPlaying;
    exporting = false;
    btnLabel.textContent = 'Export Looping GIF';
    feedback.textContent = 'Saved against-platonic-space-figure-4.gif';
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
