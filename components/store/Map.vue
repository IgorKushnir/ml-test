<template>
  <div v-show="show" class="map" ref="map"/>
</template>

<script setup lang="ts">
import {Loader, LoaderOptions} from "google-maps";
import {useMethod} from "h3";
import items from "ajv/lib/vocabularies/applicator/items";
// Google map


const map = ref();
let myMap;
let markers = [];

const props = defineProps({
  data: {
    type: Array,
    require: true
  },
  show: {
    type: Boolean,
    require: false,
    default: false
  }
})

watch(() => props.show, ()=> {
  if (props.show) {
    setMarkers()
  }
})
watch(() => props.data, ()=> {
  if (props.show) {
    setMarkers()
  }
})
// function initMap() {
//   myMap.value = new google.maps.Map(map.value, {
//     styles: [
//       {
//         "featureType": "all",
//         "elementType": "labels.text.fill",
//         "stylers": [
//           {
//             "saturation": 36
//           },
//           {
//             "color": "#000000"
//           },
//           {
//             "lightness": 40
//           }
//         ]
//       },
//       {
//         "featureType": "all",
//         "elementType": "labels.text.stroke",
//         "stylers": [
//           {
//             "visibility": "on"
//           },
//           {
//             "color": "#000000"
//           },
//           {
//             "lightness": 16
//           }
//         ]
//       },
//       {
//         "featureType": "all",
//         "elementType": "labels.icon",
//         "stylers": [
//           {
//             "visibility": "off"
//           }
//         ]
//       },
//       {
//         "featureType": "administrative",
//         "elementType": "geometry.fill",
//         "stylers": [
//           {
//             "color": "#000000"
//           },
//           {
//             "lightness": 20
//           }
//         ]
//       },
//       {
//         "featureType": "administrative",
//         "elementType": "geometry.stroke",
//         "stylers": [
//           {
//             "color": "#000000"
//           },
//           {
//             "lightness": 17
//           },
//           {
//             "weight": 1.2
//           }
//         ]
//       },
//       {
//         "featureType": "landscape",
//         "elementType": "geometry",
//         "stylers": [
//           {
//             "color": "#000000"
//           },
//           {
//             "lightness": 20
//           }
//         ]
//       },
//       {
//         "featureType": "poi",
//         "elementType": "geometry",
//         "stylers": [
//           {
//             "color": "#000000"
//           },
//           {
//             "lightness": 21
//           }
//         ]
//       },
//       {
//         "featureType": "road.highway",
//         "elementType": "geometry.fill",
//         "stylers": [
//           {
//             "color": "#000000"
//           },
//           {
//             "lightness": 17
//           }
//         ]
//       },
//       {
//         "featureType": "road.highway",
//         "elementType": "geometry.stroke",
//         "stylers": [
//           {
//             "color": "#000000"
//           },
//           {
//             "lightness": 29
//           },
//           {
//             "weight": 0.2
//           }
//         ]
//       },
//       {
//         "featureType": "road.arterial",
//         "elementType": "geometry",
//         "stylers": [
//           {
//             "color": "#000000"
//           },
//           {
//             "lightness": 18
//           }
//         ]
//       },
//       {
//         "featureType": "road.local",
//         "elementType": "geometry",
//         "stylers": [
//           {
//             "color": "#000000"
//           },
//           {
//             "lightness": 16
//           }
//         ]
//       },
//       {
//         "featureType": "transit",
//         "elementType": "geometry",
//         "stylers": [
//           {
//             "color": "#000000"
//           },
//           {
//             "lightness": 19
//           }
//         ]
//       },
//       {
//         "featureType": "water",
//         "elementType": "geometry",
//         "stylers": [
//           {
//             "color": "#000000"
//           },
//           {
//             "lightness": 17
//           }
//         ]
//       }
//     ],
//   });
// }

function setMarkers() {
  removeMarkers();

  let locations = []



  const svgMarker = {
    path: "M9 4.5C9 6.98528 6.98528 9 4.5 9C2.01472 9 0 6.98528 0 4.5C0 2.01472 2.01472 0 4.5 0C6.98528 0 9 2.01472 9 4.5Z",
    fillColor: "#F6DFA4",
    fillOpacity: 1,
    strokeWeight: 0,
    rotation: 0,
    scale: 1,
    anchor: new google.maps.Point(15, 30),
  };
  props.data.forEach(d => {
    const location = new google.maps.LatLng(d.lat, d.lng);
    locations.push(location)
    const marker = new google.maps.Marker({
      position: location,
      map: myMap,
      title: 'Milla Nova',
      icon: svgMarker,
    })
    markers.push(marker)
  })

  let bounds = new google.maps.LatLngBounds();
  locations.forEach(l => {
    bounds.extend(l);
  })

  setTimeout(function () {
    myMap.fitBounds(bounds, 100);
  }, 100)

}
// defineExpose({ showMap })
function addMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(myMap)
  }
}
function removeMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null)
    markers[i] = null;
  }
  markers = [];
}


onMounted(async () => {
  if (window.google == null) {
    const options: LoaderOptions = {};
    const loader = new Loader('AIzaSyBGuPFxDk76OYyebHe7qPAZEhvWRqukoig', options);
     await loader.load();

  }
  myMap = new google.maps.Map(map.value, {
    styles: [
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            // "saturation": 36
          },
          {
            "color": "#D0CAC2"
          },
          {
            // "lightness": 30
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "on"
          },
          {
            "color": "#051C2C"
          },
          {
            "lightness": 6
          }
        ]
      },
      {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#1A303F"
          },
          {
            "lightness": 10
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#1A303F"
          },
          {
            "lightness": 7
          },
          {
            "weight": 1.2
          }
        ]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#1A303F"
          },
          // {
          //   "lightness": 20
          // }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#1A303F"
          },
          {
            "lightness": 10
          },
          {
            // "saturation": -50
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#1A303F"
          },
          {
            "lightness": 7
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#1A303F"
          },
          {
            "lightness": 19
          },
          {
            "weight": 0.2
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#1A303F"
          },
          {
            "lightness": 8
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#1A303F"
          },
          {
            "lightness": 6
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#1A303F"
          },
          {
            "lightness": 9
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#051C2C"
          },
          {
            "lightness": 0
          }
        ]
      }
    ],
  });

  setMarkers();
})
</script>

<style scoped lang="scss">
.map {
  width: 100%;
  height: calc(100vh - 152px);
}
.map:deep img {
  background-image: unset;
}
</style>
