const onlyClick = {
    // 定义自定义指令
    mounted(el, binding) {
        let startX, startY;
        // 在触发点击事件时，执行指定的函数
        el.addEventListener('mousedown',(event) => {
            // 检查事件是否由鼠标左键触发
            if(event.button === 0) {
                // 鼠标左键点击逻辑
                startX = event.clientX;
                startY = event.clientY;
            }
        } );

        el.addEventListener('mouseup', (event) => {
            const endX = event.clientX;
            const endY = event.clientY;
            // 如果鼠标移动距离很小，视为点击事件
            if (endX === startX  && endY === startY && event.button === 0) {
                // 触发指定的函数
                binding.value();
            }
        })
    }
};

export default onlyClick;