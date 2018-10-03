import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Polygon, Marker, Callout } from 'react-native-maps';
import AreaModal from './components/AreaModal';
// import GeoFencing from 'react-native-geo-fencing';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {

      },
      currentLocation: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      inAnArea: true,
      currentArea: { name: "Northern Quarter" },
      areaPlaylists: [
        { name: '' }
      ],
      areas: [
        {
          coordinates: [
            { latitude: 53.486196968335136, longitude: -2.2359145558205 },
            { latitude: 53.481518879521516, longitude: -2.227015072296922 },
            { latitude: 53.48186415564243, longitude: -2.230208644603522 },
            { latitude: 53.48157614811416, longitude: -2.231231865247196 },
            { latitude: 53.480873844102014, longitude: -2.2306954234442173 },
            { latitude: 53.48029901524724, longitude: -2.2324561665915326 },
            { latitude: 53.48123373546192, longitude: -2.2334539890289307 },
            { latitude: 53.482121, longitude: -2.237719 },
            { latitude: 53.481955, longitude: -2.238277 },
            { latitude: 53.482223, longitude: -2.239435, },
            { latitude: 53.484751, longitude: -2.238727 },
          ],
          name: 'Northern Quarter',
          description: 'Hipster place in Manchester',
          areaColor: 'rgba(219,84,97,0.3)',
          areaBorderColor: 'rgba(219,84,97,1)'
        },
        {
          coordinates: [
            { latitude: 53.485695, longitude: -2.239615, },
            { latitude: 53.486208, longitude: -2.241167, },
            { latitude: 53.486773, longitude: -2.240859 },
            { latitude: 53.486248, longitude: -2.239273 },
          ],
          name: 'Northcoders',
          description: 'Hip-happening place full of cool people',
          areaColor: 'rgba(142,249,243,0.3)',
          areaBorderColor: 'rgba(142,249,243,1)'
        }
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
        //   { latitude: 53.475236, longitude: -2.217142 },
        //   { latitude: 53.474847, longitude: -2.268407 },
        //   { latitude: 53.497412, longitude: -2.26648 },
        //   { latitude: 53.499352, longitude: -2.213608 },
        //   { latitude: 53.475236, longitude: -2.217142 } // last point has to be same as first point
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

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
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
          region={this.state.currentLocation} >
          {this.state.areas.map((area, i) => {
            return <View key={i}>
              <Polygon
                coordinates={area.coordinates}
                fillColor={area.areaColor}
                strokeWidth={2}
                strokeColor='#171738'
              />
              <Marker coordinate={area.coordinates[0]} pinColor='#171738'>
                <Callout style={styles.areaCallout}>
                  <Text style={styles.areaCalloutName}>{area.name}</Text>
                  <Text style={styles.areaCalloutDescription}>{area.description}</Text>
                </Callout>
              </Marker>
            </View>
          })}
        </MapView>
        <AreaModal currentLocation={this.state.currentLocation} currentArea={this.state.currentArea} />
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
    color: 'white',
  },
  welcomeMsg: {
    color: 'white'
  },
  areaCallout: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaCalloutDescription: {
    margin: 5
  },
  areaCalloutName: {
    fontSize: 17,
    marginBottom: 3
  }
});
