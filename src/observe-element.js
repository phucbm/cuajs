import {ATTRS, CLASSES} from "./configs";

export const initObserveElement = (context) => {
    if(!context.options.scrollObserver) return;

    document.querySelectorAll(`[${ATTRS.horizontalScrollObserver}]`).forEach(element => {
        let isEnter = false;
        context.observeElement({
            element,
            enter: (entry) => {
                isEnter = true;
                entry.target.classList.add(CLASSES.isVisible);
            },
            leave: (entry) => {
                if(context.options.once && isEnter) return;

                entry.target.classList.remove(CLASSES.isVisible);
            }
        });
    });
};