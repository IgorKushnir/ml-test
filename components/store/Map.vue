<template>
  <div style="display: none">
    <div ref="info" class="info">
      <StoreItem  :store="data[storeIndex]" />
    </div>
  </div>
  <div v-show="show" class="map" ref="map"/>
</template>

<script setup lang="js">
import {Loader} from "google-maps";

// import {useMethod} from "h3";
// import items from "ajv/lib/vocabularies/applicator/items";
// Google map


const map = ref();
let myMap;
let markers = [];
let infowindows = [];
const info = ref()
const storeIndex = ref(0)

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
watch(() => props?.data, ()=> {
  if (props.show) {
    setMarkers()
  }
})


function setMarkers() {
  removeMarkers();

  let locations = []




  props?.data?.forEach((d, index) => {
    const location = new google.maps.LatLng(d.lat, d.lng);
    locations.push(location)
    const marker = new google.maps.Marker({
      position: location,
      map: myMap,
      title: 'Milla Nova',
      // icon: svgMarker,
      icon: '/img/point.svg',
      animation: google.maps.Animation.DROP,
    })
    const infowindow = new google.maps.InfoWindow({
      content: info.value,
    });
    infowindows.push(infowindow)

    marker.addListener("click", () => {
      infowindows?.forEach(infoW => {
        infoW.close()
      })
      storeIndex.value = index;
      myMap.setZoom(15)
      myMap.setCenter(location)
      infowindow.open({
        anchor: marker,
        myMap,
        shouldFocus: false,
      });
    });

    markers.push(marker)
  })

  let bounds = new google.maps.LatLngBounds();
  locations?.forEach(l => {
    bounds.extend(l);
  })

  setTimeout(function () {
    myMap.fitBounds(bounds, 100);
  }, 100)

}
// defineExpose({ showMap })
function addMarkers() {
  for (let i = 0; i < markers?.length; i++) {
    markers[i].setMap(myMap)
  }
}
function removeMarkers() {
  for (let i = 0; i < markers?.length; i++) {
    markers[i].setMap(null)
    markers[i] = null;
  }
  markers = [];
}


onMounted(async () => {
  if (window.google == null) {
    const options = {};
    const loader = new Loader('AIzaSyBGuPFxDk76OYyebHe7qPAZEhvWRqukoig', options);
     await loader.load();

  }
  myMap = new google.maps.Map(map.value, {
    mapTypeControl: false,
    streetViewControl: false,
    minZoom: 3,
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

  google.maps.event.addListener(myMap, 'zoom_changed', function() {
    infowindows?.forEach(infoW => {
      infoW.close()
    })
  })

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
.info {
  font-family: 'Bague';
  min-width: 500px;
  :deep(.store-item) {
    border: unset;
    padding: 20px!important;
  }
}

:deep(.gm-style-iw){
  border-radius: 0!important;
}
</style>
