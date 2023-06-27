<div align="center">

# CuaJs

<img src="https://github.com/phucbm/cuajs/assets/14942380/253cbedc-0641-473e-9260-363159b19335" width="150">

[![release](https://badgen.net/github/release/phucbm/cuajs/)](https://github.com/phucbm/cuajs/releases/latest)
[![minified](https://badgen.net/badge/minified/9KB/cyan)](https://www.jsdelivr.com/package/gh/phucbm/cuajs)
[![jsdelivr](https://data.jsdelivr.com/v1/package/gh/phucbm/cuajs/badge?style=rounded)](https://www.jsdelivr.com/package/gh/phucbm/cuajs)
[![Netlify Status](https://api.netlify.com/api/v1/badges/84c6ed49-b3f3-450b-857a-ec904db724b7/deploy-status)](https://app.netlify.com/sites/easy-select/deploys)

#### A holy *cua* library to create a horizontal scrolling page.

_(Cua is a Vietnamese word for crab)_

</div>

## Getting started

### Download

Using a package manager:

```shell
npm i @phucbm/cuajs
```

```js
import "@phucbm/cuajs";
```

Using CDN:

```html
<!-- Lenis smooth scroll -->
<script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1/bundled/lenis.min.js"></script>

<!-- CuaJs -->
<script src="https://cdn.jsdelivr.net/gh/phucbm/cuajs@0.0.1/dist/cua.min.js"></script>
```

### Init

Setup HTML with these data attributes, the script will then look for this setup to init after library loaded.

```html
<!-- [data-cua] must be defined -->
<div data-cua>
    <!-- Each child of wrapper must have [data-cua-section] -->
    <section data-cua-section>
        Your content

        <!-- Scroll to specific positions with [data-cua-to] -->
        <button data-cua-to="start">To the start</button>
        <button data-cua-to="end">To the end</button>
        <button data-cua-to="#second-section">To the long-section</button>
    </section>

    <section data-cua-section id="second-section">
        <!-- Vertical scrollable div must have [data-cua-vertical-scroll] -->
        <div data-cua-vertical-scroll>
            Content with vertical scroll
        </div>
    </section>
</div>
```

> **Note**
> The value of `[data-cua-to]` could be `number` for pixels, `string` for CSS selector or keyword (`start`, `end`,...).
> See detail at [scrollTo()](https://github.com/studio-freight/lenis#instance-methods)

## Options

| Attribute | Type | Default | Description |
|------------------------|--|-------------------|-----------------------------------------------|
| `wrapper`              | DOM element | `undefined` | Required. Wrapper element. |
| `smoothScroll`         | boolean | `true`           | Enable smooth scroll |
| `verticalBreakpoint`   | number | `1024`          | Switch to vertical layout mode when `window.innerWidth <= 1024` |
| `smoothVerticalScroll` | boolean | `true`            | Enable smooth scroll for vertical layout mode |

```js
// init with options
CuaJs.init({
    wrapper: document.querySelector('.wrapper')
});
```

## Deployment

```shell
# Install
npm i

# Run dev server
npm run dev

# Build dev site
npm run build

# Generate production files
npm run prod
```

## License

[MIT License](https://github.com/phucbm/cuajs/blob/main/LICENSE)

Copyright (c) 2023 PHUCBM
