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
import {initObserveElement} from "@/observe-element";


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

        /** OBSERVE ELEMENT **/
        initObserveElement(this);

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

    observeElement({element, options, enter, leave}){
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    if(typeof enter === 'function') enter(entry.target);
                }else{
                    if(this.options.once) return;
                    if(typeof leave === 'function') leave(entry.target);
                }
            });
        }, options);

        observer.observe(element);
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