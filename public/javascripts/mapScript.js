mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
center: beach.geometry.coordinates || JSON.stringify(beaches[i].geometry.coordinates), // starting position [lng, lat]
zoom: 5 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(beach.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${beach.name}</h3>`
        )
    )
    .addTo(map)
