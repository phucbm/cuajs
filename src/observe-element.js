import {ATTRS, CLASSES} from "@/configs";

export const initObserveElement = (context) => {
    if(!context.options.scrollObserver) return;

    document.querySelectorAll(`[${ATTRS.horizontalScrollObserver}]`).forEach(targetElement => {
        context.observeElement({
            element: targetElement,
            options: {
                root: context.wrapper,
                rootMargin: "0px",
                threshold: 0.1
            },
            enter: (target) => {
                target.classList.add(CLASSES.isVisible);
            },
            leave: (target) => {
                target.classList.remove(CLASSES.isVisible);
            }
        });
    })

};