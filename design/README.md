# Shared project folder

The live projects area uses one isometric folder in `js/project-folders.js`, with one sheet per project. Resting tab targets stay fixed while the visual sheet moves, preventing hover flicker. Hover raises a sheet by five world units (roughly 13px at full size); clicking pulls it out and reveals the title and short project description. The selected sheet slides into clear space beside the other tabs. Full project details update inline below the folder; clicking the selected sheet scrolls to those details.

HTML file faces and SVG covers use the same Hairline camera. The unmodified Hairline kernel is vendored in `js/vendor/` with its MIT license. Its shared tween loop sleeps offscreen, settles when idle, and respects reduced motion. Arrow keys select files; Enter and Space select a focused tab. Category filters preserve a matching selection and regroup the remaining files. On small screens the folder can be scrolled horizontally.

`hairline-folder.html` and `js/folder.js` retain the earlier standalone folder geometry study; they are not loaded by the portfolio.
