// sync vertical scroll with horizontal scroll
// ref: https://alvarotrigo.com/blog/scroll-horizontally-with-mouse-wheel-vanilla-java/
export function initScrollerSync(element){
    // watch wheel event on wrapper element
    addWrapperEvent();

    function wheelHandler(event){
        //event.preventDefault(); // no prevent default to keep native horizontal scroll
        const scroll = event.deltaY;

        element.scrollLeft += scroll;
    }

    function addWrapperEvent(event){
        element.addEventListener("wheel", wheelHandler);
    }

    function removeWrapperEvent(event){
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