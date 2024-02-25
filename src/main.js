import '@material/mwc-button'
import './ha-card'
customElements.whenDefined('homed-zigbee-networkmap').then(() => {
  function createHass () {
    function pad (str) {
      return String('00' + str).slice(-2)
    }

    function format (d) {
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    }

    /* eslint-disable indent */
    const attrs = [{
      devices: [{
            logicalType: 2,
            name: 'Kitchen Water Leak Sensor',
            networkAddress: 37271
        }, {
            logicalType: 2,
            name: 'Kitchen Smoke Sensor',
            networkAddress: 63355
        }, {
            name: 'Lamp',
            networkAddress: 2797,
            removed: true
        }, {
            logicalType: 2,
            name: 'Balcony Temperature Sensor',
            networkAddress: 30564,
            removed: false
        }, {
            logicalType: 2,
            name: 'Childroom Temperature Sensor',
            networkAddress: 62933
        }, {
            logicalType: 1,
            name: 'Bedroom Air Quality Sensor',
            neighbors: [{
                    linkQuality: 88,
                    networkAddress: 0
                }, {
                    linkQuality: 0,
                    networkAddress: 7630
                }, {
                    linkQuality: 66,
                    networkAddress: 43733
                }, {
                    linkQuality: 54,
                    networkAddress: 48871
                }
            ],
            networkAddress: 29944
        }, {
            logicalType: 1,
            name: 'Kitchen Smart Plug',
            neighbors: [{
                    linkQuality: 139,
                    networkAddress: 0
                }, {
                    linkQuality: 24,
                    networkAddress: 29944
                }, {
                    linkQuality: 121,
                    networkAddress: 30564
                }, {
                    linkQuality: 133,
                    networkAddress: 48871
                }, {
                    linkQuality: 121,
                    networkAddress: 63355
                }
            ],
            networkAddress: 7630
        }, {
            logicalType: 1,
            name: 'Livingroom Smart Plug',
            neighbors: [{
                    linkQuality: 145,
                    networkAddress: 0
                }, {
                    linkQuality: 69,
                    networkAddress: 7630
                }, {
                    linkQuality: 6,
                    networkAddress: 29944
                }
            ],
            networkAddress: 48871
        }, {
            logicalType: 2,
            name: 'Livingroom Temperature Sensor',
            networkAddress: 43245
        }, {
            logicalType: 2,
            name: 'Hall Motion Sensor',
            networkAddress: 43733
        }, {
            logicalType: 2,
            name: 'Door Sensor',
            networkAddress: 15573
        }, {
            logicalType: 0,
            name: 'HOMEd Coordinator',
            neighbors: [{
                    linkQuality: 178,
                    networkAddress: 7630
                }, {
                    linkQuality: 131,
                    networkAddress: 15573
                }, {
                    linkQuality: 121,
                    networkAddress: 29944
                }, {
                    linkQuality: 133,
                    networkAddress: 37271
                }, {
                    linkQuality: 230,
                    networkAddress: 43245
                }, {
                    linkQuality: 254,
                    networkAddress: 48871
                }, {
                    linkQuality: 82,
                    networkAddress: 62933
                }
            ],
            networkAddress: 0
        }
      ]
    }]

    const hass = {
      count: 0,
      callService () {
        this.count++
        document.querySelector('homed-zigbee-networkmap').hass = Object.assign({}, hass, {
          count: this.count,
          states: {
            'sensor.homed_zigbee_networkmap': {
              state: format(new Date()),
              attributes: attrs[this.count % 2]
            }
          }
        })
      },
      states: {
        'sensor.homed_zigbee_networkmap': {
          state: format(new Date()),
          attributes: attrs[0]
        }
      }
    }
    return hass
  }

  const net = document.querySelector('homed-zigbee-networkmap')
  net.setConfig({
    type: 'custom:homed-zigbee-networkmap',
    entity: 'sensor.homed_zigbee_networkmap',
    force: 3000,
    node_size: 16,
    font_size: 12,
    link_width: 2,
    height: 400,
    css: `
:host {
  --homed-zigbee-networkmap-node-color: rgba(18, 120, 98, .7);
  --homed-zigbee-networkmap-node-fill-color: #dcfaf3;
  --homed-zigbee-networkmap-node-pinned-color: rgba(190, 56, 93, .6);
  --homed-zigbee-networkmap-link-color: rgba(18, 120, 98, .5);
  --homed-zigbee-networkmap-hover-color: #be385d;
  --homed-zigbee-networkmap-link-selected-color: rgba(202, 164, 85, .6);
  --homed-zigbee-networkmap-label-color: #127862;
  --homed-zigbee-networkmap-arrow-color: rgba(18, 120, 98, 0.7);
  --homed-zigbee-networkmap-node-coordinator-color: rgba(224, 78, 93, .7);
  --homed-zigbee-networkmap-node-router-color: rgba(0, 165, 255, .7);
}
`
  })
  net.hass = createHass()
})
