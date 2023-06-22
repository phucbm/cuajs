import {initDragToScroll} from "./drag-to-sroll";
import {initScrollerSync} from "./scroller-sync";


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

        initScrollerSync(this.wrapper);
        initDragToScroll({
            element: this.wrapper
        });
    }
}

window.EHS = {
    init: options => new EasyHorizontalScrolling(options)
};