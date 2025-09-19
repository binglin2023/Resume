# Resume single-file builder

This repository includes a small Node script to produce a standalone HTML file (`resume-single.html`) with CSS, JS and images inlined.

Usage:

1. Install Node (if you don't have it). Node >=12 is recommended.
2. From the project root run:

```
npm run build-single
```

This will write `resume-single.html` to the project root.

Notes:
- The script inlines `link rel="stylesheet"` and `<script src>` assets referenced with relative paths in `index.html`.
- Local images referenced with relative paths (e.g. `./assets/img/jrx.png`) are converted to base64 data URIs.
- Browser print behavior depends on the browser's "print background graphics" setting. If gradients or background images are missing in the printed PDF, enable that option in the print dialog.
