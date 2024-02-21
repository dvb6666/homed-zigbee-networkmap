import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import HOMEdZigbeeNetworkmapVue from './components/HOMEdZigbeeNetworkmap'

Vue.component('v-style', {
  render: function (createElement) {
    return createElement('style', this.$slots.default)
  }
})

const HOMEdZigbeeNetworkmapWrap = wrap(Vue, HOMEdZigbeeNetworkmapVue)

class HOMEdZigbeeNetworkmap extends HOMEdZigbeeNetworkmapWrap {
  get hass () {
    return this._hass
  }

  set hass (hass) {
    this._hass = hass
    const vm = this.vueComponent
    if (vm) {
      vm.hass = this._hass
    }
  }

  setConfig (config) {
    this._config = config
    const vm = this.vueComponent
    if (vm) {
      vm.config = this._config
    }
  }

  connectedCallback () {
    super.connectedCallback()
    const vm = this.vueComponent
    if (this._config) {
      vm.config = this._config
    }
    if (!vm.hass) {
      vm.hass = this._hass
    }
  }
}

window.customElements.define('homed-zigbee-networkmap', HOMEdZigbeeNetworkmap)
