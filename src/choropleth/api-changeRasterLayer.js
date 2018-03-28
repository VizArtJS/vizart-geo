import L from 'leaflet';

const apiChangeRasterLayer = state => ({
  changeRasterLayer(_rasterLayer, _token) {
    const { _options, _map } = state;
    _options.map.tileLayer = _rasterLayer;
    _options.map.layerOptions.id = _token;

    _map.removeLayer(state._tileLayer);

    state._tileLayer = new L.TileLayer(
      _options.map.tileLayer,
      _options.map.layerOptions
    );

    _map.addLayer(state._tileLayer);
  },
});

export default apiChangeRasterLayer;
