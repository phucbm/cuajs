import {initDragToScroll} from './drag-to-sroll'
import {initScrollerSync} from './scroller-sync'
import {LenisSmoothScroll} from './lenis-smooth-scroll'
import {initResizeWatcher, isVerticalMode} from './responsive'
import {ScrollTo} from './scroll-to'
import {ATTR, CLASS} from './constant'
import {Styling} from './styling'
import {getOptionsFromAttribute} from "@phucbm/os-util";


/**
 * Private class
 */
class CuaJsClass{
    constructor(options){
        this.config = {
            wrapper: undefined,

            // smooth scroll
            smoothScroll: true,

            // responsive
            verticalBreakpoint: 1024, // (int)number for CSS breakpoint
            smoothVerticalScroll: true, // smooth scroll for vertical mode

            ...options,
        }

        this.wrapper = this.config.wrapper;
        if(!this.wrapper){
            console.warn(`Wrapper element is not defined`)
            return;
        }

        // validate options
        this.options = getOptionsFromAttribute({
            target: this.wrapper,
            defaultOptions: this.config,
            attributeName: ATTR.init,
            numericValues: ['verticalBreakpoint']
        });

        // save late-assign events
        this.eventList = [];
        this.eventNames = ['onScroll'];

        // add body class
        document.body.classList.add(CLASS.hasCuaJs)

        // vertical scroll content
        this.verticalScroller = this.wrapper.querySelectorAll(`[${ATTR.verticalScroller}]`)

        // sections
        this.sections = this.wrapper.querySelectorAll(`[${ATTR.section}]`)

        /** RESPONSIVE **/
        initResizeWatcher(this)
        this.isVerticalMode = () => isVerticalMode(this.options.verticalBreakpoint)

        /** STYLING **/
        this.style = new Styling(this)

        /** SCROLL **/
        this.isSmoothScroll = this.options.smoothScroll && typeof Lenis !== 'undefined'
        if(this.isSmoothScroll){
            this.wrapper.classList.add(CLASS.hasSmoothScroll)

            this.lenis = new LenisSmoothScroll(this)
        }else{
            initScrollerSync(this.wrapper)
        }

        /** DRAG **/
        // drag wrapper
        initDragToScroll({element: this.wrapper})

        // drag vertical content
        this.verticalScroller.forEach(item => {
            initDragToScroll({
                element: item,
                releaseCursor: 'ns-resize',
                orientation: 'y',
            })
        })


        /** NAVIGATE **/
        new ScrollTo(this);
    }

    /**
     * Assign late-events
     */
    on(eventName, callback){
        if(this.eventNames.includes(eventName)){
            // initial array
            if(typeof this.eventList[eventName] === 'undefined') this.eventList[eventName] = [];

            // save callback
            this.eventList[eventName].push(callback);
        }else{
            console.warn(`Event "${eventName}" is not recognized!`);
        }
    }
}

// only one instance of CuaJs on a page
window.CuaJsData = undefined;
window.CuaJs = {
    init: options => {
        window.CuaJsData = new CuaJsClass(options)
    },
    get: () => window.CuaJsData
}

// init with attribute
document.querySelectorAll('[data-cua]').forEach(wrapper => CuaJs.init({wrapper}))