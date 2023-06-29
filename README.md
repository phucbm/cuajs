<div align="center">

# CuaJs

<p><img src="https://github.com/phucbm/cuajs/assets/14942380/321169e6-c33f-4e0c-9c71-67992b347ed4" width="150"></p>

[![npm](https://badgen.net/npm/v/cuajs)](https://www.npmjs.com/package/cuajs?activeTab=versions)
[![minified](https://badgen.net/badge/minified/5KB/cyan)](https://www.jsdelivr.com/package/gh/phucbm/cuajs)
[![jsdelivr](https://data.jsdelivr.com/v1/package/gh/phucbm/cuajs/badge?style=rounded)](https://www.jsdelivr.com/package/gh/phucbm/cuajs)
[![Netlify Status](https://api.netlify.com/api/v1/badges/315eb0d1-7cd6-420c-abca-08ac09fde584/deploy-status)](https://app.netlify.com/sites/cuajs/deploys)

A holy *cua* library to create a horizontal scrolling page.

_(Cua is a Vietnamese word for crab)_

</div>

## Introduction

See [Demo](https://cuajs.netlify.app).

- Respect the native behavior of the browser's scrollbar, which means accessibility is ensured. 
- Default scrolling events are remained. No DOM manipulation.
- Keyboard, trackpad, mouse wheel, and touch screens are tested.
- Able to switch to vertical scrolling on mobile devices.
- Smooth scrolling experience with Lenis.

## Installation

CuaJs has no dependency. However, it is recommended to install [Lenis](https://github.com/studio-freight/lenis) 
to enable smooth scrolling and gain a better experience.

### Download

Using a package manager:

```shell
npm i @studio-freight/lenis
npm i cuajs
```

```js
import Lenis from '@studio-freight/lenis'
import "cuajs";
```

Using CDN:

```html
<!-- Lenis smooth scroll -->
<script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1/bundled/lenis.min.js"></script>

<!-- CuaJs -->
<script src="https://cdn.jsdelivr.net/gh/phucbm/cuajs@0.0.2/dist/cua.min.js"></script>
```

### Init

HTML setup:

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

## Events

Assign `onScroll` event:

```js
CuaJsData.on('onScroll', (data) => {
    console.log(data.axis, data.progress);

    // more info
    console.log(data);
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
