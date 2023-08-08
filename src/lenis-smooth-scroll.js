// https://github.com/studio-freight/lenis
import {isScrollable} from "./utils";
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
    }

    init(element = this.element){
        // prevent double init
        if(this.isInit) return;

        // todo: make this able to update on window resize
        // set prevent lenis for vertical scroll content
        this.context.verticalScroller?.forEach(item => {
            if(isScrollable(item)){
                item.setAttribute('data-lenis-prevent', '');
                item.classList.add(CLASSES.isScrollable);
                item.classList.remove(CLASSES.isNotScrollable);
            }else{
                item.classList.remove(CLASSES.isScrollable);
                item.classList.add(CLASSES.isNotScrollable);
            }
        });

        // scroll when keypress executed
        if(this.context.options.keyScroll){
            const wrapper = element;
            const keyScrollDistance = this.context.options.keyScrollDistance;
            window.addEventListener("keydown", e => {
                // enter previous keyboard
                if(e.code === "ArrowLeft") wrapper.scrollLeft -= keyScrollDistance;

                // enter next keyboard
                if(e.code === "ArrowRight") wrapper.scrollLeft += keyScrollDistance;

                //scroll
                CuaJsData.lenis.instance.scrollTo(wrapper.scrollLeft, {lock: true});
            })
        }

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
            item.classList.remove(CLASSES.isScrollable);
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

    context.events.fire('onScroll', {
        event,
        axis,
        progress,
        activeIndex: getActiveSectionIndex(context, progress)
    });
}