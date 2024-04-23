<template>
  <div
    ref="root"
    class="ipd-affix"
    :style="rootStyle">
    <div
       class="ipd-affix__inner"
      :class="{'is-fixed': isFixed}"
      :style="affixStyle">
    </div>
    <slot />
  </div>
</template>

<script>
import {
  throttle,
} from 'src/utils/util.js';
import {
  isUndefined,
  isDefined,
} from 'src/utils/types.js';

export default {
  name: 'ElAffix',
  props: {
    offsetTop: {
      type: Number,
      default: 0,
    },
    offsetBottom: {
      type: Number,
      default: undefined,
    },
    target: {
      type: Function
    }
  },
  data() {
    return {
      affixStyle: {},
      isFixed: false,
      targetElement: null,
      initialRootStyle: null,
    };
  },
  computed: {
    rootStyle () {
      return {
        width: this.isFixed
          ? `${this.initialRootStyle.rootWidth}px`
          : '',
        height: this.isFixed
          ? `${this.initialRootStyle.rootHeight}px`
          : ''
      }
    }
  },
  watch: {
    isFixed (val) {
      this.$emit('change', val);
    }
  },
  mounted () {
    this.initTarget()
    this.throttleScrollHandler = throttle(this.update, 20);
    window.addEventListener('resize', this.throttleScrollHandler);
    this.targetElement.addEventListener('scroll', this.throttleScrollHandler);
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.throttleScrollHandler);
    this.targetElement.removeEventListener('scroll', this.throttleScrollHandler);
  },
  methods: {
    initTarget () {
      if (this.target) {
        this.targetElement = this.target();

        if (!this.targetElement) {
          throw new Error ('target is not existed')
        }
      }
      else {
        this.targetElement = window;
      }
    },
    update () {
      if (!this.targetElement || !this.$refs.root) {
        return;
      }
      const offsetTop = this.getOffsetTop();
      const offsetBottom = this.getOffsetBottom();
      const rootRect = this.$refs.root.getBoundingClientRect();
      const targetRect = this.getTargetRect(this.targetElement);
      const {
        fixedTop,
        fixedBottom,
      }= this.getFixedPosition(rootRect, targetRect, offsetTop, offsetBottom);

      if (isDefined(this.offsetTop) && isUndefined(this.offsetBottom === undefined)) {
          this.isFixed = Boolean(rootRect.top < targetRect.top && this.targetElement);
      }
      else {
          this.isFixed = Boolean(rootRect.bottom > targetRect.bottom  && this.targetElement);
      }

      if (this.isFixed && (isDefined(fixedTop) || isDefined(fixedBottom))){
        this.affixStyle = {
          position: 'fixed',
          width: `${rootRect.width}px`,
          height: `${rootRect.height}px`,
        };
        this.updateAffixStyle(fixedTop, fixedBottom);
      }

      if (!this.isFixed) {
        this.affixStyle = null;
      }
    },
    updateAffixStyle (fixedTop, fixedBottom) {
      if (isDefined(fixedTop)) {
        this.affixStyle.top = `${fixedTop}px`
      }
      else if (isDefined(fixedBottom)) {
        this.affixStyle.bottom = `${fixedBottom}px`
      }
    },
    getTargetRect(target) {
      return target !== window
        ? target.getBoundingClientRect()
        : {
          top: 0,
          bottom: target.innerHeight,
          left: 0
        };
    },
    getOffsetTop() {
      return isUndefined(this.offsetBottom) && isUndefined(this.offsetTop)
        ? 0
        : this.offsetTop;
    },
    getOffsetBottom() {
      return this.offsetBottom;
    },

    getFixedPosition (rootRect, targetRect, offsetTop, offsetBottom) {
      let fixedTop;
      let fixedBottom;

      if (isDefined(offsetTop) && targetRect && targetRect.top > rootRect.top - offsetTop) {
        fixedTop = offsetTop + targetRect.top
      }

      if (isDefined(offsetBottom) && targetRect.bottom < rootRect.bottom + offsetBottom) {
        fixedBottom = offsetBottom + window.innerHeight - targetRect.bottom;
      }

      return {
        fixedTop,
        fixedBottom
      }
    },
  }
};
</script>