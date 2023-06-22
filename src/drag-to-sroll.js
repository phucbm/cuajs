// todo: try to apply kinetic drag (ref: http://davetayls.github.io/jquery.kinetic/)

// https://htmldom.dev/drag-to-scroll/
export function initDragToScroll({
                                     element,
                                     releaseCursor = 'ew-resize',
                                     orientation = 'xy' // x, y, xy
                                 }){
    let pos = {top: 0, left: 0, x: 0, y: 0};

    element.addEventListener('mousedown', mouseDownHandler);

    function mouseDownHandler(event){
        pos = {
            // The current scroll
            left: element.scrollLeft,
            top: element.scrollTop,
            // Get the current mouse position
            x: event.clientX,
            y: event.clientY,
        };

        element.addEventListener('mousemove', mouseGrabHandler);
        element.addEventListener('mouseup', mouseReleaseHandler);
        element.addEventListener('mouseout', mouseReleaseHandler);

        // Change the cursor and prevent user from selecting the text
        element.style.cursor = 'grabbing';
        element.style.userSelect = 'none';
    }

    function mouseGrabHandler(event){
        // How far the mouse has been moved
        const dx = event.clientX - pos.x;
        const dy = event.clientY - pos.y;

        // Scroll the el
        // todo: remove previous event to avoid overlap orientation
        switch(orientation){
            case "y":
                element.scrollTop = pos.top - dy;
                break;
            case "x":
                element.scrollLeft = pos.left - dx;
                break;
            case "xy":
            default:
                element.scrollTop = pos.top - dy;
                element.scrollLeft = pos.left - dx;
                break;
        }
    }

    function mouseReleaseHandler(event){
        element.removeEventListener('mousemove', mouseGrabHandler);
        element.removeEventListener('mouseup', mouseReleaseHandler);
        element.removeEventListener('mouseout', mouseReleaseHandler);

        element.style.cursor = releaseCursor;
        element.style.removeProperty('user-select');
    }
}
