<template>
  <div
      ref="tagGroupRef"
      v-click-out-of-range="handleTagGroupBlur"
      class="ipd-tag-group"
      :class="`ipd-tag-group--${tagGroupSize}`"
      tabindex="1"
      @contextmenu="handleContextMenu"
      @keydown.backspace="handleBackSpace"
      @keydown.ctrl.c="handleCopy"
      @keydown.exact="handleSelectionChange"
  >
    <span
        v-only-click="handleTagGroupClick"
        v-range-select="{
        selector: '.selectable',
        callback: handleRangeSelection,
      }"
        class="ipd-tag-group__wrapper"
    >
      <template v-if="inputPosition === 'start'">
        <slot name="create-input">
          <ElInput
              v-if="inputActivated"
              ref="inputRef"
              v-model="newTag"
              class="ipd-add-tag-input"
              :size="TAG_GROUP_INNER_SIZE_MAP[tagGroupSize]"
              @keyup.enter="addTag"
          />
          <ElButton
              v-else
              class="ipd-tag-group__add-button"
              :size="TAG_GROUP_INNER_SIZE_MAP[tagGroupSize]"
              @click.stop="activeInput"
          >
            {{ `+ ${t('el.ipdTagGroup.addNewTag')}` }}
          </ElButton>
        </slot>
      </template>
      <ElTag
          v-for="(tag, index) in visibleTags"
          :key="index"
          class="selectable"
          :closable="isClosable(tag)"
          :color="tag.color || tagCroupColor"
          :data-id="index"
          disable-transitions
          :effect="tagGroupEffect"
          :hit="tagIsBordered(index)"
          :max-width="tagGroupMaxWidth"
          :size="tagGroupSize"
          :type="tag.type || tagCroupType"
          @click.stop
          @close="removeTag(tag)"
      >
        {{ tag[`${tagProps.label}`] }}
      </ElTag>
      <template v-if="isCollapsed">
        <ElTooltip
            v-if="collapseTagTip"
            v-bind="collapsedTooltipConfig"
        >
          <ElTag
              class="collapse-button"
              :color="tagCroupColor"
              :effect="tagGroupEffect"
              :size="tagGroupSize"
              :type="tagCroupType"
              @click.stop
          >
            {{ isDefined(props.collapseTagCount)
              ? `+ ${restTagsNumber}`
              : '' }}
          </ElTag>
          <template #content>
            <div class="isCollapse-tags">
              <span>
                {{ getCollapsedTags() }}
              </span>
            </div>
          </template>
        </ElTooltip>
        <template v-else>
          <ElTag
              v-only-click="handleTagClick"
              class="collapse-button"
              :color="tagCroupColor"
              :effect="tagGroupEffect"
              :size="tagGroupSize"
              :type="tagCroupType"
              @click.stop
          >
            {{ isDefined(props.collapseTagCount)
              ? `+ ${restTagsNumber}`
              : '' }}
          </ElTag>
        </template>
      </template>
      <template v-if="creatable.direction === 'end'">
        <slot name="create">
          <ElInput
              v-if="inputActivated"
              ref="inputRef"
              v-model="newTag"
              class="ipd-add-tag-input"
              :size="TAG_GROUP_INNER_SIZE_MAP[tagGroupSize]"
              @keyup.enter="addTag"
          />
          <ElButton
              v-else
              class="ipd-tag-group__add-button"
              :size="TAG_GROUP_INNER_SIZE_MAP[tagGroupSize]"
              @click.stop="activeInput"
          >
            {{ `+ ${t('el.ipdTagGroup.addNewTag')}` }}
          </ElButton>
        </slot>
      </template>
    </span>
  </div>
</template>

<script setup>
import ElButton from 'packages/button/index.js';
import ElInput from 'packages/input/index.js';
import vClickOutOfRange from 'packages/ipd-tag-group/src/assit-directives/click-out-of-range.js';
import {
  createContextMenu, hideMenu, showMenu,
} from 'src/components/IpdTagGroup/contextMenu.js';
import {
  TAG_GROUP_INNER_SIZE_MAP,
} from 'packages/ipd-tag-group/src/config.js';
import ElTag from 'packages/tag/index.js';
import ElTooltip from 'packages/tooltip/index.js';
// import vOnlyClick from 'src/directives/only-click.js';
import vRangeSelect from 'src/directives/range-select.js';
import {
  t,
} from 'src/locale/index.js';
import {
  globalConfig,
} from 'src/utils/global-config.js';
import {
  isDefined,
  isObject,
} from 'src/utils/types.js';
import {
  computed, inject, nextTick, onMounted, onUnmounted, ref, shallowRef, useSlots, watch,
} from 'vue';

