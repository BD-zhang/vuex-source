export default function (Vue) {
  // 获取版本号，后续根据版本进行不同的初始化操作
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // 兼容Vue1.x

    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  // 混入方法，接受当前环境vue实例对象
  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      // 如果当前实例已经有了store，则将$options.store赋值给this.store(用于根组件)
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      // 当前组件获取父组件的store
      this.$store = options.parent.$store
    }
  }
}
