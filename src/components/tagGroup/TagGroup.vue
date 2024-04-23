<template>
  <div class="tag-group">
    <template v-if="inputPosition === 'start'">
      <slot name="input">
        <el-input
            v-if="creatable"
            v-model="newTag"
            @keyup.enter="addTag"
            class="add-tag-input"
            @blur="handleGroupBlur"
            @Input="handleGroupInput"
            @keydown.backspace="handleGroupBackspace"
        />
      </slot>
    </template>
    <div v-for="(tag, index) in visibleTags" :key="index" class="tag-wrapper">
      <el-tag :name="tag.name" :closable="editable" @close="removeTag(index)" @click="copyTag(tag)">
        {{ tag.name }}
      </el-tag>
    </div>
    <el-tooltip  placement="top-start">
      <el-tag class="collapse-button">
        {{ collapsed ? `+${remainingTags}` : '' }}
      </el-tag>
      <template #content>
      <span class="collapsed-tag">
        {{ remainingTags }}
      </span>
      </template>
    </el-tooltip>
    <template>
      <el-tag class="collapse-button">
        {{ collapsed ? `+${remainingTags}` : '' }}
      </el-tag>
    </template>
    <slot name="input">
      <template v-if="inputPosition === 'end'">
        <slot name="input">
          <el-input
              v-if="creatable"
              v-model="newTag"
              @keyup.enter="addTag"
              class="add-tag-input"
              @blur="handleGroupBlur"
              @Input="handleGroupInput"
              @keydown.backspace="handleGroupBackspace"
          />
        </slot>
      </template>
    </slot>
  </div>
</template>

<script>
import { ElTag } from "element-plus";
export default {
  name: 'TagGroup',
  components: {ElTag},
  props: {
    tags: {
      type: Array,
      default: () => []
    },
    maxVisibleTags: {
      type: Number,
      default: 3
    },
    editable: {
      type: Boolean,
      default: true
    },
    creatable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      collapsed: true,
      newTag: '',
      inputPosition: 'start'
    };
  },
  computed: {
    visibleTags() {
      return this.collapsed ? this.tags.slice(0, this.maxVisibleTags) : this.tags;
    },
    showCollapseButton() {
      return this.collapsed && this.tags.length > this.maxVisibleTags;
    },
    collapsedTags() {
      return this.tags.slice(this.maxVisibleTags);
    },
    remainingTags() {
      return this.tags.length - this.maxVisibleTags;
    },
    tagContent() {
      return this.collapsed ? `+${this.remainingTags}` : '';
    },
  },
  methods: {
    toggleCollapse() {
      this.collapsed = !this.collapsed;
    },
    addTag() {
      if (this.newTag) {
        // eslint-disable-next-line vue/no-mutating-props
        this.tags.push(this.newTag);
        this.newTag = '';
      }
    },
    removeTag(index) {
      // eslint-disable-next-line vue/no-mutating-props
      this.tags.splice(index, 1);
    },
    copyTag(tag) {
      const textArea = document.createElement('textarea');
      textArea.value = tag;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.$message.success('已复制: ' + tag.name);
    },
    handleGroupBlur() {
    //   .....
    },
    handleGroupInput() {
      //   .....
    },
    handleGroupBackspace() {
      //   .....
    },
  }
};
</script>

<style>
.tag-group {
  display: flex;
  flex-wrap: wrap;
}

.tag-wrapper {
  margin: 4px;
}

.collapse-button {
  margin-top: 4px;
  cursor: pointer;
}

.add-tag-input {
  width: 10%;
  margin-left: 8px;
}


</style>
