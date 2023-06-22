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
    syncScroller(element = this.element){
        // watch wheel event on wrapper element
        addWrapperEvent();

        function wheelHandler(event){
            //event.preventDefault(); // no prevent default to keep native horizontal scroll
            const scroll = event.deltaY;

            element.scrollLeft += scroll;
        }

        function addWrapperEvent(){
            element.addEventListener("wheel", wheelHandler);
        }

        function removeWrapperEvent(){
            element.removeEventListener("wheel", wheelHandler);
        }

        /**
         * For vertical scrolling inside
         */
        const verticalScroller = this.element.querySelectorAll('[data-ehs-vertical-scroll]');
        verticalScroller.forEach(item => {
            // enter -> remove wrapper event
            item.addEventListener('mouseenter', removeWrapperEvent);

            // leave -> re-assign wrapper event
            item.addEventListener('mouseleave', addWrapperEvent);
        });
    }
}

window.EasyHorizontalScrolling = {
    init: options => new EasyHorizontalScrolling(options)
};