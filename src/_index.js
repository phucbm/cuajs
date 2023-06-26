import {initDragToScroll} from "./drag-to-sroll";
import {initScrollerSync} from "./scroller-sync";
import {LenisSmoothScroll} from "./lenis-smooth-scroll";
import {initResizeWatcher} from "./responsive";


/**
 * Private class
 */
class EasyHorizontalScrolling{
    constructor(options){
        this.options = {
            wrapper: undefined,

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

        // vertical scroll content
        this.verticalScroller = this.wrapper.querySelectorAll('[data-ehs-vertical-scroll]');


        /** SCROLL **/
        this.isSmoothScroll = typeof Lenis !== 'undefined';
        if(this.isSmoothScroll){
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
    }
}

window.EHS = {
    init: options => new EasyHorizontalScrolling(options)
};