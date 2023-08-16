/**
 * Debounce (ignore all, run the last)
 * https://www.freecodecamp.org/news/javascript-debounce-example/
 * @param func
 * @param timeout
 * @returns {(function(...[*]): void)|*}
 */
export function debounce(func, timeout = 150){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}


/**
 * Debounce leading (run the first, ignore the rest)
 * https://www.freecodecamp.org/news/javascript-debounce-example/
 * @param func
 * @param timeout
 * @returns {(function(...[*]): void)|*}
 */
export function debounceLeading(func, timeout = 150){
    let timer;
    return (...args) => {
        if(!timer){
            func.apply(this, args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
        }, timeout);
    };
}


/**
 * Get array with unique values
 * https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
 * @param array
 * @returns {*}
 */
export function arrayUnique(array){
    function onlyUnique(value, index, self){
        return self.indexOf(value) === index;
    }

    return array.filter(onlyUnique);
}


/**
 * Sort array of integers
 * @param array
 * @param asc
 * @returns {*}
 */
export function arraySortInteger(array, asc = true){
    return array.sort(function(a, b){
        return asc ? a - b : b - a;
    });
}


/**
 * Set CSS
 * @param target
 * @param props
 */
export function setCSS(target, props){
    const items = target.length ? target : [target];

    items.forEach(item => {
        Object.assign(item.style, props);
    });
}


/**
 * Console log
 * @param context
 * @param status
 * @param message
 */
export function log(context, status, ...message){
    if(context.options.dev){
        console?.[status](...message);
    }
}


/**
 * Generate unique ID
 */
export function uniqueId(prefix = ''){
    return prefix + (+new Date()).toString(16) +
        (Math.random() * 100000000 | 0).toString(16);
}

// https://stackoverflow.com/a/57658945/6453822
export function isScrollable(element){
    // if(element.scrollTopMax !== undefined)
    //     return e.scrollTopMax > 0; //All Hail Firefox and it's superior technology!
    //
    // if(e == document.scrollingElement) //If what you're checking is BODY (or HTML depending on your css styles)
    //     return e.scrollHeight > e.clientHeight; //This is a special case.

    const isCSSScrollable = ["scroll", "auto"].indexOf(getComputedStyle(element).overflowY) >= 0;
    const isContentScrollable = element.scrollHeight > element.clientHeight;

    return isContentScrollable && isCSSScrollable;
}


/**
 * Is JSON string
 * https://stackoverflow.com/a/32278428/6453822
 * @param string
 * @returns {any|boolean}
 */
export function isJSON(string){
    try{
        return (JSON.parse(string) && !!string);
    }catch(e){
        return false;
    }
}


/**
 * Get element offsets
 * https://github.com/jquery/jquery/blob/d0ce00cdfa680f1f0c38460bc51ea14079ae8b07/src/offset.js#L87
 * @param element : HTMLElement
 * @returns {{top: *, left: *}|{top: number, left: number}}
 */
export function getOffset(element){
    if(!element.getClientRects().length){
        return {top: 0, left: 0};
    }

    const rect = element.getBoundingClientRect();
    const win = element.ownerDocument.defaultView;
    return {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
    };
}


/**
 * Viewport size
 * @returns {{w: number, h: number}}
 */
export function viewport(){
    return {
        w: (window.innerWidth || document.documentElement.clientWidth),
        h: (window.innerHeight || document.documentElement.clientHeight)
    };
}

/**
 * Scroll position
 * @returns {{top: number, left: number}}
 */
export function scroll(){
    return {
        left: (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0),
        top: (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0)
    };
}


/**
 * Get element relative offsets
 * @param element : HTMLElement
 * @returns {{top_bottom: number, center_bottom: number, top: *, left: *, offsetHeight: number, top_top: number, offsetWidth: number, bottom_top: number, center_top: number, bottom_bottom: number}}
 */
export function getRelativeOffset(element){
    const left = getOffset(element).left;
    const top = getOffset(element).top;
    const offsetWidth = element.offsetWidth;
    const offsetHeight = element.offsetHeight;

    // distance from [anchor] of element to [anchor] of viewport
    const top_top = top - scroll().top;
    const top_bottom = top_top - viewport().h;
    const bottom_bottom = top_bottom + offsetHeight;
    const bottom_top = top_top + offsetHeight;
    const center_top = bottom_top - offsetHeight * 0.5;
    const center_bottom = top_bottom + offsetHeight * 0.5;

    const left_left = left - scroll().left;
    const left_right = left_left - viewport().w;
    const right_right = left_right + offsetWidth;
    const right_left = left_left + offsetWidth;
    const center_left = right_left - offsetWidth * 0.5;
    const center_right = left_right + offsetWidth * 0.5;

    return {
        left_left,
        left_right,
        right_right,
        right_left,
        center_left,
        center_right,

        top_top,
        top_bottom,
        bottom_bottom,
        bottom_top,
        center_top,
        center_bottom,

        left, top, offsetWidth, offsetHeight,
    };
}


export function getVisibility(element, isHorizontal = false){
    const offset = getRelativeOffset(element);
    let visible_a, visible_b, pixel, proportion

    if(!isHorizontal){
        visible_a = Math.max(0, Math.min(element.offsetHeight, -1 * offset.top_bottom));
        visible_b = Math.max(0, Math.min(element.offsetHeight, offset.bottom_top));
        pixel = Math.min(visible_a, visible_b, viewport().h);
        proportion = pixel / element.offsetHeight;
    }else{
        visible_a = Math.max(0, Math.min(element.offsetWidth, -1 * offset.left_right));
        visible_b = Math.max(0, Math.min(element.offsetWidth, offset.right_left));

        pixel = Math.min(visible_a, visible_b, viewport().w);
        proportion = pixel / element.offsetWidth;
    }

    return {pixel, proportion};
}

export function getTheMostVisible(elements, atLeastPixel = 0, isHorizontal = false){
    let mostVisibleElement = undefined, maxVisibility = {pixel: 0},
        isFound = false,
        index = 0, maxIndex = undefined;
    for(const element of elements){
        const visibility = getVisibility(element, isHorizontal);
        if(visibility.pixel >= atLeastPixel && visibility.pixel > maxVisibility.pixel){
            maxVisibility = visibility;
            mostVisibleElement = element;
            maxIndex = index;
            isFound = true;
        }
        index++;
    }
    return {
        isFound, index: maxIndex,
        el: mostVisibleElement,
        ...maxVisibility
    };
}