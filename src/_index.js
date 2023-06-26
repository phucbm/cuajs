import {initDragToScroll} from "./drag-to-sroll";
import {initScrollerSync} from "./scroller-sync";
import {LenisSmoothScroll} from "./lenis-smooth-scroll";


/**
 * Private class
 */
class EasyHorizontalScrolling{
    constructor(options){
        this.options = {
            wrapper: undefined,
            ...options
        };
        this.wrapper = this.options.wrapper;
        if(!this.wrapper){
            console.warn(`Wrapper element is not defined`);
            return;
        }


        // init scrolling
        this.isSmoothScroll = typeof Lenis !== 'undefined';
        if(this.isSmoothScroll){
            this.lenis = new LenisSmoothScroll(this.wrapper);
        }else{
            initScrollerSync(this.wrapper);
        }

        // init drag
        this.verticalScroller = this.wrapper.querySelectorAll('[data-ehs-vertical-scroll]');

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
    }
}

window.EHS = {
    init: options => new EasyHorizontalScrolling(options)
};