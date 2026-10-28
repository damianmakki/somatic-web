# Website app captures

Fresh captures made on October 27, 2026 using clean, isolated iPhone 18 Pro and iPhone Duo simulators. The capture build is a temporary copy of the app; the app repository and personal workout data were not changed.

All screens use production app views with sample training data: 135 lb bench sets, 18:37 elapsed strength time, completed sets and rest, 95 lb rows with a 6% progression, populated weekly statistics, breathing practice, a run in progress, and a completed 28:42 run with an illustrative GPS route. The route is sample data, not an actual recorded run.

Frames supplied by the user:

- `iPhone 18 Pro.png`
- `iPhone Duo/Inner - Landscape.png`
- `iPhone Duo/Outer - Portrait.png`

The native status bars are retained, including Duo's distinct side layout. Printed status symbols in the Duo frame assets are removed from the hardware layer to avoid duplication. Display opening masks come directly from the supplied frame pixels, with a small underlap beneath the bezel to prevent gaps. Screen and hardware are composited before responsive scaling.

The WebP files include their hardware frames. Do not add another frame or status-bar overlay in the page. `device-screen.html` supplies only sizing and the optional privacy / Apple Health badges.

Homepage devices use native dark appearance, except for the light-mode comparison in the design card. The route capture uses a point-to-point path returned by Apple Maps walking directions along the Hudson River Greenway, illustrated as a run; it is not a recorded personal route. The native screen shows the matching route distance and pace. The Health card uses Soma’s sleep/recent-workout context; the progress card uses populated Summary highlights.

The Soma capture now shows the tailored workout plan instead of the initial suggestion. Health is scrolled to its supporting indicators with XXXL Dynamic Type (a supported app text-size setting). The active run has heart-rate zones selected as its main metric.

The design card pairs the same Sessions screen in dark and light appearances, offset horizontally like the live site. Sessions captures use the app’s neutral/default-blue theme so every Somatic Session gradient card on the page is blue.

The More reps / Fewer taps card stacks native compact and expanded Dynamic Island captures above the matching workout screen. These are real system Live Activity presentations from the isolated simulator. Device Hub window captures preserve the system Island layer (which simulator display exports omit); the display is cropped and fitted to the supplied hardware. A black image in Photos supplies a clean background. Photos controls are outside the visible compact crop and expanded/workout overlap. No Activity controls are recreated in HTML.
