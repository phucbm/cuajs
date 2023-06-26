// https://github.com/studio-freight/lenis
export class LenisSmoothScroll{
    constructor(element){
        if(!Lenis) return;

        const lenis = new Lenis({
            wrapper: element,
            content: element,
            wheelEventsTarget: element,
            lerp: 0.08,
            orientation: 'horizontal',
            gestureOrientation: 'both',
            smoothWheel: true,
            smoothTouch: true,
        })

        // lenis.on('scroll', (e) => {
        //     console.log(e)
        // })

        function raf(time){
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
    }
}