# Hairline section figures

Query, Slow, and Terminal come from [lucasmarkes/hairline](https://github.com/lucasmarkes/hairline), commit `a2217852fed6d1a4f20bc7d43d4fad1a3de117b8`, under the MIT license in `../hairline-LICENSE`.

The original figure geometry and interactions are preserved. TypeScript types were stripped with Node's `stripTypeScriptTypes`; core imports resolve to the portfolio's shared, unmodified `HL` kernel. Query's `TABLE.query[2]` is resolved to its original value, `55`. No runtime dependency or network request is needed.

`js/section-figures.js` mounts the figures. Website layout and theme tokens live in `portfolio.css`. The existing shared loop handles visibility and reduced motion.

The referral conveyor is adapted separately in `js/referral-conveyor.js`: five crates map to people, gate proximity controls visibility, and selecting a crate advances it to the gate. The static terminal illustration has been replaced with the readable HTML experience terminal in `js/experience-terminal.js`.
