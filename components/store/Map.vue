<template>
  <div>
    <div style="position: absolute; z-index: 100">
      <button v-on:click="addMarkers" >Add</button>
      <button v-on:click="removeMarkers" >Clear</button>
    </div>
    <div v-show="show" class="map m-v-80" ref="map"/>
  </div>
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
    type: Object,
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
    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "white",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(15, 30),
  };
  props.data.forEach(e => {
    e.store.forEach(d => {
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
  })

  let bounds = new google.maps.LatLngBounds();
  locations.forEach(l => {
    bounds.extend(l);
  })

  setTimeout(function () {
    myMap.fitBounds(bounds, 100);
  }, 100)



  // addMarkers();
  // myMap.setZoom(1);
  // setTimeout(function () {
  //   myMap.setZoom(5);
  // }, 500)
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
    // styles: [
    //   {
    //     "featureType": "all",
    //     "elementType": "labels.text.fill",
    //     "stylers": [
    //       {
    //         // "saturation": 36
    //       },
    //       {
    //         "color": "#D0CAC2"
    //       },
    //       {
    //         // "lightness": 30
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "all",
    //     "elementType": "labels.text.stroke",
    //     "stylers": [
    //       {
    //         "visibility": "on"
    //       },
    //       {
    //         "color": "#051C2C"
    //       },
    //       {
    //         "lightness": 6
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "all",
    //     "elementType": "labels.icon",
    //     "stylers": [
    //       {
    //         "visibility": "off"
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "administrative",
    //     "elementType": "geometry.fill",
    //     "stylers": [
    //       {
    //         "color": "#1A303F"
    //       },
    //       {
    //         "lightness": 10
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "administrative",
    //     "elementType": "geometry.stroke",
    //     "stylers": [
    //       {
    //         "color": "#1A303F"
    //       },
    //       {
    //         "lightness": 7
    //       },
    //       {
    //         "weight": 1.2
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "landscape",
    //     "elementType": "geometry",
    //     "stylers": [
    //       {
    //         "color": "#1A303F"
    //       },
    //       // {
    //       //   "lightness": 20
    //       // }
    //     ]
    //   },
    //   {
    //     "featureType": "poi",
    //     "elementType": "geometry",
    //     "stylers": [
    //       {
    //         "color": "#1A303F"
    //       },
    //       {
    //         "lightness": 10
    //       },
    //       {
    //         // "saturation": -50
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "road.highway",
    //     "elementType": "geometry.fill",
    //     "stylers": [
    //       {
    //         "color": "#1A303F"
    //       },
    //       {
    //         "lightness": 7
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "road.highway",
    //     "elementType": "geometry.stroke",
    //     "stylers": [
    //       {
    //         "color": "#1A303F"
    //       },
    //       {
    //         "lightness": 19
    //       },
    //       {
    //         "weight": 0.2
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "road.arterial",
    //     "elementType": "geometry",
    //     "stylers": [
    //       {
    //         "color": "#1A303F"
    //       },
    //       {
    //         "lightness": 8
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "road.local",
    //     "elementType": "geometry",
    //     "stylers": [
    //       {
    //         "color": "#1A303F"
    //       },
    //       {
    //         "lightness": 6
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "transit",
    //     "elementType": "geometry",
    //     "stylers": [
    //       {
    //         "color": "#1A303F"
    //       },
    //       {
    //         "lightness": 9
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "water",
    //     "elementType": "geometry",
    //     "stylers": [
    //       {
    //         "color": "#051C2C"
    //       },
    //       {
    //         "lightness": 0
    //       }
    //     ]
    //   }
    // ],
  });

  // showMap();
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
