<div align="center">

![banner](https://github.com/phucbm/cuajs/assets/14942380/c68bba3d-cbcc-4a2b-853d-1f898426d29d)

[![npm](https://badgen.net/npm/v/cuajs)](https://www.npmjs.com/package/cuajs?activeTab=versions)
[![minified](https://badgen.net/badge/minified/7KB/cyan)](https://www.jsdelivr.com/package/gh/phucbm/cuajs)
[![jsdelivr](https://data.jsdelivr.com/v1/package/gh/phucbm/cuajs/badge?style=rounded)](https://www.jsdelivr.com/package/gh/phucbm/cuajs)
[![Netlify Status](https://api.netlify.com/api/v1/badges/315eb0d1-7cd6-420c-abca-08ac09fde584/deploy-status)](https://app.netlify.com/sites/cuajs/deploys)

A holy *cua* library to create a horizontal scrolling page.

_(Cua is a Vietnamese word for crab)_
<p><img src="https://github.com/phucbm/cuajs/assets/14942380/321169e6-c33f-4e0c-9c71-67992b347ed4" width="150"></p>

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
<script src="https://cdn.jsdelivr.net/gh/phucbm/cuajs@0.0.3/dist/cua.min.js"></script>
```

### Quick start

1. HTML setup

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

2. JavaScript setup

```js
const instance = CuaJs.init({
    wrapper: document.querySelector('.wrapper')
});
```

## Options

| Attribute              | Type        | Default     | Description                                                    |
|------------------------|-------------|-------------|----------------------------------------------------------------|
| `wrapper`              | DOM element | `undefined` | Required. Wrapper element.                                     |
| `smoothScroll`         | boolean     | `true`      | Enable smooth scroll                                           |
| `verticalBreakpoint`   | number      | `1024`      | Switch to vertical layout mode when `window.innerWidth <= 1024`|
| `smoothVerticalScroll` | boolean     | `true`      | Enable smooth scroll for vertical layout mode                  |
| `keyScrollDistance`    | number      | `200`       | Distance to scroll on each key press (px)                      |
| `keyScroll`            | boolean     | `true`      | Enable navigate by a arrow key                                 |
| `onScrollableContent`  | function    | `undefined` | Callback on each scrollable content                            |
| `once`                 | boolean     | `true`      | Trigger the enter callback only once per element               |
| `rootMargin`           | string      | `0px`       | Margin around the viewport for intersection calculations       |      |
| `threshold`            | number      | `0.1`       | Percentage of element visibility to trigger intersection       |


## Setting options via HTML

```html
<div data-cua='{"verticalBreakpoint":"1024"}'>
</div>
```

## Advanced usage

### Custom scroll observer

Custom scroll observer
```js
document.querySelectorAll('.item').forEach(element => {
    instance.assignScrollObserver({element});
});
```

Add data-cua-observe to enable default scroll observer
```html
<div data-cua='{"verticalBreakpoint":"1024"}' data-cua-observe>
</div>
```

### Scroll navigation

Use data-cua-to attribute for navigation:

- number: Scroll by pixels
- string: CSS selector or keyword ("start", "end")


> **Note:**
> See detail at [scrollTo()](https://github.com/studio-freight/lenis#instance-methods)

## Events

Assign `onScroll` event:

```js
CuaInstance.on('onScroll', (data) => {
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
