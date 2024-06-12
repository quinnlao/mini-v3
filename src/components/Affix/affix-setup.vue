<template>
  <div ref="root" class="ipd-affix" :style="rootStyle">
    <div class="ipd-affix__inner" :class="{'is-fixed': isFixed}" :style="affixStyle">
      <slot />
    </div>
  </div>
</template>

<script>
import { throttle } from 'src/utils/util.js';
import { isUndefined, isDefined } from 'src/utils/types.js';
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';

export default {
  name: 'QAffix',
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
      type: Function,
    },
  },
  setup(props, { emit }) {
    const affixStyle = reactive({});
    const isFixed = ref(false);
    const targetElement = ref(null);
    let initialRootStyle = null;

    const rootStyle = computed(() => ({
      width: isFixed.value ? `${initialRootStyle.rootWidth}px` : '',
      height: isFixed.value ? `${initialRootStyle.rootHeight}px` : '',
    }));

    const throttleScrollHandler = throttle(update, 20);

    function initTarget() {
      if (props.target) {
        targetElement.value = props.target();

        if (!targetElement.value) {
          throw new Error('target is not existed');
        }
      } else {
        targetElement.value = window;
      }
    }

    function update() {
      if (!targetElement.value || !rootRef.value) {
        return;
      }

      const offsetTop = getOffsetTop();
      const offsetBottom = getOffsetBottom();
      const rootRect = rootRef.value.getBoundingClientRect();
      const targetRect = getTargetRect(targetElement.value);
      const { fixedTop, fixedBottom } = getFixedPosition(
          rootRect,
          targetRect,
          offsetTop,
          offsetBottom
      );

      if (
          isDefined(props.offsetTop) &&
          isUndefined(props.offsetBottom === undefined)
      ) {
        isFixed.value = Boolean(rootRect.top < targetRect.top && targetElement.value);
      } else {
        isFixed.value = Boolean(
            rootRect.bottom > targetRect.bottom && targetElement.value
        );
      }

      if (isFixed.value && (isDefined(fixedTop) || isDefined(fixedBottom))) {
        affixStyle.position = 'fixed';
        affixStyle.width = `${rootRect.width}px`;
        affixStyle.height = `${rootRect.height}px`;
        updateAffixStyle(fixedTop, fixedBottom);
      }

      if (!isFixed.value) {
        affixStyle.position = '';
        affixStyle.width = '';
        affixStyle.height = '';
        affixStyle.top = '';
        affixStyle.bottom = '';
      }
    }

    function updateAffixStyle(fixedTop, fixedBottom) {
      if (isDefined(fixedTop)) {
        affixStyle.top = `${fixedTop}px`;
      } else if (isDefined(fixedBottom)) {
        affixStyle.bottom = `${fixedBottom}px`;
      }
    }

    function getTargetRect(target) {
      return target !== window
          ? target.getBoundingClientRect()
          : {
            top: 0,
            bottom: target.innerHeight,
            left: 0,
          };
    }

    function getOffsetTop() {
      return isUndefined(props.offsetBottom) && isUndefined(props.offsetTop)
          ? 0
          : props.offsetTop;
    }

    function getOffsetBottom() {
      return props.offsetBottom;
    }

    function getFixedPosition(rootRect, targetRect, offsetTop, offsetBottom) {
      let fixedTop;
      let fixedBottom;

      if (
          isDefined(offsetTop) &&
          targetRect &&
          targetRect.top > rootRect.top - offsetTop
      ) {
        fixedTop = offsetTop + targetRect.top;
      }

      if (
          isDefined(offsetBottom) &&
          targetRect.bottom < rootRect.bottom + offsetBottom
      ) {
        fixedBottom = offsetBottom + window.innerHeight - targetRect.bottom;
      }

      return {
        fixedTop,
        fixedBottom,
      };
    }

    const rootRef = ref(null);
    onMounted(() => {
      initialRootStyle = rootRef.value.getBoundingClientRect();
      initTarget();
      window.addEventListener('resize', throttleScrollHandler);
      targetElement.value.addEventListener('scroll', throttleScrollHandler);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', throttleScrollHandler);
      targetElement.value.removeEventListener('scroll', throttleScrollHandler);
    });

    return {
      rootStyle,
      affixStyle,
      isFixed,
      rootRef,
    };
  },
};
</script>
