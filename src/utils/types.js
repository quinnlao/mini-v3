export function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
}

export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isHtmlElement(node) {
    return node && node.nodeType === Node.ELEMENT_NODE;
}


export const isUndefined = (val)=> {
    return val === void 0;
};

export const isDefined = (val) => {
    return val !== undefined && val !== null;
};