const props = defineProps({
  // 全局tag的背景色
  color: String,

  // tag-group的全局size
  size: {
    type: String,
    default: 'medium',
  },

  // ag-group的全局effect
  effect: String,
  // 全局tag类型
  type: String,

  // 全局tag内容的最大宽度
  tagMaxWidth: [
    Number,
    String
  ],

  // tag列表
  modelValue: {
    type: Array,

    default: () =>
        [],
  },

  // tag的props
  tagProps: {
    type: Object,

    default () {
      return {
        label: 'label',
      };
    },
  },

  // 标签的最大展示数量
  collapseTagCount: Number,

  // 折叠数字tag是否展示tooltip
  collapseTagTip: {
    type: [
      Boolean,
      Object
    ],

    default: true,
  },

  // 是否允许移除标签
  closable: {
    type: Boolean,
  },

  // 是否允许创建
  creatable: {
    type: [
      Boolean,
      Object
    ],

    default: false,
  },
});

const emitEvent = defineEmits([
  'remove',
  'add',
  'focus',
  'selected-change'
]);

const slots = useSlots();

/**
 * inject
 */
const elFormItem = inject('elFormItem', {});
// 自定义复制选项
const customizedCopyOption = inject('customizedCopyOption', {});

// 新标签
const newTag = ref('');
// 回退按钮点击次数，奇数时标签为hit状态，偶数时直接删除
const backspaceCount = ref(0);
// 选中标签在当前标签列表的index数组
const selectedTagIndex = ref([]);
// tagGroup的宽度
const tagGroupWidth = ref(0);
// 输入框是否激活
const inputActivated = ref(false);

/**
 * ref
 */
const inputRef = shallowRef();
const tagGroupRef = shallowRef();

// 当前标签渲染列表
const tagList = computed(() =>
    props.modelValue);

/**
 * 折叠时展示的标签
 * @return {*[]}
 */
const visibleTags = computed(() =>
    isDefined(props.collapseTagCount)
        ? tagList.value.slice(0, props.collapseTagCount)
        : tagList.value);

/**
 * 是否折叠
 * @return {boolean}
 */
const isCollapsed = computed(() =>
    isDefined(props.collapseTagCount) && tagList.value.length > props.collapseTagCount);

/**
 * 被折叠的tag
 * @return {object[]}
 */
const collapsedTags = computed(() =>
    tagList.value.slice(props.collapseTagCount));

/**
 * 折叠时剩余tag数量
 * @return {number}
 */
const restTagsNumber = computed(() =>
    Math.max(tagList.value.length - props.collapseTagCount, 0));

/**
 * tagGroup当前的全局尺寸
 * @return {string}
 */
const tagGroupSize = computed(() =>
    props.size || (elFormItem || {}).size || globalConfig.size || '');

/**
 * tagGroup当前的全局tag背景色
 * @return {string|undefined}
 */
const tagCroupColor = computed(() =>
    props.color || undefined);

/**
 * tagCroup当前的全局tag类型
 * @return {string|undefined}
 */
const tagCroupType = computed(() =>
    props.type || undefined);

/**
 * tagCroup当前的全局tag类型
 * @return {string|undefined}
 */
const tagGroupEffect = computed(() =>
    props.effect || undefined);

/**
 * tagCroup当前的全局最大宽度
 * @return {string|undefined}
 */
const tagGroupMaxWidth = computed(() => {
  let currentMaxWidth = props.tagMaxWidth;

  if (props.tagMaxWidth > tagGroupWidth.value) {
    currentMaxWidth = tagGroupWidth.value;
  }

  return currentMaxWidth || undefined;
});

/**
 * 当前的所有选中标签
 * @return {Array}
 */
const selectedTags = computed(() =>
    selectedTagIndex.value.map((index) =>
        tagList.value[index]));

/**
 * 获取当前tag是否可关闭
 * @param {object} tag 当前tag对象
 * @return {boolean} 是否可关闭
 */
const isClosable = (tag) => {
  // 兼容选择器option禁用
  if (tag.disabled) {
    return props.closable && !tag.disabled;
  }

  if (isDefined(tag.closable)) {
    return tag.closable;
  }

  return props.closable;
};

/**
 * 可以进行移除的所有标签
 * @return {Array}
 */
const removableTags = computed(() =>
    selectedTags.value
        .filter((tag) =>
            isClosable(tag))
        .filter((tag) =>
            !tag.disabled));

/**
 * 输入框的位置
 * @return {string}
 */
