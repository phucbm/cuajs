import {debounce} from "./utils";
import {CLASS} from "./constant";


export function initResizeWatcher(context){
    const handle = () => {
        if(isDestroy(context.options.verticalBreakpoint)){
            // add destroy class to wrapper
            document.body.classList.add(CLASS.verticalEnabled);

            // destroy smooth scroll
            context.lenis?.destroy();
        }else{
            // remove class
            document.body.classList.remove(CLASS.verticalEnabled);

            // init smooth scroll
            context.lenis?.init();
        }
    };

    window.addEventListener('load', handle);
    window.addEventListener('resize', debounce(handle, 300));
}


function isDestroy(verticalBreakpoint){
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