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
    hasScroll: 'cua-has-scroll'
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

    // vertical scrollable content
    onScrollableContent: undefined, // callback on each scrollable content

    // smooth scroll
    smoothScroll: true,
    keyScrollDistance: 200, // distance to scroll on each key press (px)
    keyScroll: true, // enable to navigate by a arrow key

    // active section
    spacingToActive: "30%", // px or %(of width window)

    // responsive
    verticalBreakpoint: 1024, // (int)number for CSS breakpoint
    smoothVerticalScroll: true, // smooth scroll for vertical mode
}