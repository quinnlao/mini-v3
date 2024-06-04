<template>
  <MultiTagGroup
      v-model="tagList"
      closable
      :collapse-tag-count="3"
      creatable
      editable
      size="default"
      style="width: 50%"
      :tag-props="{
      label: 'name',
    }"
      @on-add="handleAdd"
  >
    <!--    <template #create-input> -->
    <!--      <el-button>ssss</el-button> -->
    <!--    </template> -->
  </MultiTagGroup>
  <MultiTagGroup
      v-model="tagList1"
      closable
      :collapse-tag-count="3"
      creatable
      editable
      size="small"
      style="width: 50%;margin-top: 50px"
      :tag-props="{
      label: 'name',
    }"
      @on-add="handleAdd"
  />
  <MultiTagGroup
      v-model="tagList1"
      closable
      :collapse-tag-count="3"
      :creatable="{
      direction: 'end',
    }"
      editable
      size="large"
      style="width: 50%;margin-top: 50px"
      :tag-props="{
      label: 'name',
    }"
      @on-add="handleAdd"
  >
        <template #create-input>
          <el-button>ssss</el-button>
        </template>
  </MultiTagGroup>
  <MultiTagGroup
      v-model="tagList"
      closable
      :collapse-tag-tip="{
      disabled: true,
    }"
      :creatable="{
      direction: 'end',
    }"
      editable
      size="small"
      style="width: 50%;margin-top: 50px"
      :tag-props="{
      label: 'name',
    }"
      @on-add="handleAdd"
  />
</template>

<script>
import MultiTagGroup from "@/components/MultiTagGroup/multi-tag-group.vue";

export default {
  name: 'TagGroupDemo',
  components: {
    MultiTagGroup,
  },
  data () {
    return {
      tagList: [
        {
          name: '标签一',
          type: 'danger',
          key: 1,
        },
        {
          name: '标签二标签二标签二',
          type: 'info',
          key: 2,
        },
        {
          name: '标签三',
          type: 'info',
          key: 3,
        },
        {
          name: '标签四',
          type: 'warning',
          key: 4,
        },
        {
          name: '标签五',
          type: 'info',
          key: 5,
        }
      ],

      tagList1: [
        {
          name: '标签一',
          type: '',
          key: 1,
          closable: false,
        },
        {
          name: '标签二标签二标签二',
          type: 'info',
          key: 2,
        },
        {
          name: '标签三',
          type: 'info',
          key: 3,
        },
        {
          name: '标签四',
          type: 'warning',
          key: 4,
        },
        {
          name: '标签五',
          type: 'info',
          key: 5,
        }
      ],
    };
  },

  methods: {
    handleAdd () {
      this.$message.info('change');
    },
  },
};
</script>