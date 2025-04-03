import React, { useEffect, useState } from 'react';
import {
View, Text, StyleSheet, TouchableOpacity, Modal,
PermissionsAndroid, Platform
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPharmacies } from '../slices/pharmacySlice';
import { RootState, AppDispatch } from '../store';

const MapScreen = () => {
const [location, setLocation] = useState({
    latitude: 35.248224,
    longitude: 128.902757,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
});

// reduc를 통해 전역 데이터를 가져옴
const dispatch = useDispatch<AppDispatch>();
const { pharmacies, loading } = useSelector((state: RootState) => state.pharmacy);

const [selectedPharmacy, setSelectedPharmacy] = useState(null);
const [isModalVisible, setModalVisible] = useState(false);

const openModal = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setModalVisible(true);
};

const closeModal = () => {
    setSelectedPharmacy(null);
    setModalVisible(false);
};

const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: '위치 권한 요청',
          message: '현재 위치를 사용하려면 권한이 필요합니다.',
          buttonPositive: '확인',
        }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
};

useEffect(() => {
    const getCurrentLocation = async () => {
    const granted = await requestLocationPermission();
    if (!granted) return;

    Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation((prev) => ({ ...prev, latitude, longitude }));
        },
        (err) => console.log(err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    getCurrentLocation();
    dispatch(fetchPharmacies()); // 🔥 앱 진입 시 1회 로딩
}, [dispatch]);

const renderOpeningHours = (pharmacy) => {
  if (!pharmacy) return null; // ⛔️ null 이면 렌더링하지 않음
    const days = [
    { label: "월", open: pharmacy.monOpen, close: pharmacy.monClose },
    { label: "화", open: pharmacy.tueOpen, close: pharmacy.tueClose },
    { label: "수", open: pharmacy.wedOpen, close: pharmacy.wedClose },
    { label: "목", open: pharmacy.thuOpen, close: pharmacy.thuClose },
    { label: "금", open: pharmacy.friOpen, close: pharmacy.friClose },
    { label: "토", open: pharmacy.satOpen, close: pharmacy.satClose },
    { label: "일", open: pharmacy.sunOpen, close: pharmacy.sunClose },
    { label: "공휴일", open: pharmacy.holOpen, close: pharmacy.holClose },
    ];

    return days.map((day, index) => (
    <Text key={index} style={{ fontSize: 14, color: "#444" }}>
        {day.label}: {day.open && day.close ? `${day.open} ~ ${day.close}` : "휴무"}
    </Text>
    ));
};

return (
    <SafeAreaView style={{ flex: 1 }}>
    <MapView style={{ flex: 1 }} region={location} showsUserLocation>
        <Marker coordinate={location} title="내 위치" />

        {!loading &&
        pharmacies.map((pharmacy) => (
            <Marker
            key={pharmacy.pharmacyId}
            coordinate={{
                latitude: pharmacy.latitude,
                longitude: pharmacy.longitude,
            }}
            title={pharmacy.name}
            onPress={() => openModal(pharmacy)}
            >
            <Text style={{ fontSize: 24 }}>💊</Text>
            </Marker>
        ))}
    </MapView>

    <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={styles.modalContainer}>
            <Text style={styles.title}>{selectedPharmacy?.name}</Text>
            <Text>📍 {selectedPharmacy?.address}</Text>
            <Text>☎️ {selectedPharmacy?.phone}</Text>
            <View style={{ marginTop: 10 }}>{renderOpeningHours(selectedPharmacy)}</View>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={{ color: "#0169CD", fontWeight: "bold" }}>닫기</Text>
            </TouchableOpacity>
        </View>
        </View>
    </Modal>
    </SafeAreaView>
);
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    closeButton: {
        marginTop: 16,
        padding: 10,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#0169CD",
        borderRadius: 8,
    },
});

export default MapScreen;
