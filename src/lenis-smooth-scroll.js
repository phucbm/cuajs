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

        this.updateVerticalScroller();
        this.initKeyScroll();

        // init
        const lenis = new Lenis({
            ...this.lenisOptions,
            ...{
                wrapper: element,
                content: element,
                wheelEventsTarget: element,
                orientation: 'horizontal',
                gestureOrientation: 'both',
            }
        })

        // on horizontally scroll
        lenis.on('scroll', event => handleOnScroll(event, this.context, 'horizontal'));

        function raf(time){
            lenis.raf(time)
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // save instance
        this.instance = lenis;

        // save status
        this.isInit = true;
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
        const lenis = new Lenis({...this.lenisOptions});

        // on vertically scroll
        lenis.on('scroll', event => handleOnScroll(event, this.context, 'vertical'));

        function raf(time){
            lenis.raf(time)
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // save instance
        this.instance = lenis;

        // save status
        this.isInit = true;
    }

    // https://github.com/studio-freight/lenis#instance-methods
    destroy(){
        // prevent double destroy
        if(!this.isInit) return;

        // destroy previous lenis
        this.instance?.destroy();

        // init vertical lenis
        if(this.context.options.smoothVerticalScroll){
            this.initVerticalScroll();
        }

        // save status
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