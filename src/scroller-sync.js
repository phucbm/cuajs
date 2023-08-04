import {ATTRS} from "./configs";

// sync vertical scroll with horizontal scroll
// ref: https://alvarotrigo.com/blog/scroll-horizontally-with-mouse-wheel-vanilla-java/

export function initScrollerSync(element){
    // watch wheel event on wrapper element
    addHorizontalScroll();

    function addHorizontalScroll(event){
        element.addEventListener("wheel", horizontalScrollHandler);
    }

    function removeHorizontalScroll(event){
        element.removeEventListener("wheel", horizontalScrollHandler);
    }

    function horizontalScrollHandler(event){
        //event.preventDefault(); // no prevent default to keep native horizontal scroll
        const scroll = event.deltaY;

        element.scrollLeft += scroll;
    }


    /**
     * For vertical scrolling inside
     */
    const verticalScroller = element.querySelectorAll(`[${ATTRS.verticalScroller}]`);
    verticalScroller.forEach(item => {
        // enter -> remove wrapper event
        item.addEventListener('mouseenter', addVerticalScroll);

        // leave -> re-assign wrapper event
        item.addEventListener('mouseleave', removeVerticalScroll);
    });

    function removeVerticalScroll(event){
        element.style.cursor = 'ew-resize';
        addHorizontalScroll(event);
    }

    function addVerticalScroll(event){
        element.style.cursor = 'ns-resize';
        removeHorizontalScroll(event);
    }
}