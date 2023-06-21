import {initDragToScroll} from "./drag-to-sroll";


/**
 * Private class
 */
class EasyHorizontalScrolling{
    constructor(options){
        this.options = {
            el: undefined,
            ...options
        };
        this.element = this.options.el;

        this.syncScroller();

        initDragToScroll(this.element);
    }

    // sync vertical scroll with horizontal scroll
    // ref: https://alvarotrigo.com/blog/scroll-horizontally-with-mouse-wheel-vanilla-java/
    syncScroller(){
        this.element.addEventListener("wheel", event => {
            //evt.preventDefault(); // no prevent default to keep native horizontal scroll
            const scroll = event.deltaY;

            this.element.scrollLeft += scroll;
        });
    }
}

window.EasyHorizontalScrolling = {
    init: options => new EasyHorizontalScrolling(options)
};