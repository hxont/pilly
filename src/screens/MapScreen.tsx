import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const MapScreen = () => {
    const [location, setLocation] = useState({
        latitude: 37.5665,
        longitude: 126.9780,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                ]);

                return (
                    granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED ||
                    granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
                );
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        const getCurrentLocation = async () => {
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) return;

            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation((prevState) => ({
                        ...prevState,
                        latitude,
                        longitude,
                    }));
                },
                (error) => console.log("위치 가져오기 실패: ", error),
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
            );
        };

        getCurrentLocation();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={location}
                showsUserLocation={true}
            >
                <Marker coordinate={location} title="내 위치" description="현재 위치입니다." />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

export default MapScreen;
