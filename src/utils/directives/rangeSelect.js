import {
    PopupManager,
} from 'src/utils/popup/index.js';

// 选框初始样式
const SELECTION_BOX_STYLE = `border: 1px solid #1183ED;
                             background-color: rgba(17, 131, 237, 0.1);
                             position: fixed;
                             z-index: 1000;
                             pointer-events: none;
                             display: none`;

/**
 * 绘制选框
 * @param {number} startX 起点X坐标
 * @param {number} startY 起点Y坐标
 * @return {HTMLElement} 初始选框
 */
function createSelectionBox (startX, startY) {
    const selectionBox = document.createElement('div');
    selectionBox.className = 'ipd-selection-box';
    selectionBox.style.cssText = SELECTION_BOX_STYLE;
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.zIndex = String(PopupManager.nextZIndex());

    return selectionBox;
}

/**
 * 更新选框的位置及大小
 * @param {HTMLElement} selectionBox 选框区域
 * @param {number} startX 起点X坐标
 * @param {number} startY 起点Y坐标
 * @param {number} endX 终点X坐标
 * @param {number} endY 终点Y坐标
 */
function updateSelectionBox (selectionBox, startX, startY, endX, endY) {
    selectionBox.style.display = '';
    selectionBox.style.width = `${Math.abs(endX - startX)}px`;
    selectionBox.style.height = `${Math.abs(endY - startY)}px`;
    selectionBox.style.left = `${Math.min(startX, endX)}px`;
    selectionBox.style.top = `${Math.min(startY, endY)}px`;
}

/**
 * 清除选框
 * @param {boolean} isSelectable 是否允许选择
 * @param {HTMLElement} target 指令所绑定的元素
 * @param {HTMLElement} selectionBox 选框范围
 * @param {event} event 当前事件
 */
function removeSelectionBox (isSelectable, target, selectionBox, event) {
    if (!isSelectable) {
        return;
    }

    if (event.button !== 0) {
        return;
    }

    if (target.querySelector('.ipd-selection-box')) {
        target.removeChild(selectionBox);
    }
}

/**
 * 判断可选元素是否在当前选中范围内
 * @param {node} element 可选元素
 * @param {HTMLElement} selectionBox 选框范围
 * @return {boolean} 是否在选框范围内
 */
function isElementInSelection (element, selectionBox) {
    const elementRect = element.getBoundingClientRect();
    const selectionRect = selectionBox.getBoundingClientRect();

    return (
        elementRect.left < selectionRect.right
        && elementRect.right > selectionRect.left
        && elementRect.top < selectionRect.bottom
        && elementRect.bottom > selectionRect.top
    );
}

/**
 * 只调用一次，指令第一次绑定到元素时调用
 * 注意：框选的可选元素需要通过binding传入其绑定selector;
 * @param {HTMLElement} el 指令所绑定的元素，可以用来直接操作 DOM
 * @param {object} binding 一个对象
 * @param {Function} binding.value 指令的回调函数
 */
const rangeSelect = {
    mounted (el, binding) {
        let startX;
        let startY;
        let endX;
        let endY;
        let isSelectable = false;
        let selecting = false;
        let selectionBox;
        let selectedElements;

        const {
            selector, callback,
        } = binding.value;

        el.addEventListener('mousedown', (event) => {
            // 判断是否为鼠标左键被按下
            if (event.buttons !== 1) {
                return;
            }

            startX = event.clientX;
            startY = event.clientY;
            isSelectable = true;
            selectionBox = createSelectionBox(startX, startY);
            document.body.appendChild(selectionBox);
        });

        el.addEventListener('mousemove', (event) => {
            if (event.buttons !== 1) {
                return;
            }

            if (isSelectable) {
                endX = event.clientX;
                endY = event.clientY;
                selecting = Boolean(Math.abs(endX - startX) || Math.abs(endY - startY));

                // 更新框选区域大小
                if (selecting) {
                    updateSelectionBox(selectionBox, startX, startY, endX, endY);
                }
                // 选框范围内选中元素
                selectedElements = Array.from(el.querySelectorAll(selector)).filter((element) =>
                    isElementInSelection(element, selectionBox));
            }
        });

        /**
         * 完成框选
         * @param {event} event 当前事件
         */
        const finishSelect = (event) => {
            removeSelectionBox(isSelectable, document.body, selectionBox, event);
            isSelectable = false;

            // 确保callback仅在框选结束后调用一次
            if (selecting && selectedElements?.length) {
                // 调用回调函数，并返回选中的可选元素
                callback(selectedElements);
            }
            selecting = false;
        };

        el.addEventListener('mouseup', (event) => {
            finishSelect(event);
        });

        el.addEventListener('mouseleave', (event) => {
            if (isSelectable) {
                finishSelect(event);
            }
        });
    },
};

export default rangeSelect;
