import {debounce} from "./utils";
import {CLASSES} from "./configs";


export function initResizeWatcher(context){
    const handle = () => {
        // update CSS
        context.style.update();
        const isVerticalLayout = isVerticalMode(context.options.verticalBreakpoint);
        const orientation = isVerticalLayout ? 'vertical' : 'horizontal';

        if(isVerticalLayout){
            // add destroy class to wrapper
            document.body.classList.add(CLASSES.verticalEnabled);

            // destroy smooth scroll
            context.lenis?.destroy();
        }else{
            // remove class
            document.body.classList.remove(CLASSES.verticalEnabled);

            // init smooth scroll
            context.lenis?.init();
        }

        context.orientation = orientation;

        // fire
        context.events.fire('onBreakpointChange', {orientation});
    };

    window.addEventListener('load', handle);
    window.addEventListener('resize', debounce(handle, 300));
}


export function isVerticalMode(verticalBreakpoint){
    if(typeof verticalBreakpoint === 'number'){
        // compare with window.width
        if(window.innerWidth <= verticalBreakpoint){
            return true;
        }
    }

    if(typeof verticalBreakpoint === 'function'){
        return verticalBreakpoint();
    }

    return false;
}