<template>
  <div class="select-container">
    <!-- input-->
    <input
      type="text"
      v-model="searchQuery"
      @focus="handleFocus"
      @blur="handleBlur"
      class="select-input"
    />
    <!--dropdown-->
    <ul
      v-if="visible"
      class="select_dropdown-Menu"
    >
      <li
        v-for="(item, index) in filteredOptions"
        :key="index"
        class="select_dropdown-Menu-item"
        @click="selectOption(item)"
      >
        {{item.label}}
      </li>
    </ul>
  </div>

</template>

<script setup>
import {computed, defineProps, ref, watch} from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  options: {
    type: Array,
    default: () => [],
    required: true,
  },
  filterMethod: {
    type: Function,
  }
});

const searchQuery = ref('');
const visible = ref(false);
const options = ref([...props.options]);

/**
 *
 * @type {ComputedRef<unknown>}
 */
const filteredOptions = computed(() => {
  const query = searchQuery.value.toLowerCase();
  if (props.filterMethod) {
    return options.value.filter((option) => props.filterMethod(option));
  }
  return options.value.filter((option) =>
      option?.label.toLowerCase().includes(query));
});

watch(
    () => props.modelValue,
    (newValue) => {
      // 外部组件更改 modelValue 时，输入框中显示的内容也会相应更新
      const selectedOption = options.value.find(option =>
        option?.value === newValue)
      searchQuery.value = selectedOption
          ? selectedOption?.label
          : '';
    },
    {immediate: true,}
)

const toggleMenu = () => {
  visible.value = true;
};
const handleFocus = () => {
  toggleMenu();
};
const handleBlur = () => {
  // 延迟执行失焦回调，确保menuItem的点击事件可以触发；
  setTimeout(() => {
    visible.value = false;
  }, 2000)
};

/**
 *
 * @param {object} option
 */
const selectOption = (option) => {
  selectedOption.value = option.label;
};

</script>

<style lang="scss" scoped>
.select-container {
  position: relative;
  width: 200px;

  .select-input {
    width: 100%;
    height: 32px;
    border: 1px solid #cccccc;
    border-radius: 2px;
    outline: none;
    &:focus {
      border-color: #1890ff;
    }
  }

  .select_dropdown-Menu {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: auto;
    border: 1px solid #cccccc;
    border-radius: 2px;
    list-style: none;
    margin: 0;
    padding: 0;
    .select_dropdown-Menu-item {
      padding: 10px;
      cursor: pointer;
      &:hover {
        background-color: #D6DFF7;
      }
    }
  }
}
</style>