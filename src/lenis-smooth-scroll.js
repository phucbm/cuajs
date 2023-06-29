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
        lenis.on('scroll', event => {
            fireEvent(this.context, 'onScroll', {
                event,
                axis: 'horizontal',
                progress: getScrollProgress(this.context, event)
            });
        });

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
        lenis.on('scroll', event => {
            fireEvent(this.context, 'onScroll', {
                event,
                axis: 'vertical',
                progress: getScrollProgress(this.context, event)
            });
        });

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
    return scrollEvent.animatedScroll * 100 / maxScroll;
}