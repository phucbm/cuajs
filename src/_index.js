import {initDragToScroll} from "./drag-to-sroll";
import {initScrollerSync} from "./scroller-sync";
import {LenisSmoothScroll} from "./lenis-smooth-scroll";
import {initResizeWatcher} from "./responsive";
import {ScrollTo} from "./scroll-to";
import {ATTR, CLASS} from "./constant";


/**
 * Private class
 */
class EasyHorizontalScrolling{
    constructor(options){
        this.options = {
            wrapper: undefined,

            // smooth scroll
            smoothScroll: true,

            // responsive
            verticalBreakpoint: 1024, // (int)number for CSS breakpoint, function for boolean condition
            smoothVerticalScroll: true, // smooth scroll for vertical mode

            ...options
        };
        this.wrapper = this.options.wrapper;
        if(!this.wrapper){
            console.warn(`Wrapper element is not defined`);
            return;
        }

        // add body class
        document.body.classList.add(CLASS.hasEHS);

        // vertical scroll content
        this.verticalScroller = this.wrapper.querySelectorAll(`[${ATTR.verticalScroller}]`);


        /** SCROLL **/
        this.isSmoothScroll = this.options.smoothScroll && typeof Lenis !== 'undefined';
        if(this.isSmoothScroll){
            this.wrapper.classList.add(CLASS.hasSmoothScroll);

            this.lenis = new LenisSmoothScroll(this);
        }else{
            initScrollerSync(this.wrapper);
        }

        /** DRAG **/
        // drag wrapper
        initDragToScroll({element: this.wrapper});

        // drag vertical content
        this.verticalScroller.forEach(item => {
            initDragToScroll({
                element: item,
                releaseCursor: 'ns-resize',
                orientation: 'y'
            });
        });

        /** RESPONSIVE **/
        initResizeWatcher(this);


        /** NAVIGATE **/
        new ScrollTo(this);
    }
}

window.EHS = {
    init: options => new EasyHorizontalScrolling(options)
};