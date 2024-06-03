<template>
 <button
 v-popover="content">
   点击
 </button>
</template>
<script>
import Popover from "@/temp/pop";
export default {
  name: 'pop-over',
  directives: {
    Popover
  },
  data () {
    return {
      content: 'SSSSSS',
    }
  }
}
</script>


<style scoped>

</style>