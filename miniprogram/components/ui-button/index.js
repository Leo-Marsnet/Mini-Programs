/**
 * 标准化按钮组件
 * 统一样式和交互行为
 */

Component({
  properties: {
    // 按钮类型
    type: {
      type: String,
      value: 'primary', // primary, secondary, success, warning, danger, ghost
    },

    // 按钮大小
    size: {
      type: String,
      value: 'medium', // small, medium, large
    },

    // 按钮形状
    shape: {
      type: String,
      value: 'rounded', // square, rounded, circle
    },

    // 是否禁用
    disabled: {
      type: Boolean,
      value: false,
    },

    // 是否加载中
    loading: {
      type: Boolean,
      value: false,
    },

    // 按钮文本
    text: {
      type: String,
      value: '',
    },

    // 图标
    icon: {
      type: String,
      value: '',
    },

    // 图标位置
    iconPosition: {
      type: String,
      value: 'left', // left, right
    },

    // 是否块级按钮
    block: {
      type: Boolean,
      value: false,
    },

    // 是否幽灵按钮
    ghost: {
      type: Boolean,
      value: false,
    },

    // 自定义样式类
    customClass: {
      type: String,
      value: '',
    },

    // 点击防抖时间(ms)
    debounce: {
      type: Number,
      value: 300,
    },
  },

  data: {
    isPressed: false,
    lastClickTime: 0,
  },

  methods: {
    /**
     * 按钮点击事件
     */
    onTap(e) {
      const now = Date.now();

      // 防抖处理
      if (now - this.data.lastClickTime < this.properties.debounce) {
        return;
      }

      // 禁用或加载中状态不响应点击
      if (this.properties.disabled || this.properties.loading) {
        return;
      }

      this.setData({ lastClickTime: now });

      // 触发点击事件
      this.triggerEvent('click', {
        detail: e.detail,
        timestamp: now,
      });
    },

    /**
     * 按钮按下
     */
    onTouchStart() {
      if (this.properties.disabled || this.properties.loading) {
        return;
      }

      this.setData({ isPressed: true });
    },

    /**
     * 按钮松开
     */
    onTouchEnd() {
      this.setData({ isPressed: false });
    },

    /**
     * 按钮取消
     */
    onTouchCancel() {
      this.setData({ isPressed: false });
    },

    /**
     * 获取按钮类名
     */
    getButtonClass() {
      const { type, size, shape, disabled, loading, block, ghost, customClass } = this.properties;
      const { isPressed } = this.data;

      const classes = ['ui-button'];

      // 类型样式
      classes.push(`ui-button--${type}`);

      // 大小样式
      classes.push(`ui-button--${size}`);

      // 形状样式
      classes.push(`ui-button--${shape}`);

      // 状态样式
      if (disabled) classes.push('ui-button--disabled');
      if (loading) classes.push('ui-button--loading');
      if (block) classes.push('ui-button--block');
      if (ghost) classes.push('ui-button--ghost');
      if (isPressed) classes.push('ui-button--pressed');

      // 自定义类名
      if (customClass) classes.push(customClass);

      return classes.join(' ');
    },
  },

  observers: {
    'type, size, shape, disabled, loading, block, ghost, customClass, isPressed'() {
      // 当属性变化时重新计算类名
      this.setData({
        buttonClass: this.getButtonClass(),
      });
    },
  },

  lifetimes: {
    attached() {
      this.setData({
        buttonClass: this.getButtonClass(),
      });
    },
  },
});
