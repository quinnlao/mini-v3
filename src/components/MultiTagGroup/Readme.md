## 一个可编辑的tag-group
![这是图片](/showCase.gif "Magic Gardens")(https://github.com/quinnlao/mini-v3/blob/develop/src/components/MultiTagGroup/showCase.gif)
### 有什么功能？
- 通过绑定列表数据驱动控制标签渲染, 可以直接作为select子组件使用
- 多个标签可折叠，并且控制其最大展示数量
- 通过鼠标**框选** 选中进行 **批量** 右键菜单操作复制、删除
- 键盘功能：复制，删除，切换当前选中，退格选中
- 配置creatable即可创建标签；也包括展示的配置功能：颜色、主题、大小等

### props
| Attribute        | Description        | Type           | Default             |
|------------------|--------------------|----------------|---------------------|
| modelValue       | tag列表              | Array/Object   | [ ]                 |
| tagProps         | tag的props配置        | Object         | { label: 'label', } |
| color            | 所有tag的color        | String         | -                   |
| size             | 所有tag的size         | String         | -                   |
| effect           | 所有tag的effect       | String         | -                   |
| type             | 所有tag的type         | String         | -                   |
| tagMaxWidth      | 所有tag的最大宽度         | String/Number  | -                   |
| collapseTagCount | 标签的最大展示数量          | Number         | 0                   |
| collapseTagTip   | 折叠数字tag是否展示tooltip | Boolean        | true                |
| closable         | 是否允许移除标签           | Boolean        | false               |
| creatable        | 是否允许创建             | String/Boolean | false               |

### event
...待补充

| Event           | Description |
|-----------------|-------------|
| remove          |             |
| add             |             |
| focus           |             |
| selected-change |             |

