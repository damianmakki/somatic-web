const featureInventory = document.querySelector('.feature-inventory');
if (featureInventory) featureInventory.classList.add('has-feature-motion');

// Share pointer-following motion between the bento cards and scrolling chips.
if (featureInventory) {
  const pointerMotion = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let activeChip = null;
  let chipBounds = null;
  let chipListLeft = 0;
  let pointerFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  const resetChip = () => {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    if (activeChip) {
      activeChip.classList.remove('is-pointer-active');
      ['--chip-x', '--chip-y', '--chip-rx', '--chip-ry', '--glow-x', '--glow-y'].forEach(property => activeChip.style.removeProperty(property));
    }
    activeChip = null;
    chipBounds = null;
  };

  document.addEventListener('pointermove', event => {
    if (!pointerMotion.matches || event.pointerType !== 'mouse') return;
    const chip = event.target.closest('.feature-chip, .features .card');
    if (!chip) {
      resetChip();
      return;
    }
    if (chip !== activeChip) {
      resetChip();
      activeChip = chip;
      // Capture the resting bounds once so tilting cannot feed back into tracking.
      chipBounds = chip.getBoundingClientRect();
      chipListLeft = chip.parentElement.getBoundingClientRect().left;
      chip.classList.add('is-pointer-active');
    }
    // Follow the row as it keeps moving, without measuring the tilted card again.
    const rowOffset = chip.matches('.feature-chip') ? chip.parentElement.getBoundingClientRect().left - chipListLeft : 0;
    pointerX = Math.max(0, Math.min(1, (event.clientX - chipBounds.left - rowOffset) / chipBounds.width));
    pointerY = Math.max(0, Math.min(1, (event.clientY - chipBounds.top) / chipBounds.height));
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      if (!activeChip) return;
      activeChip.style.setProperty('--chip-x', `${(pointerX - 0.5) * 6}px`);
      activeChip.style.setProperty('--chip-y', `${(pointerY - 0.5) * 4 - 2}px`);
      const tilt = activeChip.matches('.card') ? 4 : 8;
      activeChip.style.setProperty('--chip-rx', `${(0.5 - pointerY) * tilt}deg`);
      activeChip.style.setProperty('--chip-ry', `${(pointerX - 0.5) * (tilt + 2)}deg`);
      activeChip.style.setProperty('--glow-x', `${pointerX * 100}%`);
      activeChip.style.setProperty('--glow-y', `${pointerY * 100}%`);
    });
  });
  document.addEventListener('pointerleave', resetChip);
  document.addEventListener('pointerout', event => {
    if (activeChip && !activeChip.contains(event.relatedTarget)) resetChip();
  });
  window.addEventListener('scroll', resetChip, { passive: true });
  window.addEventListener('resize', resetChip, { passive: true });
  window.addEventListener('blur', resetChip);
  pointerMotion.addEventListener('change', resetChip);
}
