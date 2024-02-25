<template>
  <ha-card>
    <v-style>
      .net {
        height: 100%;
        margin: 0;
      }
      .node {
        stroke: var(--homed-zigbee-networkmap-node-color, rgba(18, 120, 98, .7));
        stroke-width: 3px;
        -webkit-transition: fill .5s ease;
        transition: fill .5s ease;
        fill: var(--homed-zigbee-networkmap-node-fill-color, #dcfaf3);
      }
      .node.selected {
        stroke: #caa455;
      }
      .node.pinned {
        stroke: var(--homed-zigbee-networkmap-node-pinned-color, rgba(190, 56, 93, .6));
      }
      .link {
        stroke: var(--homed-zigbee-networkmap-link-color, rgba(18, 120, 98, .5));
      }
      .link, .node {
        stroke-linecap: round;
      }
      .link:hover, .node:hover {
        stroke: var(--homed-zigbee-networkmap-hover-color, #be385d);
        stroke-width: 5px;
      }
      .link.selected {
        stroke: var(--homed-zigbee-networkmap-link-selected-color, rgba(202, 164, 85, .6));
      }
      .curve {
        fill: none;
      }
      .link-label, .node-label {
        fill: var(--homed-zigbee-networkmap-label-color, #127862);
      }
      .link-label {
        -webkit-transform: translateY(-.5em);
        transform: translateY(-.5em);
        text-anchor: middle;
      }
      #m-end path {
        fill: var(--homed-zigbee-networkmap-arrow-color, rgba(18, 120, 98, 0.7));
      }
      .node.coordinator {
        stroke: var(--homed-zigbee-networkmap-node-coordinator-color, rgba(224, 78, 93, .7));
      }
      .node.router {
        stroke: var(--homed-zigbee-networkmap-node-router-color, rgba(0, 165, 255, .7));
      }
      .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      {{ css }}
    </v-style>
    <d3-network :net-nodes="nodes" :net-links="links" :options="options" :link-cb="link_cb" ref="net" />
    <svg width="0" height="0">
      <defs>
        <marker id="m-end" markerWidth="10" markerHeight="10" refX="12" refY="2" orient="auto" markerUnits="strokeWidth" >
          <path d="M0,0 L0,4 L8,2 z"></path>
        </marker>
      </defs>
    </svg>
    <div class="card-actions">
      <div class="flex">
        <!-- <mwc-button @click="refresh">Refresh</mwc-button> -->
        <div class="time">{{ state }}</div>
      </div>
    </div>
  </ha-card>
</template>

<script>
import D3Network from 'vue-d3-network'
import isEqual from 'lodash.isequal'

export default {
  components: {
    D3Network
  },
  data () {
    return {
      init_failed: false,
      config: {},
      hass: null,
      nodes: [],
      links: [],
      state: ''
    }
  },
  computed: {
    options () {
      const config = this.config
      return {
        fontSize: config.font_size || 12,
        force: config.force || 3000,
        linkLabels: true,
        linkWidth: config.link_width || 2,
        nodeLabels: true,
        nodeSize: config.node_size || 16
      }
    },
    css () {
      return this.config.css || ''
    }
  },
  watch: {
    hass (newHass, oldHass) {
      const entity = this.config.entity
      if (newHass && entity) {
        const newAttr = newHass.states[entity].attributes
        let oldAttr = null
        if (oldHass) {
          oldAttr = oldHass.states[entity].attributes
        }
        if (newAttr !== oldAttr) {
          this.state = newHass.states[entity].state
        }
        if (!isEqual(newAttr, oldAttr)) {
          this.update()
        }
      }
    },
    config (newConfig, oldConfig) {
      if (newConfig) {
        this.$refs.net.size.h = newConfig.height || 400
      }
    }
  },
  methods: {
    link_cb (link) {
      link._svgAttrs = { 'marker-end': 'url(#m-end)' }
      return link
    },
    merge (target, source, tkey, skey, map) {
      const result = []
      const store = {}
      if (source) {
        source.forEach(e => {
          const key = skey(e)
          store[key] = map(e)
        })
      }
      target.forEach((e, i) => {
        const key = tkey(e)
        if (key in store) {
          for (const k in store[key]) {
            e[k] = store[key][k]
          }
          result.push(e)
          delete store[key]
        }
      })
      for (const k in store) {
        result.push(store[k])
      }
      return result
    },
    update () {
      const attr = this.hass.states[this.config.entity].attributes
      if (!attr.devices) {
        this.init_failed = true
        return
      }
      this.nodes = this.merge(this.nodes, attr.devices.filter(e => e.removed !== true), d => d.id, d => d.networkAddress, d => {
        return {
          id: d.networkAddress,
          name: d.logicalType === 0 ? ' ' : d.name,
          _cssClass: d.logicalType === 0 ? 'coordinator' : d.logicalType === 1 ? 'router' : ''
        }
      })
      const nodes = attr.devices.map(e => e.networkAddress)
      this.links = this.merge(
        this.links,
        attr.devices.filter(e => e.neighbors != null).flatMap(e => e.neighbors.filter(n => nodes.includes(n.networkAddress)).map(n => ({ sourceIeeeAddr: e.networkAddress, targetIeeeAddr: n.networkAddress, lqi: n.linkQuality }))),
        d => d.sid + d.tid,
        d => d.sourceIeeeAddr + d.targetIeeeAddr,
        d => {
          return {
            id: d.sourceIeeeAddr + d.targetIeeeAddr,
            sid: d.sourceIeeeAddr,
            tid: d.targetIeeeAddr,
            name: d.lqi
          }
        })
    }
  },
  mounted () {
    setTimeout(() => {
      this.$refs.net.onResize()
    }, 100)
  }
}
</script>
