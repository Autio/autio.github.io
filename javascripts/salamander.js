(() => {
  const figure = document.querySelector('.salamander');
  if (!figure) return;

  const limbs = Array.from(figure.querySelectorAll('.salamander-limb'));
  const sites = Array.from(figure.querySelectorAll('.salamander-sites circle'));

  function setMissing(limb, index, missing) {
    limb.setAttribute('aria-pressed', String(missing));
    limb.classList.toggle('is-missing', missing);
    sites[index].classList.toggle('is-missing', missing);
  }

  limbs.forEach((limb, index) => {
    const toggle = () => setMissing(limb, index, limb.getAttribute('aria-pressed') !== 'true');
    limb.addEventListener('click', toggle);
    limb.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      if (!event.repeat) toggle();
    });
  });
  figure.querySelector('[data-remove-limbs]').addEventListener('click', () => {
    limbs.forEach((limb, index) => setMissing(limb, index, true));
  });
  figure.querySelector('[data-regrow-limbs]').addEventListener('click', () => {
    limbs.forEach((limb, index) => setMissing(limb, index, false));
  });

  figure.hidden = false;
})();
