# homed-zigbee-networkmap

[Custom Card](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card) for [Home Assistant](https://www.home-assistant.io/) to show the [HOMEd Zigbee](https://wiki.homed.dev/page/ZigBee) network map with [vue-d3-network](https://github.com/emiliorizzo/vue-d3-network/).\
(clone of [zigbee2mqtt-networkmap](https://github.com/azuwis/zigbee2mqtt-networkmap) adapted for [HOMEd Zigbee](https://wiki.homed.dev/page/ZigBee))

## [Demo](https://dvb6666.github.io/homed-zigbee-networkmap/)

[![Screenshot](https://dvb6666.github.io/homed-zigbee-networkmap/screenshoot.png)](https://dvb6666.github.io/homed-zigbee-networkmap/)

## Home Assistant setup

Update HOMEd Zigbee to version 3.6.5 or later.

### Backend setup

In `configuration.yaml` of the Home Assistant installation:
``` yaml
mqtt:
  sensor:
    - name: HOMEd Zigbee Networkmap
      object_id: homed_zigbee_networkmap
      state_topic: homed/status/zigbee
      # again, if you change state_topic of HOMEd Zigbee, change json_attributes_topic accordingly
      json_attributes_topic: homed/status/zigbee
      json_attributes_template: "{{ value_json | tojson }}"
      value_template: >-
        {{ now().strftime('%Y-%m-%d %H:%M:%S') }}
```

### Frontend setup (HACS)

When installing the plugin via [HACS](https://hacs.xyz/), you'll need to add the resource manually.

 - Edit your profile (bottom iten in the left menu in the web UI). Enable *Advanced Mode*.
 - Go to *Settings* -> *Dashboards* and click the three dots in the upper right corner.
 - Click *Resources*
 - Click *ADD RESOURCE* in the bottom right
 - Enter `/hacsfiles/homed-zigbee-networkmap/homed-zigbee-networkmap.js` in the URL field  and select *JavaScript Module*. Click *CREATE*.
 - Go to *HACS* -> *Frontend*. Here you should see the *HOMEd Zigbee Networkmap Card* without any error messages.

### Card setup (Dashboard Web UI)

In order to add this card to the dashboard, Use the *Edit Dashboard* on the top right , three-dots menu, add a manual card, and use this configuration:
```
type: custom:homed-zigbee-networkmap
entity: sensor.homed_zigbee_networkmap
```
Make sure to use the same name of the sensor defined under `configuration.yaml`, baseed on the `Zigbee2mqtt Networkmap` name.

### Frontend setup (YAML mode)

Download [`homed-zigbee-networkmap.js`](https://github.com/dvb6666/homed-zigbee-networkmap/releases/download/0.1.2/homed-zigbee-networkmap.js) and put it into `<config-directory>/www/` directory.

Enable [Dashboard YAML mode](https://www.home-assistant.io/dashboards/dashboards/#using-yaml-for-the-default-dashboard).

In `configuration.yaml`:

``` yaml
lovelace:
  mode: yaml
  resources:
    - url: /local/homed-zigbee-networkmap.js?v=0.1.0
      type: module

```

### Card setup (YAML mode)

In `ui-lovelace.yaml`:

``` yaml
views:
  - title: HOMEd Zigbee Network
    panel: true # this renders the first card on full width, other cards in this view will not be rendered
    cards:
      - type: custom:homed-zigbee-networkmap
        entity: sensor.homed_zigbee_networkmap
        force: 3000
        node_size: 10
        font_size: 12
        link_width: 2
        height: 500
        css: |
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
```

### Upgrade (YAML mode)

Replace `<config-directory>/www/homed-zigbee-networkmap.js` with new one, and
change version string in `configuration.yaml`:

``` yaml
resources:
  - url: /local/homed-zigbee-networkmap.js?v=0.1.2 # change version to actual
    type: module
```

And then refresh the browser.

## Development

Install [nodejs](https://nodejs.org/) and [yarn](https://yarnpkg.com/), clone the
repo and install dependances:

``` bash
git clone https://github.com/dvb6666/homed-zigbee-networkmap.git
cd homed-zigbee-networkmap
yarn install
```

### Compiles and hot-reloads for development

``` bash
yarn serve
```

And open the demo at http://localhost:8080/ using web browser.

Or use Home Assistant for development, in `configuration.yaml`:

``` yaml
resources:
  # - url: /local/homed-zigbee-networkmap.js
  #   type: module
  - url: http://localhost:8080/homed-zigbee-networkmap.js
    type: js

```

### Compiles and minifies for production

``` bash
yarn build
```

### Lints and fixes files

``` bash
yarn lint
```
