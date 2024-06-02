<template>
  <el-tag v-only-click="handleOnlyClick" @click.stop="handleClick">
    点击
  </el-tag>
</template>

<script>
import vOnlyClick from '@/utils/directives/onlyClick.js';

export default {
  directives: {
    'only-click': vOnlyClick
  },
  data () {
    return {
    };
  },

  methods: {
    handleClick () {
      this.$message.info('click');
    },
    handleOnlyClick () {
      this.$message.info('only-click');
    },
  },
};
</script>