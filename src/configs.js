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
};

/**
 * Attributes
 */
export const ATTRS = {
    init: 'data-cua',
    to: 'data-cua-to',
    section: 'data-cua-section',
    verticalScroller: 'data-cua-vertical-scroll',
};

/**
 * Defaults
 */
export const DEFAULTS = {
    wrapper: undefined,

    // smooth scroll
    smoothScroll: true,
    keyScrollDist: 200, // px
    keyScroll: true,

    // responsive
    verticalBreakpoint: 1024, // (int)number for CSS breakpoint
    smoothVerticalScroll: true, // smooth scroll for vertical mode
}