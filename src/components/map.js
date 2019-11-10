import React from 'react';
import { StyleSheet, View, StatusBar, Image, PermissionsAndroid,
        TouchableOpacity, Text, TextInput } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import * as Progress from 'react-native-progress';
import PreviewModal from './previewModal';
import { database } from '../config/firebase';

class Map extends React.Component {
 state = {
   hasLocationPermission: '',
   initialRegion: {
    latitude: 9.5903024,
    longitude: 41.8570132,
    latitudeDelta: 0.005,
    longitudeDelta: 0.0021,
   },
   currentLocation: {
     latitude: 9.5903024,
     longitude: 41.8570132
   },
   searchPassenger: true,
   loaderColor: '#bbb',
   modalVisible: false,
   passengerData: '',
   rideKey: '',
   driverStatus: 'found',
   price: Math.floor(Math.random() * (150 - 50)) + 50
 }

componentDidMount = () => {
  var that = this;
  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'ባለጋሪ App Location Permission',
          message:
            'ባለጋሪ App needs access to your Location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You have the Location permission');
        that.setState({hasLocationPermission: true});
        that.pingLocation();

      } else {
        requestLocationPermission()
      }
    } catch (err) {
      console.warn(err);
    }
  }

  requestLocationPermission();
  this.pingLocation();
  this.fetchRide();
}

toggleModal = () => {
  this.setState({ modalVisible: !this.state.modalVisible })
}

fetchRide = () => {
  database.ref('/rides').on('value', (snapshot) => {
    console.log(snapshot.val(), "snapshot")
    this.setState({ loaderColor: 'red' })
    if(snapshot.val() === null) {
      return;
    }

    let key = Object.keys(snapshot.val())[0];
    if( key === undefined) {
      return;
    }
    let data = snapshot.val()[key];
    
    this.setState({ 
      searchPassenger: false,
      initialRegion: { ...this.state.initialRegion, ...data.pickup},
      currentLocation: { ...data.pickup},
      passengerData: data,
      rideKey: key,
      driverStatus: data.driverStatus.toLowerCase()
    });

  })
}

pingLocation = () => {
   
  if (this.state.hasLocationPermission) {
    Geolocation.getCurrentPosition(
        (position) => {
          let {latitude, longitude} = position.coords;
          console.log(position.coords, "success");
          // console.log({...this.state.initialRegion, latitude, longitude});
          this.setState({
            initialRegion: {...this.state.initialRegion, latitude, longitude},
            currentLocation: {latitude, longitude}
            });
          console.log(this.state.initialRegion, "region changed??");
        },
        (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
            if(error.code === 3) {
              this.pingLocation();
              console.log("Retrying...")
            }
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }
}

takeRide = () => {
  database.ref('/rides').child(this.state.rideKey).update({
    driverStatus: 'On the Way',
    driverName: "Taddesse Getachew",
    driverPhoneNumber: '0985475632'
  }, () => {
    this.setState({ driverStatus: 'on the way' })
  })
}

arrivedHandler = () => {
  database.ref('/rides').child(this.state.rideKey).update({
    driverStatus: 'Arrived'
  }, () => {
    this.setState({ driverStatus: 'arrived' })
  })
}

startHandler = () => {
  database.ref('/rides').child(this.state.rideKey).update({
    driverStatus: 'Trip has started'
  }, () => {
    this.setState({ driverStatus: 'trip has started'})
  })
}

endHandler = () => {
  database.ref('/rides').child(this.state.rideKey).update({
    driverStatus: 'Trip Has ended'
  }, () => {
    this.setState({ driverStatus: 'trip has ended'})
  })
}

deleteTrip = () => {
  database.ref('/rides').child(this.state.rideKey).set(null, () => {
    this.setState({ searchPassenger: true })
  })
}


 render() {
   let loading = (
      <View style={styles.searching}>
          <Text style={styles.searchingText}>Searching for passenger</Text>
          <Progress.Circle color={this.state.loaderColor} 
            indeterminate={true} spinDuration={1000} />
      </View>
    );

    let previewButton = (
      <TouchableOpacity onPress={ this.toggleModal } style={styles.previewBtn}>
        <Text style={styles.btnText}>Preview</Text>
      </TouchableOpacity>
    );

    let arrivedButton = (
      <TouchableOpacity onPress={ this.arrivedHandler } style={{...styles.previewBtn, backgroundColor: "orange"}}>
          <Text style={styles.btnText}>Arrived</Text>
        </TouchableOpacity>
    );

    let startButton = (
      <TouchableOpacity onPress={ this.startHandler } style={{...styles.previewBtn, backgroundColor: "green"}}>
          <Text style={styles.btnText}>Start Trip</Text>
        </TouchableOpacity>
    );

    let endButton = (
      <TouchableOpacity onPress={ this.endHandler } style={{...styles.previewBtn, backgroundColor: '#d32f2f'}}>
        <Text style={styles.btnText}>End Trip</Text>
      </TouchableOpacity> 
    )

    let button;

    if(this.state.driverStatus === "pending") {
      button = previewButton
    }
    else if(this.state.driverStatus === 'on the way') {
      button = arrivedButton
    }
    else if(this.state.driverStatus === 'arrived') {
      button = startButton
    }
    else if(this.state.driverStatus === 'trip has started') {
      button = endButton
    }
    else if(this.state.driverStatus === 'trip has ended') {
      let price = `${this.state.price} Birr`
      button = (
        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center"}}>
          <Text style={{ fontSize: 18, fontWeight: "700"}}>{price}</Text>
          <TouchableOpacity style={{ marginLeft: 20, borderRadius: 5, padding: 10, backgroundColor: "#156fca"}} 
            onPress={ this.deleteTrip }>
              <Text style={{color: "white", fontSize: 15}}>Next</Text>
          </TouchableOpacity>
        </View>
      )
    }
    
   let preview = (
      <View style={styles.preview}>
        <Text style={styles.previewText}>{
           this.state.driverStatus === 'pending' ? 'Passenger Found' : 'Trip Status'
          }</Text>
        { button }
      </View>
   );

   return (
   <View style={styles.container}>
     <StatusBar backgroundColor="grey"
            barStyle="light-content" />
     <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={styles.map}
       onPress={ (e) => this.setState({currentLocation: e.nativeEvent.coordinate})}
       region={ this.state.initialRegion } >
       <Marker
          coordinate={this.state.currentLocation}
          onDragEnd={(e) => this.setState({currentLocation: e.nativeEvent.coordinate})}
          draggable
          />
     </MapView>
      { this.state.searchPassenger ? loading: preview }
      <PreviewModal toggleModal={this.toggleModal} data={this.state.passengerData}
        takeIt={this.takeRide}
         modalVisible={this.state.modalVisible} ></PreviewModal>
   </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  preview: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  previewText: {
    fontSize: 20,
    fontWeight: "600",

  },
  previewBtn: {
    padding: 10,
    backgroundColor: '#156fca',
    borderRadius: 5
  },
  btnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: "500"
  },
  map: {
    height: "80%",
  },
  searching: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-evenly',
    flex: 1,
    // padding: 20
  },
  searchingText: {
    fontSize: 22,
    color: "#bbb",
    fontWeight: "600"
  }
  });

export default Map;