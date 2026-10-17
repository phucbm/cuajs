// https://github.com/studio-freight/lenis
import {getTheMostVisible, isScrollable} from "./utils";
import {CLASSES} from "./configs";

export class LenisSmoothScroll{
    constructor(context){
        if(!Lenis) return;

        this.context = context;
        this.element = context.wrapper;
        this.isInit = false;
        this.instance = undefined; // assign in init()
        this.rafId = undefined; // current raf loop, only one at a time

        this.lenisOptions = {
            smoothWheel: true,
            //smoothTouch: true,
            lerp: 0.08,
        };

        this.init(this.element);

        //Add has-scroll If found cua-scrollable element in section
        context.sections.forEach(section => {
            if(section.querySelector(`.${CLASSES.isScrollable}`)){
                section.classList.add(`${CLASSES.hasScroll}`);
            }
        })
    }


    init(element = this.element){
        // prevent double init
        if(this.isInit) return;

        // init vertical lenis
        setTimeout(() => {
            this.updateVerticalScroller();
        }, 100);

        // key listener and CSS variables listeners are attached once
        if(!this.isListenersAttached){
            this.initKeyScroll();
            this.initUpdateCSSVariables();
            this.isListenersAttached = true;
        }

        // init
        this.start(new Lenis({
            ...this.lenisOptions,
            ...{
                wrapper: element,
                content: element,
                wheelEventsTarget: element,
                orientation: 'horizontal',
                gestureOrientation: 'both',
            }
        }), 'horizontal');
    }

    /**
     * Replace the current Lenis instance (if any) and run a single raf loop for the new one
     */
    start(lenis, axis){
        this.stop();

        lenis.on('scroll', event => handleOnScroll(event, this.context, axis));

        const raf = time => {
            lenis.raf(time);
            this.rafId = requestAnimationFrame(raf);
        };
        this.rafId = requestAnimationFrame(raf);

        // save instance
        this.instance = lenis;

        // save status
        this.isInit = true;
    }

    /**
     * Destroy the current Lenis instance and its raf loop
     */
    stop(){
        cancelAnimationFrame(this.rafId);
        this.rafId = undefined;
        this.instance?.destroy();
        this.instance = undefined;
    }

    /**
     * Scroll with arrow keys
     */
    initKeyScroll(){
        if(!this.context.options.keyScroll) return;

        // run after init to get Lenis instance
        this.context.on('init', () => {
            const keyScrollDistance = this.context.options.keyScrollDistance;

            // on key press
            window.addEventListener("keydown", event => {
                // no instance when vertical smooth scroll is disabled
                if(!this.instance) return;

                let scrollOffset = this.instance.scroll;

                // left/up arrow key => go backward
                if(event.code === "ArrowLeft" || event.code === "ArrowUp") scrollOffset -= keyScrollDistance;

                // right/down arrow key => go forward
                if(event.code === "ArrowRight" || event.code === "ArrowDown") scrollOffset += keyScrollDistance;

                // smooth scroll
                this.instance.scrollTo(scrollOffset, {lock: false});
            })
        });
    }

    initVerticalScroll(){
        this.updateVerticalScroller(true);

        // init
        this.start(new Lenis({...this.lenisOptions}), 'vertical');
    }

    // https://github.com/studio-freight/lenis#instance-methods
    destroy(){
        // prevent double destroy
        if(!this.isInit) return;

        // destroy previous lenis
        this.stop();

        // init vertical lenis
        if(this.context.options.smoothVerticalScroll){
            this.initVerticalScroll();
        }

        // save status: horizontal lenis is not running (the vertical one may be)
        this.isInit = false;
    }


    updateVerticalScroller(forceVertical = false){
        // todo: make this able to update on window resize
        this.context.verticalScroller?.forEach(item => {
            const isItemScrollable = isScrollable(item);

            if(forceVertical){
                // clear prevent lenis from vertical scroll content
                item.removeAttribute('data-lenis-prevent');

                // all vertical scroller will be destroyed as the whole page is vertical now
                item.classList.remove(CLASSES.isScrollable);
            }else{
                if(isItemScrollable){
                    item.setAttribute('data-lenis-prevent', '');
                    item.classList.add(CLASSES.isScrollable);
                    item.classList.remove(CLASSES.isNotScrollable);
                }else{
                    item.classList.remove(CLASSES.isScrollable);
                    item.classList.add(CLASSES.isNotScrollable);
                }
            }

            // callback
            if(typeof this.context.options.onScrollableContent === 'function'){
                this.context.options.onScrollableContent({
                    item,
                    isScrollable: isItemScrollable,
                    forceVertical
                });
            }
        });
    }

    initUpdateCSSVariables(){
        const wrapper = this.context.wrapper;

        // custom properties are inherited, so every write on the wrapper restyles the whole wrapper subtree
        // => only write when the (rounded) value actually changes
        const cache = {};
        const setVariable = (name, value) => {
            if(cache[name] === value) return;
            cache[name] = value;
            wrapper.style.setProperty(name, value);
        };

        // update css variables
        this.context.on('scroll', ({
                                       axis,
                                       event,
                                       progress
                                   }) => {
            if(axis === 'vertical') return;

            const {velocity} = event;

            // update css variables to wrapper
            // velocity: scroll velocity
            setVariable('--scroll-velocity', Math.round(velocity * 10) / 10);

            // progress: scroll progress
            setVariable('--scroll-progress', Math.round(progress.progress * 10000) / 10000);

            // direction: scroll direction
            setVariable('--scroll-direction', velocity > 0 ? 1 : -1);
        });

        // remove css variables when break point changes
        this.context.on('breakpointChange', ({orientation}) => {
            if(orientation === 'vertical'){
                Object.keys(cache).forEach(name => delete cache[name]);
                this.context.wrapper.style.removeProperty('--scroll-velocity');
                this.context.wrapper.style.removeProperty('--scroll-progress');
                this.context.wrapper.style.removeProperty('--scroll-direction');
            }
        });
    }
}

// get scroll progress based on the current scroll axis
function getScrollProgress(context, scrollEvent){
    const wrapper = context.wrapper;
    const maxScroll = context.isVerticalMode()
        ? document.documentElement.scrollHeight - document.documentElement.clientHeight
        : wrapper.scrollWidth - wrapper.clientWidth;

    const total = context.isVerticalMode() ? document.documentElement.scrollHeight : context.wrapper.scrollWidth;
    const progress = scrollEvent.animatedScroll / maxScroll;
    const pixel = total * progress;

    return {progress, pixel, total};
}


// handle on scroll both vertical and horizontal
function handleOnScroll(event, context, axis){
    const progress = getScrollProgress(context, event);
    const visibleSection = getTheMostVisible(context.sections, 0, axis === 'horizontal');

    // fire custom event
    context.events.fire('onScroll', {
        event,
        axis,
        progress,
        activeIndex: context.activeSectionIndex,
        visibleSection
    });

    // when active section changes
    if(context.activeSectionIndex !== visibleSection.index){
        // update active index
        context.activeSectionIndex = visibleSection.index;

        // fire event on each section changes
        context.events.fire('onSectionChange', {
            event,
            section: visibleSection.el,
            index: context.activeSectionIndex
        });
    }
}