mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/outdoors-v11", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker({ color: "#99d98c" })
  .setLngLat(campground.geometry.coordinates)
  .setPopup(new mapboxgl.Popup().setHTML(`<h3>${campground.title}</h3>`))
  .addTo(map);
