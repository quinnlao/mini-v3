// import {
//     PopupManager,
// } from 'src/utils/popup/index.js';
/**
 * 展示右键菜单
 * @param {event} event 右键菜单事件
 * @param {object} contextMenu 实例
 */
export function showMenu (event, contextMenu) {
    event.preventDefault();
    const menus = contextMenu;
    menus.style.zIndex = 9999;
    menus.style.top = `${event.clientY}px`;
    menus.style.left = `${event.clientX}px`;
    menus.style.display = '';
}
/**
 * 隐藏右键菜单
 * @param {object} contextMenu 实例
 */
export function hideMenu (contextMenu) {
    const menus = contextMenu;
    menus.style.display = 'none';
}
/**
 * 创建右键自定义菜单
 * @param {object} options 菜单选项
 * @return {HTMLElement} 自定义菜单实例
 */
export const createContextMenu = (options) => {
    function createMenu () {
        const menu = document.createElement('ul');
        menu.classList.add('multi-tag-group__context-menu');
        menu.style.cssText = 'display: none';
        const {
            menus,
        } = options;
        if (menus.length) {
            for (const option of menus) {
                const menuItem = document.createElement('li');
                const menuItemLeft = document.createElement('span');
                const menuItemRight = document.createElement('div');
                menuItemLeft.textContent = option.name;
                menuItemRight.textContent = option.hotKey;
                menuItem.onclick = option.onClick;
                menuItem.appendChild(menuItemLeft);
                menuItem.appendChild(menuItemRight);
                menu.appendChild(menuItem);
            }
        }
        document.body.appendChild(menu);
        return menu;
    }
    return createMenu();
};