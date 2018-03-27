import { svgLayer, factory, DefaultCategoricalColor, gradientColor, MetroCold5, Globals } from 'vizart-core';
import './choropleth.css';
import './tooltip.css';

import { getDimensionVal, getMetricVal, getDimension, getMetric } from './withCartesian';

import apiRender from './api-render';
import apiColor from './api-color';
import apiChangeRasterLayer from './api-changeRasterLayer';
import UsGEO from '../geojson/us-states.json';

const DefaultOptions = {
    chart: {
        type: 'choropleth',
    },
    plots: {
        emptyDataColor: '#ffffff',
        fillOpacity: 0.8,
        stroke: '#ffffff',
        strokeDashArray: '5,1',
        strokeHighlight: '#8f8d8b',
        strokeWidth: 1.5,
        strokeWidthHighlight: 3,
    },
    color: {
        scheme: MetroCold5,
        type: Globals.ColorType.GRADIENT,
    },
    map: {
        tileLayer:
            'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic3RhcmUiLCJhIjoiNGQxOGM0Yzk0ZjQ2ZjJhMGMyY2I3ZDBlYTEzNmJjM2MifQ.fBHV208tbilSeMaNQIa9zQ',
        layerOptions: {
            maxZoom: 18,
            detectRetina: true,
            id: 'stare.op5mde27',
        },
        center: [37.8, -96.9],
        zoomLevel: 4,
    },
};

const composers = {
  opt: DefaultOptions,
  data: (data, opt) => {
      const geo = Object.assign({}, opt.geojson ? opt.geojson : UsGEO);

      for (let d of geo.features) {
          const province = d.properties.name;
          const datum = data.find(cDatum => getDimensionVal(opt)(cDatum) === province);

          if (!datum) {
              d[getMetric(opt).accessor] = 0;
          } else {
              d[getMetric(opt).accessor] = getMetricVal(opt)(datum);
          }

          d[getDimension(opt).accessor] = province;
      }
      return geo;
  },

    color: (colorOpt, data, opt) => {
        const _array = data.features.map(getMetricVal(opt));
        return gradientColor(colorOpt, _array);
    }

}
export default factory(svgLayer, composers, [apiRender, apiColor, apiChangeRasterLayer]);
