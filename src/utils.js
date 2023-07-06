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


/**
 * Fire an event
 * @param context
 * @param eventName
 * @param data
 */
export function fireEvent(context, eventName, data){
    // only when event exists
    if(!context.eventNames.includes(eventName)){
        console.warn(`Event "${eventName}" is not recognized!`);
        return;
    }
    const response = {instance: context, eventName, ...data};

    // fire event from option
    const eventFromOption = context.options[eventName];
    if(typeof eventFromOption === 'function') eventFromOption(response);

    // fire event from late-assign list
    const eventFromList = context.eventList[eventName];
    if(!!eventFromList?.length){
        eventFromList.forEach(callback => {
            if(typeof callback === 'function') callback(response);
        });
    }
}

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