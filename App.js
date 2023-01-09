import {transform} from '@babel/core';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import CompassHeading from 'react-native-compass-heading';
import Geolocation from 'react-native-geolocation-service';
const {width, height} = Dimensions.get('window');

const App = () => {
  const [headingState, setHeadingState] = useState(0);
  const [qiblad, setQiblad] = useState(0);

  const calculate = (latitude, longitude) => {
    const PI = Math.PI;
    let lat = (21.4225 * PI) / 180.0;
    let long = (39.8264 * PI) / 180.0;
    let phi = (latitude * PI) / 180.0;
    let lambda = (longitude * PI) / 180.0;
    let qiblad =
      (180.0 / PI) *
      Math.atan2(
        Math.sin(long - lambda),
        Math.cos(phi) * Math.tan(lat) - Math.sin(phi) * Math.cos(long - lambda),
      );
    setQiblad(qiblad);
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log(latitude, longitude);
        calculate(latitude, longitude);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    getLocation();
    const degree_update_rate = 0.5;
    CompassHeading.start(degree_update_rate, ({heading, accuracy}) => {
      console.log('CompassHeading: ', heading, accuracy);
      setHeadingState(heading);
    });

    return () => {
      CompassHeading.stop();
    };
  }, []);
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ImageBackground
        source={require('./assets/compass.png')}
        style={[
          styles.image,
          {transform: [{rotate: `${360 - headingState}deg`}]},
        ]}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{rotate: `${qiblad}deg`}],
          }}>
          <Image
            source={require('./assets/arrow.png')}
            style={{
              marginBottom: '50%',
              resizeMode: 'contain',
              flex: 1,
              marginLeft: '5%',
            }}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default App;
const styles = StyleSheet.create({
  image: {
    width: width,
    height: width,
    resizeMode: 'center',
  },
});
