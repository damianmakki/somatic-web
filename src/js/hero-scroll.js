// Spread the back phones with scroll, keeping the front phone centered.
const heroDevices = document.querySelector('.hero-devices');
if (heroDevices) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scrollFrame = 0;
  let lastProgress = -1;
  let scrollRange = Math.max(220, Math.min(480, window.innerHeight * 0.5));

  const updateHero = () => {
    scrollFrame = 0;
    const linear = Math.max(0, Math.min(1, window.scrollY / scrollRange));
    // Smooth start and finish in both scroll directions.
    const progress = reducedMotion.matches ? 1 : linear * linear * (3 - 2 * linear);
    if (progress === lastProgress) return;
    lastProgress = progress;
    heroDevices.style.setProperty('--hero-progress', progress.toFixed(4));
  };
  const scheduleHero = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateHero);
  };
  window.addEventListener('scroll', scheduleHero, { passive: true });
  window.addEventListener('resize', () => {
    scrollRange = Math.max(220, Math.min(480, window.innerHeight * 0.5));
    scheduleHero();
  }, { passive: true });
  window.addEventListener('pageshow', scheduleHero);
  reducedMotion.addEventListener('change', scheduleHero);
  updateHero();
}

// Overlap native recordings at each loop seam, avoiding a hard timer reset.
{
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactViewport = window.matchMedia('(max-width: 768px)');
  const visibleDevices = new Set();
  const recordings = [...document.querySelectorAll('.device-video')].map(first => {
    const second = first.cloneNode(true);
    first.after(second);
    const record = { target: first.closest('.feature-visual') || first.closest('.hero-device'), device: first.closest('.device'), videos: [first, second], active: first, switching: false, enabled: false };
    const swap = outgoing => {
      if (!record.enabled || record.switching || record.active !== outgoing) return;
      record.switching = true;
      const incoming = record.videos.find(video => video !== outgoing);
      if (!incoming.src) incoming.src = first.dataset.src;
      incoming.currentTime = 0;
      incoming.muted = true;
      incoming.play().then(() => {
        if (!record.enabled) { incoming.pause(); record.switching = false; return; }
        incoming.style.opacity = '1';
        outgoing.style.opacity = '0';
        record.active = incoming;
        window.setTimeout(() => {
          outgoing.pause();
          outgoing.currentTime = 0;
          record.switching = false;
        }, 700);
      }).catch(() => { record.switching = false; });
    };
    record.videos.forEach(video => {
      video.addEventListener('timeupdate', () => {
        if (video.duration && video.currentTime >= video.duration - 0.85) swap(video);
      });
      video.addEventListener('ended', () => swap(video));
    });
    return record;
  });
  const updateRecordings = () => {
    recordings.forEach(record => {
      const hiddenPhone = compactViewport.matches && record.device.closest('.hero-device') && !record.device.closest('.hero-device-center');
      record.enabled = !motionPreference.matches && !hiddenPhone && visibleDevices.has(record.target) && !document.hidden;
      if (!record.enabled) {
        record.videos.forEach(video => video.pause());
        if (motionPreference.matches) {
          record.device.classList.remove('is-playing');
          record.videos.forEach(video => { video.style.opacity = '0'; });
        }
        return;
      }
      const video = record.active;
      if (!video.src) video.src = video.dataset.src;
      video.muted = true;
      video.play().then(() => {
        if (record.enabled) { record.device.classList.add('is-playing'); video.style.opacity = '1'; }
        else video.pause();
      }).catch(() => record.device.classList.remove('is-playing'));
    });
  };
  const videoVisibility = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleDevices.add(entry.target);
      else visibleDevices.delete(entry.target);
    });
    updateRecordings();
  });
  recordings.forEach(record => videoVisibility.observe(record.target));
  motionPreference.addEventListener('change', updateRecordings);
  compactViewport.addEventListener('change', updateRecordings);
  document.addEventListener('visibilitychange', updateRecordings);
}
