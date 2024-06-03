// style
const POPOVER_STYLE = 'width: 10%; height: 30px; background-color: #1890ff; color: #fff; display: none; position: absolute'

/**
 *
 * @param element targetElement
 * @param content
 */
const Popover = {
    mounted (element, content) {
       const el = document.getElementsByTagName('button')[0];
        console.log(el);
        element.addEventListener('mousedown', () => {
            creatPopover(el, 5 ,5);
        })
        /**
         *
         * @param element
         * @param startX 起始x坐标
         * @param startY 起始y坐标
         */
        function creatPopover (element, startX, startY) {
            console.log(element);
            const rootRect = element.getBoundingClientRect();
            console.log(rootRect);
            const contentList = document.createElement('div');
            contentList.textContent = content.value;
            document.body.appendChild(contentList);
            contentList.className = 'popover_content';
            contentList.style.cssText = POPOVER_STYLE;
            //  定位逻辑；
            const {top, left} = rootRect;
            contentList.style.left = `${left + startX}px`;
            contentList.style.top = `${top - 2*startY}px`;
            contentList.style.display = ``;
        }
    }
}
export default Popover;