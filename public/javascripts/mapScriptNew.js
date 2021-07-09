mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
center: [15.778638089077782, 44.227043056905295], // starting position [lng, lat]
zoom: 5 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

map.on('style.load', function() {
    map.on('click', function(e) {
      var coordinates = e.lngLat;
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML('Ovo su vaše koordinate -> ' + coordinates)
        .addTo(map);
    });
  });