const inputPosition = computed(() => {
  if (props.creatable?.direction) {
    return 'end';
  }

  if (props.creatable) {
    return 'start';
  }
});

/**
 * 折叠标签的tooltip配置
 * @return {object} tooltip配置对象
 */
const collapsedTooltipConfig = computed(() => {
  if (isObject(props.collapseTagTip)) {
    return {
      placement: 'top',
      ...props.collapseTagTip,
    };
  }

  return {
    placement: 'top',
  };
});

watch(
    selectedTags,
    (currentSelectedTags) => {
      emitEvent('selected-change', currentSelectedTags);
    }
);

/**
 * 获取全部折叠tag详情
 * @return {string} 被折叠tag的拼接字符串
 */
const getCollapsedTags = () =>
    collapsedTags.value
        .map((tag) =>
            tag[props.tagProps.label])
        .join(',');

/**
 * 添加标签
 */
const addTag = () => {
  if (newTag.value) {
    // 创建tag为重复 刷新其位置
    const existingIndex = tagList.value.findIndex((tag) =>
        tag[props.tagProps.label] === newTag.value);

    if (existingIndex !== -1) {
      tagList.value.splice(existingIndex, 1);
    }

    const newTagObject = {
      [props.tagProps.label]: newTag.value,
    };

    if (inputPosition.value === 'start') {
      tagList.value.unshift(newTagObject);
    }
    else {
      tagList.value.push(newTagObject);
    }
    emitEvent('add', newTag.value);
    newTag.value = '';
  }
};

/**
 * 移除标签
 * @param {object} tags 当前标签
 */
const removeTag = (tags) => {
  let removedTag;

  if (!Array.isArray(tags)) {
    // 通过tag的close事件移除标签
    const index = tagList.value.indexOf(tags);
    tagList.value.splice(index, 1);
    removedTag = [tags];
  }
  else {
    // 通过选中标签来移除标签
    tags.forEach((tag) => {
      const index = tagList.value.indexOf(tag);
      tagList.value.splice(index, 1);
    });
    removedTag = tags;
  }

  selectedTagIndex.value = [];
  backspaceCount.value = 0;
  emitEvent('remove', removedTag);
};

/**
 * 监听当前退格键是否为奇数次
 * @return {boolean} 是否为奇数
 */
const isBackspaceOdd = () =>
    backspaceCount.value > 0 && Boolean(backspaceCount.value % 2);

/**
 * 是否高亮当前tag
 * @param {number} index 当前tag下标
 * @return {boolean} hit状态
 */
const tagIsBordered = (index) => {
  if (!backspaceCount.value && !selectedTagIndex.value.length) {
    return false;
  }

  // backspace选中tag
  if (!selectedTagIndex.value.length && isBackspaceOdd()) {
    if (props.collapseTagCount) {
      selectedTagIndex.value = Array.of(tagList.value.length - restTagsNumber.value - 1);
    }
    else {
      selectedTagIndex.value = Array.of(tagList.value.length - 1);
    }
  }

  return selectedTagIndex.value?.includes(index);
};

/**
 * 处理框选中元素
 * @param {object} selectedElements 当前选中的元素
 */
const handleRangeSelection = (selectedElements) => {
  // 将框选范围内选中元素转化为对应的tag
  selectedTagIndex.value = selectedElements?.map((item) =>
      Number(item?.dataset.id));
};

/**
 * 处理退格键盘事件
 */
const handleBackSpace = () => {
  if (props.creatable && inputRef.value?.isComposing) {
    return;
  }

  // 标签组为空和输入框内有内容时，不监听backspace
  if (!tagList.value.length || newTag.value || props.creatable?.query) {
    return;
  }

  if (!selectedTags.value.length && inputPosition.value === 'end' && inputActivated.value) {
    // 使用后置输入框时，无选中标签时，输入框被激活后首次按下backspace选中最后一个标签
    backspaceCount.value++;
  }


  if (!selectedTags.value.length && inputPosition.value === 'end' && Boolean(slots.create)) {
    // 使用后置输入框为插槽时，在无选中标签时，首次按下backspace选中最后一个标签
    backspaceCount.value++;
  }

  if (!selectedTags.value.length && isBackspaceOdd()) {
    return;
  }

  if (selectedTags.value.length) {
    removeTag(removableTags.value);
    // 删除后移除自定义菜单
    removeContextMenu();
  }
};

/**
 * 处理复制操作
 */
