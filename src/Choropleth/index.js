import { genericColor, uuid, check, Globals, MetroCold5 } from 'vizart-core';
import {
  AbstractBasicCartesianChart,
  processCartesianData,
  createCartesianOpt,
} from 'vizart-basic';
import { select, mouse } from 'd3-selection';
import { geoTransform, geoPath } from 'd3-geo';
import L from 'leaflet';
import find from 'lodash-es/find';
import cloneDeep from 'lodash-es/cloneDeep';

import UsGeoJson from '../geojson/us-states.json';
import './choropleth.css';
import 'vizart-basic/dist/vizart-basic.css';

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

class Choropleth extends AbstractBasicCartesianChart {
  constructor(canvasId, _userOptions, geoJson) {
    super(canvasId, _userOptions);

    if (check(geoJson) === false) {
      console.log('geojson is not provided, U.S.states geojson will be used.');
      this._data = cloneDeep(UsGeoJson);
    } else {
      this._data = cloneDeep(geoJson);
    }

    this._mapId = 'map-' + uuid();
    this._canvasLayer;
    this._tileLayer;
    this._map;

    this._c = d => {
      return this._getMetricVal(d) === 0
        ? this._options.plots.emptyDataColor
        : this._color(this._getMetricVal(d));
    };
  }

  render(_data) {
    this.data(_data);

    let _array = _data.map(this._getMetricVal);
    this._color = genericColor(this._options.color, _array);

    let that = this;

    this._canvasLayer = select(this._containerId)
      .append('div')
      .attr('id', this._mapId)
      .attr('class', 'vizart-chart')
      .style('width', this._options.chart.innerWidth + 'px')
      .style('height', this._options.chart.innerHeight + 'px')
      .style('top', this._options.chart.margin.top + 'px')
      .style('left', this._options.chart.margin.left + 'px')
      .style('position', 'relative');

    this._tooltip = select(this._containerId)
      .append('div')
      .attr('id', 'tooltip-' + uuid())
      .attr('class', 'vizart-tooltip')
      .style('opacity', 0);

    this._map = new L.Map(this._mapId).setView(
      this._options.map.center,
      this._options.map.zoomLevel
    );

    this._tileLayer = new L.TileLayer(
      this._options.map.tileLayer,
      this._options.map.layerOptions
    );

    this._map.addLayer(this._tileLayer);

    this._svg = select(this._map.getPanes().overlayPane)
      .append('svg')
      .style('position', 'relative')
      .attr('class', 'vizart-map');

    let g = this._svg.append('g').attr('class', 'leaflet-zoom-hide');

    let projectPoint = function(x, y) {
      let point = that._map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    };

    let transform = geoTransform({ point: projectPoint });
    let path = geoPath().projection(transform);

    let svgPath = g
      .selectAll('path')
      .data(this._data.features)
      .enter()
      .append('path')
      .attr('class', 'path')
      .attr('fill-opacity', this._options.plots.fillOpacity)
      .attr('stroke', this._options.plots.stroke)
      .attr('stroke-width', this._options.plots.strokeWidth)
      .attr('fill', this._c);

    const reset = () => {
      let bounds = path.bounds(this._data);
      let topLeft = bounds[0];
      let bottomRight = bounds[1];

      this._svg
        .attr('width', bottomRight[0] - topLeft[0])
        .attr('height', bottomRight[1] - topLeft[1])
        .style('left', topLeft[0] + 'px')
        .style('top', topLeft[1] + 'px');

      g.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

      svgPath.attr('d', path);
    };

    // according to http://stackoverflow.com/questions/40915225/event-viewreset-is-not-fired-in-leaflet-version-1-0-2
    this._map.on('zoom', reset);

    reset();

    svgPath
      .on('mousemove', function(d) {
        that._tooltip.style('opacity', 1);

        let coordinates = mouse(this);
        let x = coordinates[0];
        let y = coordinates[1];

        that._tooltip
          .style('left', x < 40 ? x : x - 22 + 'px')
          .style('top', y < 40 ? y + 34 : y - 34 + 'px')
          .html(that._getTooltipHTML(d));
      })
      .on('mouseout', function(d) {
        that._tooltip.style('opacity', 0);
      });
  }

  _bindDataToGeo(rawData) {
    for (let d of this._data.features) {
      let province = d.properties.name;

      let datum = find(rawData, cDatum => {
        return this._getDimensionVal(cDatum) === province;
      });

      if (!datum) {
        d[this._getMetric().accessor] = 0;
      } else {
        d[this._getMetric().accessor] = this._getMetricVal(datum);
      }

      d[this._getDimension().accessor] = province;
    }
  }

  changeRasterLayer(_rasterLayer, _token) {
    this._options.map.tileLayer = _rasterLayer;
    this._options.map.layerOptions.id = _token;

    this._map.removeLayer(this._tileLayer);

    this._tileLayer = new L.TileLayer(
      this._options.map.tileLayer,
      this._options.map.layerOptions
    );

    this._map.addLayer(this._tileLayer);
  }

  data(_data) {
    if (check(_data) === true) {
      let cartesianData = processCartesianData(_data, this._options);
      this._bindDataToGeo(cartesianData);
    }

    return this._data;
  }

  _provideColorScale() {
    let _array = this._data.features.map(this._getMetricVal);

    return genericColor(this._options.color, _array);
  }

  transitionColor(colorOptions) {
    super.transitionColor(colorOptions);

    this._svg
      .selectAll('.path')
      .transition()
      .duration(this._options.animation.duration.quickUpdate)
      .delay((d, i) => {
        return i * 50;
      })
      .attr('fill', this._c);
  }

  createOptions(_userOpt) {
    return createCartesianOpt(DefaultOptions, _userOpt);
  }
}

export default Choropleth;
