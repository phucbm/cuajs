// https://github.com/studio-freight/lenis
import {fireEvent} from "./utils";

export class LenisSmoothScroll{
    constructor(context){
        if(!Lenis) return;

        this.context = context;
        this.element = context.wrapper;
        this.isInit = false;
        this.instance = undefined; // assign in init()

        this.lenisOptions = {
            smoothWheel: true,
            smoothTouch: true,
            lerp: 0.08,
        };

        this.init(this.element);
    }

    init(element = this.element){
        // prevent double init
        if(this.isInit) return;

        // set prevent lenis for vertical scroll content
        this.context.verticalScroller?.forEach(item => {
            item.setAttribute('data-lenis-prevent', '');
        });

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

    initVerticalScroll(){
        // clear prevent lenis from vertical scroll content
        this.context.verticalScroller?.forEach(item => {
            item.removeAttribute('data-lenis-prevent');
        });


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


function getActiveSectionIndex(context, progress){
    let index = 0, fromSize = 0;
    for(const section of context.sections){
        const size = context.isVerticalMode() ? section.offsetHeight : section.offsetWidth;
        const toSize = fromSize + size;

        // console.log(fromSize, toSize, size)
        // if in range
        if(progress.pixel >= fromSize && progress.pixel <= toSize){
            return index;
        }

        index += 1;
        fromSize += size;
    }

    return -1;
}

// handle on scroll both vertical and horizontal
function handleOnScroll(event, context, axis){
    const progress = getScrollProgress(context, event);

    fireEvent(context, 'onScroll', {
        event,
        axis,
        progress,
        activeIndex: getActiveSectionIndex(context, progress)
    });
}