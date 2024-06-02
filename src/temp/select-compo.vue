<template>
  <div class="select-container">
    <!-- input-->
    <input
      type="text"
      v-model="selectedOption"
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
        v-for="(item, index) in options"
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
import { defineProps, ref} from 'vue';

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
    required: true,
  }
});

const selectedOption = ref('');
const visible = ref(false);
const options = ref([...props.options]);

const toggleMenu = () => {
  visible.value = true;
};
const handleFocus = () => {
  toggleMenu();
};
const handleBlur = () => {
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