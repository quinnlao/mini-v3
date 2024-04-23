<template>
  <tag-group :tags="tagList" :editable="true" :maxVisibleTags="3" creatable>
    
  </tag-group>
</template>
<script>
import TagGroup from './TagGroup.vue'

export default {
  components: {
    TagGroup,
  },
  data () {
    return {
      tagList: [
        { name: '标签一', type: '' },
        { name: '标签二', type: 'success' },
        { name: '标签三', type: 'info' },
        { name: '标签四', type: 'warning' },
        { name: '标签五', type: 'danger' }
      ],
    }
  }
}
</script>