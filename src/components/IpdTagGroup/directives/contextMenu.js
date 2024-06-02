class ContextMenu {
    constructor(options) {
        if (ContextMenu.instance) {
            return ContextMenu.instance;
        }

        this.options = options;
        this.instance = this.createMenu();
        ContextMenu.instance = this;
    }

    createMenu() {
        const ul = document.createElement("ul");
        ul.classList.add("custom-context-menu");
        const { menus } = this.options;
        if (menus && menus.length > 0) {
            for (let menu of menus) {
                const li = document.createElement("li");
                li.textContent = menu.name;
                li.onclick = menu.onClick;
                ul.appendChild(li);
            }
        }
        const body = document.querySelector("body");
        body.appendChild(ul);
        return ul;
    }

    showMenu(e) {
        e.preventDefault();
        this.instance.style.top = `${e.clientY}px`;
        this.instance.style.left = `${e.clientX}px`;
        this.instance.classList.remove("hidden");
    }

    hideMenu() {
        this.instance.classList.add("hidden");
    }

    static getInstance(options) {
        if (!ContextMenu.instance) {
            new ContextMenu(options);
        }
        return ContextMenu.instance;
    }
}


export const createContextMenu = (options) => {
    function createMenu () {
        const menu = document.createElement('ul');
        menu.classList.add('ipd-tag-group__context-menu');
        const {
            menus,
        } = options;

        if (menus.length) {
            for (const option of menus) {
                const menuItem = document.createElement('li');
                menuItem.textContent = option.name;
                menuItem.onclick = option.onClick;
                menu.appendChild(menuItem);
            }
        }
        document.body.appendChild(menu);

        return menu;
    }

    return createMenu();
};
export default ContextMenu;
