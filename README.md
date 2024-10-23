<div align="center">

![banner](https://github.com/phucbm/cuajs/assets/14942380/c68bba3d-cbcc-4a2b-853d-1f898426d29d)

[![npm](https://badgen.net/npm/v/cuajs)](https://www.npmjs.com/package/cuajs?activeTab=versions)
[![minified](https://badgen.net/badge/minified/12KB/cyan)](https://www.jsdelivr.com/package/gh/phucbm/cuajs)
[![jsdelivr](https://data.jsdelivr.com/v1/package/gh/phucbm/cuajs/badge?style=rounded)](https://www.jsdelivr.com/package/gh/phucbm/cuajs)
[![Netlify Status](https://api.netlify.com/api/v1/badges/315eb0d1-7cd6-420c-abca-08ac09fde584/deploy-status)](https://app.netlify.com/sites/cuajs/deploys)

**Why scroll down when you can *cua* across?**

_(Cua is a Vietnamese word for crab)_
<p><img src="https://github.com/phucbm/cuajs/assets/14942380/321169e6-c33f-4e0c-9c71-67992b347ed4" width="150"></p>

</div>

## Introduction

CuaJs is a lightweight, powerful JavaScript library that transforms traditional vertical scrolling into a smooth,
intuitive horizontal experience.
With Lenis smooth scrolling deeply integrated for fluid animations, it delivers buttery-smooth transitions and
scroll-based effects.
Named after the Vietnamese word for crab, CuaJs brings a sideways 'crab walk' to web navigation.
See [Demo](https://cuajs.netlify.app).

### Key Features

- 🖱️ **Native Scrollbar Respect**: Maintains browser scrollbar functionality for optimal accessibility.
- 🔗 **Seamless Integration**: Preserves default scrolling events without DOM manipulation.
- 📱 **Cross-Device Compatibility**: Fully tested on keyboard, trackpad, mouse wheel, and touch screens.
- 📐 **Responsive Design**: Automatically switches to vertical scrolling on mobile devices.
- 🧈 **Smooth Scrolling**: Integrates beautifully with Lenis for a buttery-smooth scroll experience.
- 🚀 **Easy Implementation**: Simple HTML data attributes for quick setup and customization.
- 🧭 **Flexible Navigation**: Supports programmatic scrolling to specific sections or positions.

CuaJs offers web developers a unique tool to create engaging, horizontally-scrolling websites without sacrificing
usability or accessibility.
Whether you're building a portfolio, product showcase, or innovative web experience, CuaJs provides the framework for
smooth, intuitive sideways navigation.

## Installation

CuaJs can run independently, but integrating [Lenis](https://github.com/studio-freight/lenis) unlocks enhanced features
like butter-smooth animations, optimized scroll transitions, and improved cross-browser scrolling behavior.

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
<script src="https://cdn.jsdelivr.net/gh/phucbm/cuajs@0.0.5/dist/cua.min.js"></script>

<!-- Cua Animate (optional, for animation only) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/phucbm/cuajs@0.0.5/dist/cua-animate.css">
```

### Quick start

#### 1. HTML setup

```html
<!-- [data-cua] must be defined -->
<div data-cua>
    <!-- Each child of wrapper must have [data-cua-section] -->
    <section data-cua-section></section>
    <section data-cua-section></section>
</div>
```

Setting options via HTML

```html
<div data-cua='{"verticalBreakpoint":"1024"}'>
</div>
```

#### 2. JavaScript setup

```js
const instance = CuaJs.init({
    wrapper: document.querySelector('.wrapper')
});
```

After `init()`, you can either use `instance` which is returned from the init function, or `CuaInstance` to access methods.

## API

### Options

| Attribute              | Type        | Default     | Description                                                                 |
|------------------------|-------------|-------------|-----------------------------------------------------------------------------|
| `wrapper`              | DOM element | `undefined` | Required. Wrapper element.                                                  |
| `smoothScroll`         | boolean     | `true`      | Enable smooth scroll                                                        |
| `verticalBreakpoint`   | number      | `1024`      | Switch to vertical layout mode when `window.innerWidth <= 1024`             |
| `smoothVerticalScroll` | boolean     | `true`      | Enable smooth scroll for vertical layout mode                               |
| `keyScrollDistance`    | number      | `200`       | Distance to scroll on each key press (px)                                   |
| `keyScroll`            | boolean     | `true`      | Enable navigate by a arrow key                                              |
| `onScrollableContent`  | function    | `undefined` | Callback on each scrollable content                                         |
| `once`                 | boolean     | `true`      | *Scroll Observer*: Only run "enter" callback once.                          |
| `rootMargin`           | string      | `0px`       | *Scroll Observer*: Margin around the viewport for intersection calculations |
| `threshold`            | number      | `0.1`       | *Scroll Observer*: Percentage of element visibility to trigger intersection |
| `draggable`            | boolean     | `false`     | Enable drag to scroll                                                       |
| `scrollSnap`           | boolean     | `false`     | Snap to the nearest section                                                 |

### Methods

| Name                   | Usage                                                                    | Description                                    | 
|------------------------|--------------------------------------------------------------------------|------------------------------------------------|
| `assignScrollObserver` | `CuaInstance.assignScrollObserver({element, options, enter,leave,once})` | Assign a scroll observer to a specific element |
| `on`                   | `CuaInstance.on()`                                                       | Assign events                                  |

### Events

Assign `onScroll` event:

```js
CuaInstance.on('onScroll', (data) => {
    console.log(data.axis, data.progress);

    // more info
    console.log(data);
});
```

```js
CuaInstance.on('onSectionChange', ({index, instance, section}) => {
    console.log(`Active index`, index);
});
```

## Features
### data-cua-observe
Scroll Observer is a functionality that utilizes Intersection Observer to monitor a specific element and trigger a callback function when that element enters or exits the viewport. This feature is particularly useful for creating animations that appear as elements come into view.

By default, Scroll Observer adds the class `"cua-intersection"` to an element when it enters the viewport and removes this class when the element leaves. To activate this default behavior, simply add the attribute `data-cua-observe` to the desired element.

```html
<div data-cua>
    <section data-cua-section>
        <div data-cua-observe>
            Item with scroll observer
        </div>
    </section>
</div>
```


For more customized control, you can define a custom observer using the `assignScrollObserver` function. Here's an example of how to implement this:

```js
CuaInstance.assignScrollObserver({
    element: document.querySelector('.my-element'),
    options: {
        rootMargin: '0px',
        threshold: 0.5,
        once: true
    },
    enter: (entry) => {
        console.log('Element entered viewport:', entry.target);
        // Add your enter logic here
    },
    leave: (entry) => {
        console.log('Element left viewport:', entry.target);
        // Add your leave logic here
    }
});
```

### data-cua-animate

When Lenis is enabled, CuaJs exposes scroll velocity through the CSS variable `--scroll-velocity` on the wrapper
element.
This enables powerful scroll-based animations like parallax effects, scroll-triggered animations, and more.

Add animations using data-cua-animate with values like "mask", "tilt", or "fade-in". 
Create custom scroll animations using CSS variables `--scroll-velocity`, `--scroll-progress`, and `--scroll-direction`. Check demos at https://cuajs.netlify.app.

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

Copyright (c) 2024 PHUCBM
