const clickHandler = (e, callback, el) => {
    const { clientX, clientY } = e;
    const rect = el.getBoundingClientRect();
    if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
    ) {
        callback();
    }
};

const clickOutOfRange = {
    mounted(el, binding) {
        const { value: callback } = binding;

        const onClick = (e) => clickHandler(e, callback, el);

        document.addEventListener('click', onClick);

        el._clickOutside = onClick;
    },
    beforeUnmount(el) {
        document.removeEventListener('click', el._clickOutside);
        delete el._clickOutside;
    },
};

export default clickOutOfRange;