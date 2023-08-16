// https://github.com/studio-freight/lenis
import { getSpacing, isScrollable } from './utils'
import {CLASSES} from "./configs";

export class LenisSmoothScroll{
    constructor(context){
        if(!Lenis) return;

        this.context = context;
        this.element = context.wrapper;
        this.isInit = false;
        this.instance = undefined; // assign in init()
        this.currentScroll = 0;
        this.scrollLeft = false;

        this.lenisOptions = {
            smoothWheel: true,
            //smoothTouch: true,
            lerp: 0.08,
        };


        this.init(this.element);
        console.log(this);

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
    const wrapper = context.wrapper
    const maxScroll = context.isVerticalMode()
      ? document.documentElement.scrollHeight - document.documentElement.clientHeight
      : wrapper.scrollWidth - wrapper.clientWidth

    const total = context.isVerticalMode() ? document.documentElement.scrollHeight : context.wrapper.scrollWidth
    const progress = scrollEvent.animatedScroll / maxScroll
    const pixel = maxScroll * progress

    return { progress, pixel, total }
}

// get range scroll in item index
function getRangeActive(context, index){
    let totalSpacing = { x: 0, y: 0 }
    const spacing = getSpacing(context.options.spacingToActive)

    for(let i = 0; i <= index; i++){
        totalSpacing.x += i === 0 ? 0 : context.sections[i].clientWidth
        totalSpacing.y += context.sections[i].clientHeight
    }

    return {
        from: {
            horizontal: index === 0 ? 0 : totalSpacing.x - context.sections[index].clientWidth + spacing,
            vertical: totalSpacing.y - context.sections[index].clientHeight,
        },
        to: {
            horizontal: index === 0 ? spacing : (index === context.sections.length - 1 ? totalSpacing.x : totalSpacing.x + spacing),
            vertical: totalSpacing.y,
        },
    }
}
function getActiveSectionIndex(context, progress){
    let result = 0,
      currentActiveIndex = 0;
    const spacingActive = getSpacing(context.options.spacingToActive);
    const threshold = context.isScrollLeft ? spacingActive : 1 - spacingActive;
    const precision = 0.01;

    let array = [];

    // active section
    const active = index => {
        for(const section of context.sections) section.classList.remove('active');
        context.sections[index].classList.add('active')
    }

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (Math.abs(entry.intersectionRatio - spacingActive) <= precision
              || Math.abs(entry.intersectionRatio + spacingActive - 1) <= precision
            ) {
                array.push(index);
            }
        });
    }, {
        root: null,
        threshold: 1,
    });

    context.sections.forEach((section, index) => {
        observer.observe(section);
        if (section.classList.contains('active')) result = index;
    });

    // find max index in array = active section
    console.log(array);

    return result;
}

// handle on scroll both vertical and horizontal
function handleOnScroll(event, context, axis){
    const progress = getScrollProgress(context, event);

    // check scroll left/right
    context.isScrollLeft = context.currentScroll >= progress.pixel;
    context.currentScroll = progress.pixel;

    context.events.fire('onScroll', {
        event,
        axis,
        progress,
        activeIndex: getActiveSectionIndex(context, progress)
    });
}