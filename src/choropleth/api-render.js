import { mouse, select } from 'd3-selection';
import { geoPath, geoTransform } from 'd3-geo';
import { uuid, genericColor } from 'vizart-core';
import tooltipMarkup from './tooltip';

import { getMetricVal } from './withCartesian';

const apiRender = state => ({
  render(data) {
    state._data = state._composers.data(data, state._options);
    state._color = state._composers.color(
      state._options.color,
      state._data,
      state._options
    );

    const { _options, _containerId, _data } = state;

    const _getMetricVal = getMetricVal(_options);

    const _mapId = 'map-' + uuid();

    const _array = data.map(_getMetricVal);
    state._color = genericColor(_options.color, _array);

    const { _color } = state;

    const _c = d =>
      _getMetricVal(d) === 0
        ? _options.plots.emptyDataColor
        : _color(_getMetricVal(d));

    const _canvasLayer = select(_containerId)
      .append('div')
      .attr('id', _mapId)
      .attr('class', 'vizart-chart')
      .style('width', _options.chart.innerWidth + 'px')
      .style('height', _options.chart.innerHeight + 'px')
      .style('top', _options.chart.margin.top + 'px')
      .style('left', _options.chart.margin.left + 'px')
      .style('position', 'relative');

    const _tooltip = select(_containerId)
      .append('div')
      .attr('id', 'tooltip-' + uuid())
      .attr('class', 'vizart-tooltip')
      .style('opacity', 0);

    const _map = new L.Map(_mapId).setView(
      _options.map.center,
      _options.map.zoomLevel
    );

    const _tileLayer = new L.TileLayer(
      _options.map.tileLayer,
      _options.map.layerOptions
    );

    _map.addLayer(_tileLayer);

    const _svg = select(_map.getPanes().overlayPane)
      .append('svg')
      .style('position', 'relative')
      .attr('class', 'vizart-map');

    const g = _svg.append('g').attr('class', 'leaflet-zoom-hide');

    const projectPoint = function(x, y) {
      const point = _map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    };

    const transform = geoTransform({ point: projectPoint });
    const path = geoPath().projection(transform);

    const svgPath = g
      .selectAll('path')
      .data(_data.features)
      .enter()
      .append('path')
      .attr('class', 'path')
      .attr('fill-opacity', _options.plots.fillOpacity)
      .attr('stroke', _options.plots.stroke)
      .attr('stroke-width', _options.plots.strokeWidth)
      .attr('fill', _c);

    const reset = () => {
      const bounds = path.bounds(_data);
      const topLeft = bounds[0];
      const bottomRight = bounds[1];

      _svg
        .attr('width', bottomRight[0] - topLeft[0])
        .attr('height', bottomRight[1] - topLeft[1])
        .style('left', topLeft[0] + 'px')
        .style('top', topLeft[1] + 'px');

      g.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

      svgPath.attr('d', path);
    };

    // according to http://stackoverflow.com/questions/40915225/event-viewreset-is-not-fired-in-leaflet-version-1-0-2
    _map.on('zoom', reset);

    reset();

    svgPath
      .on('mousemove', function(d) {
        _tooltip.style('opacity', 1);

        const coordinates = mouse(this);
        const x = coordinates[0];
        const y = coordinates[1];

        _tooltip
          .style('left', x < 40 ? x : x - 22 + 'px')
          .style('top', y < 40 ? y + 34 : y - 34 + 'px')
          .html(tooltipMarkup(d, _options, _c));
      })
      .on('mouseout', () => _tooltip.style('opacity', 0));
  },
});

export default apiRender;
