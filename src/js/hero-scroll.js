// Reveal the rear phones as the device artwork moves into the viewport.
const heroDevices = document.querySelector('.hero-devices');
if (heroDevices) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let lastTime = 0;
  let progress = 0;
  let revealStart = 0;
  let revealEnd = 400;
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => value * value * (3 - 2 * value);
  const render = value => {
    const left = ease(clamp((value - 0.025) / 0.915));
    const right = ease(clamp((value - 0.09) / 0.91));
    heroDevices.style.setProperty('--hero-progress', ease(value).toFixed(4));
    heroDevices.style.setProperty('--hero-left-progress', left.toFixed(4));
    heroDevices.style.setProperty('--hero-right-progress', right.toFixed(4));
    heroDevices.style.setProperty('--hero-left-angle', `${(-1.2 * Math.sin(Math.PI * left)).toFixed(3)}deg`);
    heroDevices.style.setProperty('--hero-right-angle', `${(1.2 * Math.sin(Math.PI * right)).toFixed(3)}deg`);
  };
  const update = time => {
    frame = 0;
    const target = reducedMotion.matches ? 1 : clamp((window.scrollY - revealStart) / (revealEnd - revealStart));
    const elapsed = lastTime ? Math.min(64, time - lastTime) : 16;
    lastTime = time;
    // A short, frame-rate-independent follow keeps trackpad and wheel input fluid.
    progress += (target - progress) * (1 - Math.exp(-elapsed / 85));
    const settled = Math.abs(target - progress) < 0.0005;
    if (settled || reducedMotion.matches) progress = target;
    render(progress);
    heroDevices.classList.toggle('is-revealing', !settled && !reducedMotion.matches);
    if (!settled && !reducedMotion.matches) frame = requestAnimationFrame(update);
    else lastTime = 0;
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  const measure = () => {
    const top = heroDevices.getBoundingClientRect().top + window.scrollY;
    revealStart = Math.max(0, top - window.innerHeight * 0.75);
    revealEnd = Math.max(revealStart + 280, top - window.innerHeight * 0.17);
    schedule();
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('pageshow', measure);
  document.fonts?.ready.then(measure);
  reducedMotion.addEventListener('change', schedule);
  measure();
}

// Overlap native recordings at each loop seam, avoiding a hard timer reset.
{
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactViewport = window.matchMedia('(max-width: 768px)');
  const visibleDevices = new Set();
  const loadRecording = (video, record) => {
    if (video.getAttribute('src')) return;
    video.preload = 'auto';
    video.src = video.dataset.src;
    record.loadStarted = performance.now();
    video.load();
  };
  const recordings = [...document.querySelectorAll('.device-video')].map(first => {
    const second = first.cloneNode(true);
    first.after(second);
    const record = { target: first.closest('.feature-visual') || first.closest('.hero-device'), device: first.closest('.device'), videos: [first, second], active: first, switching: false, enabled: false, loadStarted: 0, loadRetries: 0 };
    const swap = outgoing => {
      if (!record.enabled || record.switching || record.active !== outgoing) return;
      record.switching = true;
      const incoming = record.videos.find(video => video !== outgoing);
      loadRecording(incoming, record);
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
      video.addEventListener('canplay', () => {
        if (record.enabled && record.active === video) updateRecordings();
      });
      video.addEventListener('playing', () => { record.loadRetries = 0; });
      video.addEventListener('pause', () => {
        // Browsers may pause muted media while its tab or screen is occluded.
        if (record.enabled && record.active === video && !record.switching && !video.ended) {
          requestAnimationFrame(updateRecordings);
        }
      });
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
      loadRecording(video, record);
      video.muted = true;
      video.style.opacity = '1';
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
  window.addEventListener('pageshow', updateRecordings);
  // Recover a pending media load without reloading clips that are playing.
  window.setInterval(() => {
    if (document.hidden) return;
    recordings.forEach(record => {
      const video = record.active;
      if (!record.enabled || record.switching) return;
      if (video.readyState === 0 && performance.now() - record.loadStarted > 8000 && record.loadRetries < 2) {
        record.loadRetries += 1;
        record.loadStarted = performance.now();
        video.load();
        updateRecordings();
      } else if (video.paused && !video.ended && video.readyState >= 2) {
        updateRecordings();
      }
    });
  }, 3000);
}
