// todo: try to apply kinetic drag (ref: http://davetayls.github.io/jquery.kinetic/)

// https://htmldom.dev/drag-to-scroll/
export function initDragToScroll(el){
    let pos = {top: 0, left: 0, x: 0, y: 0};

    el.addEventListener('mousedown', mouseDownHandler);

    function mouseDownHandler(event){
        pos = {
            // The current scroll
            left: el.scrollLeft,
            top: el.scrollTop,
            // Get the current mouse position
            x: event.clientX,
            y: event.clientY,
        };

        el.addEventListener('mousemove', mouseGrabHandler);
        el.addEventListener('mouseup', mouseReleaseHandler);
        el.addEventListener('mouseout', mouseReleaseHandler);

        // Change the cursor and prevent user from selecting the text
        el.style.cursor = 'grabbing';
        el.style.userSelect = 'none';
    }

    function mouseGrabHandler(event){
        // How far the mouse has been moved
        const dx = event.clientX - pos.x;
        const dy = event.clientY - pos.y;

        // Scroll the el
        el.scrollTop = pos.top - dy;
        el.scrollLeft = pos.left - dx;
    }

    function mouseReleaseHandler(event){
        el.removeEventListener('mousemove', mouseGrabHandler);
        el.removeEventListener('mouseup', mouseReleaseHandler);
        el.removeEventListener('mouseout', mouseReleaseHandler);

        el.style.cursor = 'grab';
        el.style.removeProperty('user-select');
    }
}