const handleCopy = () => {
  const customizedReproducibleText = customizedCopyOption.value?.context;
  const textArea = document.createElement('textarea');
  const defaultReproducibleText = selectedTags.value.map((tag) =>
      tag[props.tagProps.label]).join(',');

  if (customizedReproducibleText) {
    // 兼容选人默认复制内容
    textArea.value = customizedReproducibleText;
  }
  else {
    textArea.value = defaultReproducibleText;
  }
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  selectedTagIndex.value = [];
  // 复制结束后移除自定义菜单
  removeContextMenu();
};

// 自定义菜单选项
const contextMenuOptions = computed(() => {
  let copyMessage;

  if (customizedCopyOption.value?.name) {
    copyMessage = customizedCopyOption.value?.name;
  }
  else {
    copyMessage = t('el.ipdTagGroup.copyText');
  }

  const defaultMenuOptions = [
    {
      name: copyMessage,
      hotKey: 'Ctrl+C',
      onClick () {
        handleCopy();
      },
    },
    {
      name: t('el.ipdTagGroup.deleteTag'),
      hotKey: 'Backspace',
      onClick () {
        if (selectedTags.value.length) {
          removeTag(removableTags.value);
        }
      },
    }
  ];

  return {
    menus: defaultMenuOptions,
  };
});

// 自定义右键菜单
const contextMenu = createContextMenu(contextMenuOptions.value);

/**
 * 处理右键自定义菜单
 * @param {event} event
 */
const handleContextMenu = (event) => {
  if (selectedTagIndex.value.length) {
    showMenu(event, contextMenu);
  }
};

/**
 * 处理改变当前选中
 * @param {event} event 当前keyboard事件
 */
const handleSelectionChange = (event) => {
  /**
   * 移动当前选中标签
   * @param {number} offset 移动单位
   */
  function moveCurrentTag (offset) {
    const lastTagIndex = visibleTags.value.length - 1;

    if (!selectedTagIndex.value.length) {
      return;
    }

    let currentIndex = selectedTagIndex.value[0] + offset;

    if (currentIndex < 0) {
      // 第一个tag继续前移，则选中最后一个tag
      currentIndex = lastTagIndex;
    }
    else if (currentIndex > lastTagIndex) {
      // 最后一个tag继续后移，则选中第一个tag
      currentIndex = 0;
    }

    if (selectedTagIndex.value.length > 1) {
      // 已选标签为多个时
      if (offset < 0) {
        // 前移取第一个已选标签
        selectedTagIndex.value = [selectedTagIndex.value[0]];
      }
      else {
        // 后移取最后一个已选标签
        selectedTagIndex.value = [selectedTagIndex.value.pop()];
      }
    }
    else {
      selectedTagIndex.value = [currentIndex];
    }
  }

  switch (event.key) {
    case 'ArrowUp' :
      moveCurrentTag(-1);
      break;
    case 'ArrowLeft' :
      moveCurrentTag(-1);
      break;
    case 'ArrowDown' :
      moveCurrentTag(1);
      break;
    case 'ArrowRight' :
      moveCurrentTag(1);
      break;
    default :
      break;
  }
};

/**
 * 处理tag的点击事件
 */
const handleTagGroupClick = () => {
  if (event.target.tagName === 'I') {
    return;
  }

  // tagGroup内部点击无法被document监听，内部点击时隐藏右键菜单
  removeContextMenu();
  emitEvent('focus');
};

/**
 * 激活输入框
 */
const activeInput = async () => {
  inputActivated.value = true;
  await nextTick();

  if (props.creatable && inputActivated.value) {
    inputRef.value.focus();
    emitEvent('focus');
  }
};

const handleTagGroupBlur = () => {
  backspaceCount.value = 0;

  // 点击group外部时清除所有tag的选中效果
  if (selectedTagIndex.value.length) {
    selectedTagIndex.value = [];
  }
  inputActivated.value = false;
};


/**
 * 处理el-tag的点击事件
 */
const handleTagClick = () => {
  // 点击tag的关闭icon时，不触发tag的点击
  if (event.target.tagName === 'I') {
    return;
  }
  handleTagGroupClick();
};

/**
 * 移除右键菜单
 */
const removeContextMenu = () => {
  const exist = !String(contextMenu.getAttribute('class')).includes('hidden');

  if (exist) {
    hideMenu(contextMenu);
  }
};

onMounted(() => {
  tagGroupWidth.value = tagGroupRef.value.getBoundingClientRect().width;
  document.addEventListener('click', removeContextMenu);
  window.addEventListener('scroll', removeContextMenu, true);
});

onUnmounted(() => {
  document.removeEventListener('click', removeContextMenu);
  window.removeEventListener('scroll', removeContextMenu, true);
  removeContextMenu();
});

// 显式对外暴露公开实例
defineExpose({
  name: 'IpdTagGroup',
});
</script>