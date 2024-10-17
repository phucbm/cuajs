/**
 * Classes
 */
export const CLASSES = {
    hasCuaJs: 'cua-enabled',
    scrollToEnabled: 'cua-scroll-to-enabled',
    verticalEnabled: 'cua-vertical',
    hasSmoothScroll: 'cua-smooth',
    isScrollable: 'cua-scrollable',
    isNotScrollable: 'cua-not-scrollable',
    hasScroll: 'cua-has-scroll',

    // scroll observer
    isIntersecting: 'cua-intersecting',
    hasObserver: 'cua-has-observer',
};

/**
 * Attributes
 */
export const ATTRS = {
    init: 'data-cua',
    to: 'data-cua-to',
    section: 'data-cua-section',
    verticalScroller: 'data-cua-vertical-scroll',
    scrollObserve: 'data-cua-observe', // default selector for scroll observer
};

/**
 * Defaults
 */
export const DEFAULTS = {
    wrapper: undefined,

    // vertical scrollable content
    onScrollableContent: undefined, // callback on each scrollable content

    // smooth scroll
    smoothScroll: true,
    keyScrollDistance: 200, // distance to scroll on each key press (px)
    keyScroll: true, // enable to navigate by an arrow key
    autoScroll: false,
    scrollToClickPreventDefault: true,

    // responsive
    verticalBreakpoint: 1024, // (int)number for CSS breakpoint
    smoothVerticalScroll: true, // smooth scroll for vertical mode

    // scroll observer
    once: false, // run the enter callback only once
    rootMargin: "0px", // root margin for IntersectionObserver
    threshold: 0.3, // threshold for IntersectionObserver
}