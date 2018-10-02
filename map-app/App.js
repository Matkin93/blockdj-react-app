import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableHighlight } from 'react-native';
import MapView from 'react-native-maps';
// import GeoFencing from 'react-native-geo-fencing';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLocation: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      inAnArea: true,
      currentArea: { name: "Northern Quarter" },
      modalVisible: false,
      areaPlaylists: [
        { name: '' }
      ]
    }
  }

  componentDidMount() {

    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        console.log(position.coords.latitude, '/', position.coords.longitude)
        this.setState({
          currentLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0421,
            error: null,
          }
        });

        //Geofencing checker not working as intended - err msg 'undefined is not an object (evaluating 'Geofencing.containsLocation)'

        // const point = {
        //   lat: position.coords.latitude,
        //   lng: position.coords.longitude
        // };
        // const polygon = [
        //   { lat: 53.475236, lng: -2.217142 },
        //   { lat: 53.474847, lng: -2.268407 },
        //   { lat: 53.497412, lng: -2.26648 },
        //   { lat: 53.499352, lng: -2.213608 },
        //   { lat: 53.475236, lng: -2.217142 } // last point has to be same as first point
        // ];

        // GeoFencing.containsLocation(point, polygon)
        //   .then(() => console.log('point is within polygon'))
        //   .catch((err) => console.log(err))


      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, maximumAge: 1000, distanceFilter: 1 },
    );

    setTimeout(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude)
      })
    }, 20000)
  }

  _isInPolygon = (point, polygon) => {

    let x = point.latitude
    let y = point.longitude

    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xLat = polygon[i].latitude
      let yLat = polygon[i].longitude
      let xLon = polygon[j].latitude
      let yLon = polygon[j].longitude

      let intersect = ((yLat > y) !== (yLon > y)) && (x < (xLon - xLat) * (y - yLat) / (yLon - yLat) + xLat)
      if (intersect) inside = !inside
    }
    return inside
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Block DJ</Text>
        </View>
        {this.state.inAnArea ? <Text style={styles.welcomeMsg}>Welcome to {this.state.currentArea.name}</Text> : null}
        <MapView style={styles.map}
          showsUserLocation
          region={this.state.currentLocation}
        >
        </MapView>
        <View style={{ marginTop: 22 }}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}
          >
            <View style={{ marginTop: 22 }} style={styles.modal}>
              <View>
                <Text style={styles.modalTitle}>
                  {this.state.currentArea.name}
                </Text>
              </View>
              <View >
                <Text style={styles.modalDismiss}>
                  {this.state.currentLocation.latitude}/{this.state.currentLocation.longitude}
                </Text>
              </View>
              <View >
                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text style={styles.modalDismiss}>Hide Modal</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>

          <TouchableHighlight
            onPress={() => {
              this.setModalVisible(true);
            }}>
            <Text style={styles.modalMsg}>See Playlists in {this.state.currentArea.name}</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171738',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    height: 600,
    width: 500
  },
  title: {
    marginTop: 5,
    fontSize: 20,
    color: 'white'
  },
  welcomeMsg: {
    color: 'white'
  },
  modalMsg: {
    color: 'white'
  },
  modal: {
    flex: 1,
    backgroundColor: '#171738',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalTitle: {
    color: 'white',
    fontSize: 30
  },
  modalDismiss: {
    color: 'white',
    marginBottom: 20,
  }
});
