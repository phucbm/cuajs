import {initDragToScroll} from './drag-to-sroll'
import {initScrollerSync} from './scroller-sync'
import {LenisSmoothScroll} from './lenis-smooth-scroll'
import {initResizeWatcher, isVerticalMode} from './responsive'
import {ScrollTo} from './scroll-to'
import {ATTRS, CLASSES, DEFAULTS} from './configs'
import {Styling} from './styling'
import {EventsManager, getOptionsFromAttribute} from "@phucbm/os-util";
import {isScrollable} from "./utils";
import {initAutoScroll} from "./auto-scroll";
import {initScrollObserver} from "./scroll-observer";


/**
 * Private class
 */
class CuaJsClass{
    constructor(options){
        const config = {...DEFAULTS, ...options};

        this.wrapper = config.wrapper;
        if(!this.wrapper){
            console.warn(`Wrapper element is not defined`)
            return;
        }

        // validate options
        this.options = getOptionsFromAttribute({
            target: this.wrapper,
            defaultOptions: config,
            attributeName: ATTRS.init,
            numericValues: ['verticalBreakpoint']
        });

        // init events manager
        this.events = new EventsManager(this, {
            names: [
                'onScroll', 'onInit',
                'onSectionChange',
                'onBreakpointChange',

                // data-cua-to
                'onScrollToClick', 'onScrollToComplete'
            ]
        });

        // add body class
        document.body.classList.add(CLASSES.hasCuaJs)

        // vertical scroll content
        this.verticalScroller = this.wrapper.querySelectorAll(`[${ATTRS.verticalScroller}]`)

        // sections
        this.sections = this.wrapper.querySelectorAll(`[${ATTRS.section}]`);
        this.activeSectionIndex = undefined;
        this.orientation = undefined;

        /** RESPONSIVE **/
        initResizeWatcher(this)
        this.isVerticalMode = () => isVerticalMode(this.options.verticalBreakpoint)

        /** STYLING **/
        this.style = new Styling(this)

        /** SCROLL **/
        this.isSmoothScroll = this.options.smoothScroll && typeof Lenis !== 'undefined'
        if(this.isSmoothScroll){
            this.wrapper.classList.add(CLASSES.hasSmoothScroll)

            this.lenis = new LenisSmoothScroll(this)
        }else{
            initScrollerSync(this.wrapper)
        }

        // auto scroll
        initAutoScroll(this);

        /** DRAG **/
        // drag wrapper
        initDragToScroll({element: this.wrapper})

        // drag vertical content
        this.verticalScroller.forEach(item => {
            initDragToScroll({
                element: item,
                // set cursor
                releaseCursor: isScrollable(item) ? 'ns-resize' : 'default',
                orientation: 'y',
            })
        })


        /** SCROLL OBSERVE ELEMENT **/
        initScrollObserver(this);

        /** NAVIGATE **/
        this.navigate = new ScrollTo(this);

        // event: init
        this.events.fire('onInit');
    }

    /******************************
     * EVENTS
     ******************************/
    /**
     * Assign late-events
     */
    on(eventName, callback){
        this.events.add(eventName, callback);
    }

    /**
     * Assign Scroll Observer
     * @param element
     * @param options
     * @param enter
     * @param leave
     * @param once
     */
    assignScrollObserver({element, options = this.options, enter, leave, once = DEFAULTS.once}){
        const tempOptions = {
            root: this.isVerticalMode() ? null : this.wrapper,
            rootMargin: options.rootMargin,
            threshold: options.threshold,
        };


        // save to disconnect later
        let observer;
        this.on('onBreakpointChange', ({orientation}) => {
            // disconnect old observer if exists and orientation is changed
            if(observer) observer?.disconnect();

            // check if element is visible on the screen
            let isEnter = false;

            // create new Intersection Observer
            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // if once is true and isEnter is true, return
                    if(once && isEnter) return;

                    if(entry.isIntersecting){
                        // run enter callback
                        if(typeof enter === 'function') enter(entry);

                        // add class to the element
                        entry.target.classList.add(CLASSES.isIntersecting);

                        // set isEnter to true
                        isEnter = true;
                    }else{
                        // not run leave callback if not entered
                        if(!isEnter) return;

                        // run leave callback
                        if(typeof leave === 'function') leave(entry);

                        // remove class from the element
                        entry.target.classList.remove(CLASSES.isIntersecting);
                    }
                });
            }, tempOptions);

            observer.observe(element);

            // add class to the element
            element.classList.add(CLASSES.hasObserver);
        });
    }
}

// only one instance of CuaJs on a page
window.CuaInstance = undefined;
window.CuaJs = {
    init: options => {
        window.CuaInstance = new CuaJsClass(options);
        return window.CuaInstance;
    },
}

// init with attribute
document.querySelectorAll('[data-cua]').forEach(wrapper => CuaJs.init({wrapper}))