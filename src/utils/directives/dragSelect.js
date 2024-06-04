const SELECTION_BOX_STYLE = `border: 1px dashed #0099ff;
                                  background-color: #c3d5ed;
                                  opacity: 0.6;
                                  position: fixed;
                                  z-index: 1000;
                                  pointer-events: none;`;

function createSelectionBox(startX, startY) {
    const selectionBox = document.createElement('div');
    selectionBox.className = 'selection-box';
    selectionBox.style.cssText = SELECTION_BOX_STYLE;
    selectionBox.style.left = startX + 'px';
    selectionBox.style.top = startY + 'px';

    return selectionBox;
}

function updateSelectionBox(selectionBox, startX, startY, endX, endY) {
    selectionBox.style.width = Math.abs(endX - startX) + 'px';
    selectionBox.style.height = Math.abs(endY - startY) + 'px';
    selectionBox.style.left = Math.min(startX, endX) + 'px';
    selectionBox.style.top = Math.min(startY, endY) + 'px';
}

// function isElementInSelection(element, selectionBox) {
//     const elementRect = element.getBoundingClientRect();
//     const selectionRect = selectionBox.getBoundingClientRect();
//
//     return (
//         elementRect.left < selectionRect.right
//           && elementRect.right > selectionRect.left
//           && elementRect.top < selectionRect.bottom
//           && elementRect.bottom > selectionRect.top
//     );
// }

const dragSelect = {
    mounted(el, binding) {
        let startX;
        let startY;
        let endX;
        let endY;
        let selecting = false;
        let selectionBox;

        // 获取回调函数
        const {selector, callback} = binding.value;

        const handleMouseDown = (event) => {
            if (event.buttons !== 1) {
                return;
            }

            startX = event.clientX;
            startY = event.clientY;
            selecting = true;
            selectionBox = createSelectionBox(startX, startY);
            el.appendChild(selectionBox);

            // 在整个文档上添加mousemove和mouseup事件监听器
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        };

        const handleMouseMove = (event) => {
            if (selecting) {
                endX = event.clientX;
                endY = event.clientY;
                updateSelectionBox(selectionBox, startX, startY, endX, endY);

                // 获取选框范围
                const selectionRect = selectionBox.getBoundingClientRect();

                // 获取所有可选元素
                const selectableElements = Array.from(el.querySelectorAll(selector));

                // 筛选出在选框范围内的可选元素
                const selectedElements = selectableElements.filter((element) => {
                    const elementRect = element.getBoundingClientRect();
                    return (
                        elementRect.left < selectionRect.right &&
                        elementRect.right > selectionRect.left &&
                        elementRect.top < selectionRect.bottom &&
                        elementRect.bottom > selectionRect.top
                    );
                });

                // 调用回调函数，并将选中的元素传递给它
                callback(selectedElements);
            }
        };

        const handleMouseUp = (event) => {
            selecting = false;

            if (event.button !== 0) {
                return;
            }

            // 从整个文档上移除mousemove和mouseup事件监听器
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            // 移除选框
            if (el.querySelector('.selection-box')) {
                el.removeChild(selectionBox);
            }
        };

        // 在目标元素上添加mouseleave事件监听器
        el.addEventListener('mouseleave', () => {
            if (selecting) {
                selecting = false;
                // 移除选框
                if (el.querySelector('.selection-box')) {
                    el.removeChild(selectionBox);
                }
                // 从整个文档上移除mousemove和mouseup事件监听器
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            }
        });

        el.addEventListener('mousedown', handleMouseDown);
    },
};

export default dragSelect;



