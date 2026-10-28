# Hero app recordings

Native H.264 simulator recordings from the isolated Somatic review build on iPhone 18 Pro (iOS 27), using sample workout data and dark appearance. Recorded October 27, 2026.

- `hero-strength.mp4`: active strength Session: first set complete, second row checked, rest timer slides in, then the third row becomes active without opening the keyboard.
- `hero-breathing.mp4`: guided breathing practice with the native animated guide.
- `hero-cardio.mp4`: outdoor cardio with heart-rate zones as the primary metric.

The supplied iPhone 18 Pro hardware is layered above the videos, with the video reaching beneath its display edges. Existing framed stills are the fallback. Videos are muted and inline, with overlapping playback to blend each loop seam while the device is visible. Reduced-motion preferences retain stills; mobile only loads the center intro phone’s recording. The appearance card uses native light and dark Sessions recordings with moving gradients; the breathing card reuses the intro practice recording. Sample heart rates vary during strength and cardio.

Capture work uses a temporary copy of the app; the app repository is unchanged.

- `hero-sessions-dark.mp4` and `hero-sessions-light.mp4`: native Sessions card gradient movements in each appearance.
