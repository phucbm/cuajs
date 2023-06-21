import {uniqueId} from "./utils";


/**
 * Private class
 */
class EasyHorizontalScrolling{
    constructor(options){
        this.id = uniqueId();
        this.options = {
            el: undefined,
            ...options
        };

        this.options.el.innerHTML = 'Hello!';
    }
}


/**
 * Private class Controller
 * This class will hold instances of the library's objects
 */
class Controller{
    constructor(){
        this.instances = [];
    }

    add(instance){
        this.instances.push(instance);
    }

    get(id){
        return this.instances.filter(instance => instance.id === id)[0];
    }
}


/**
 * Public library data
 * access via window.EasyHorizontalScrollingController
 */
window.EasyHorizontalScrollingController = new Controller();


/**
 * Public library object
 * access via window.EasyHorizontalScrolling
 */
window.EasyHorizontalScrolling = {
    // init new instances
    init: (options = {}) => {
        const selector = options.selector || '[data-easy-horizontal-scrolling]';

        // init with selector
        document.querySelectorAll(selector).forEach(el => {
            window.EasyHorizontalScrollingController.add(new EasyHorizontalScrolling({el, ...options}));
        });
    },
    // Get instance object by ID
    get: id => window.EasyHorizontalScrollingController.get(id)
};

window.EasyHorizontalScrolling.init();