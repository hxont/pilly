import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const MapScreen = () => {
    const [location, setLocation] = useState({
        latitude: 37.5665,  // 기본 위치 (서울)
        longitude: 126.9780,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    // 위치 권한 요청 (안드로이드 전용)
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: '위치 권한 요청',
                    message: '현재 위치를 사용하려면 위치 접근 권한이 필요합니다.',
                    buttonNeutral: '나중에',
                    buttonNegative: '취소',
                    buttonPositive: '확인',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
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
                    setLocation({
                        ...location,
                        latitude,
                        longitude,
                    });
                },
                (error) => console.log(error),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        };

        getCurrentLocation();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={location}
                region={location}
                showsUserLocation={true} // 현재 위치 표시
            >
                {/* 현재 위치에 마커 추가 */}
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