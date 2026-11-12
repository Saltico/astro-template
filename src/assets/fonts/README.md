# Fuentes autoalojadas

- `archivo-latin-wght-normal.woff2` (titulares, `--font-heading`) y `inter-latin-wght-normal.woff2` (cuerpo, `--font-body`): variables (peso 100-900), subset latin. Licencia OFL 1.1 (`OFL-*.txt`).
- Se declaran con `@font-face` (`font-display: swap`) en `src/styles/base.css` y se precargan en `BaseLayout.astro` (import `?url`).
- Para cambiarlas por proyecto, ver la seccion "Fuentes" del README raiz.
