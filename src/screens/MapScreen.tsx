// MapScreen.tsx

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPharmacies} from '../slices/pharmacySlice';
import {RootState, AppDispatch} from '../store/index';

const MapScreen = () => {
  const [location, setLocation] = useState({
    latitude: 35.248224,
    longitude: 128.902757,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const dispatch = useDispatch<AppDispatch>();
  const {pharmacies} = useSelector((state: RootState) => state.pharmacy);

  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<
    'openNow' | 'alwaysOpen' | 'night' | null
  >(null);

  const openModal = pharmacy => {
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
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    const getCurrentLocation = async () => {
      const granted = await requestLocationPermission();
      if (!granted) {
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation(prev => ({...prev, latitude, longitude}));
        },
        err => console.log(err),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };

    getCurrentLocation();
    dispatch(fetchPharmacies());
  }, [dispatch]);

  const renderOpeningHours = pharmacy => {
    if (!pharmacy) {
      return null;
    }

    const days = [
      {label: '월', open: pharmacy.monOpen, close: pharmacy.monClose},
      {label: '화', open: pharmacy.tueOpen, close: pharmacy.tueClose},
      {label: '수', open: pharmacy.wedOpen, close: pharmacy.wedClose},
      {label: '목', open: pharmacy.thuOpen, close: pharmacy.thuClose},
      {label: '금', open: pharmacy.friOpen, close: pharmacy.friClose},
      {label: '토', open: pharmacy.satOpen, close: pharmacy.satClose},
      {label: '일', open: pharmacy.sunOpen, close: pharmacy.sunClose},
      {label: '공휴일', open: pharmacy.holOpen, close: pharmacy.holClose},
    ];

    return days.map((day, index) => (
      <Text key={index} style={{fontSize: 14, color: '#444'}}>
        {day.label}:{' '}
        {day.open && day.close ? `${day.open} ~ ${day.close}` : '휴무'}
      </Text>
    ));
  };

  const getTodayOpenClose = pharmacy => {
    const day = new Date().getDay();
    const dayMap = [
      {open: pharmacy.sunOpen, close: pharmacy.sunClose},
      {open: pharmacy.monOpen, close: pharmacy.monClose},
      {open: pharmacy.tueOpen, close: pharmacy.tueClose},
      {open: pharmacy.wedOpen, close: pharmacy.wedClose},
      {open: pharmacy.thuOpen, close: pharmacy.thuClose},
      {open: pharmacy.friOpen, close: pharmacy.friClose},
      {open: pharmacy.satOpen, close: pharmacy.satClose},
    ];
    return dayMap[day];
  };

  const isPharmacyOpenNow = pharmacy => {
    const {open, close} = getTodayOpenClose(pharmacy);
    if (!open || !close) {
      return false;
    }

    const now = new Date();
    const [openH, openM] = open.split(':').map(Number);
    const [closeH, closeM] = close.split(':').map(Number);

    const openTime = new Date(now);
    openTime.setHours(openH, openM, 0, 0);

    const closeTime = new Date(now);
    closeTime.setHours(closeH, closeM, 0, 0);

    return now >= openTime && now <= closeTime;
  };

  const isAlwaysOpen = pharmacy =>
    pharmacy.sunOpen &&
    pharmacy.sunClose &&
    pharmacy.holOpen &&
    pharmacy.holClose;

  const isNightPharmacy = pharmacy => {
    const {close} = getTodayOpenClose(pharmacy);
    if (!close) {
      return false;
    }
    const [closeH] = close.split(':').map(Number);
    return closeH >= 21; // 21시 이후까지 영업
  };

  const filteredPharmacies = pharmacies.filter(pharmacy => {
    if (filter === 'openNow') {
      return isPharmacyOpenNow(pharmacy);
    }
    if (filter === 'alwaysOpen') {
      return isAlwaysOpen(pharmacy);
    }
    if (filter === 'night') {
      return isNightPharmacy(pharmacy);
    }
    return true; // 필터 없으면 전체 표시
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>주변 약국 찾기</Text>
          <Text style={styles.detailText}>
            💊를 클릭하면 약국 정보를 볼 수 있어요
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'openNow' && styles.activeFilterButton,
            ]}
            onPress={() => setFilter(filter === 'openNow' ? null : 'openNow')}>
            <Text
              style={[
                styles.filterButtonText,
                filter === 'openNow' && styles.activeFilterButtonText,
              ]}>
              영업중
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'alwaysOpen' && styles.activeFilterButton,
            ]}
            onPress={() =>
              setFilter(filter === 'alwaysOpen' ? null : 'alwaysOpen')
            }>
            <Text
              style={[
                styles.filterButtonText,
                filter === 'alwaysOpen' && styles.activeFilterButtonText,
              ]}>
              연중무휴
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'night' && styles.activeFilterButton,
            ]}
            onPress={() => setFilter(filter === 'night' ? null : 'night')}>
            <Text
              style={[
                styles.filterButtonText,
                filter === 'night' && styles.activeFilterButtonText,
              ]}>
              심야약국
            </Text>
          </TouchableOpacity>
        </View>

        <MapView
          style={styles.map}
          initialRegion={location}
          region={location}
          showsUserLocation={true}>
          <Marker
            coordinate={location}
            title="내 위치"
            description="현재 위치입니다."
          />
          {filteredPharmacies.map(pharmacy => (
            <Marker
              key={pharmacy.pharmacyId}
              coordinate={{
                latitude: pharmacy.latitude,
                longitude: pharmacy.longitude,
              }}
              title={pharmacy.name}
              onPress={() => openModal(pharmacy)}>
              <Text style={styles.markerEmoji}>💊</Text>
            </Marker>
          ))}
        </MapView>

        {selectedPharmacy && (
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide">
            <View style={styles.modalOverlay} onTouchEnd={closeModal} />
            <View style={styles.modalContainer}>
              <Text style={styles.pharmacyName}>{selectedPharmacy.name}</Text>
              <Text style={styles.phone}>☎️ {selectedPharmacy.phone}</Text>
              <Text style={styles.address}>📍 {selectedPharmacy.address}</Text>
              <View style={styles.hoursContainer}>
                {renderOpeningHours(selectedPharmacy)}
              </View>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={closeModal}>
                <Text style={styles.buttonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  title: {alignItems: 'center', marginVertical: 10},
  titleText: {fontSize: 18, fontWeight: 'bold'},
  detailText: {fontSize: 12, color: '#666'},
  buttonGroup: {
    position: 'absolute',
    top: 95,
    flexDirection: 'row',
    padding: 4,
    borderRadius: 20,
    zIndex: 10,
    marginLeft: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#0169CD',
  },
  filterButtonText: {fontWeight: 'bold', fontSize: 14},
  map: {flex: 1, width: '100%', height: '100%'},
  markerEmoji: {fontSize: 30},
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  pharmacyName: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  phone: {
    fontSize: 16,
    color: '#666666',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  address: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
    textAlign: 'center',
  },
  hoursContainer: {marginTop: 10, marginBottom: 10},
  detailButton: {
    borderColor: '#0169CD',
    borderWidth: 1,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {color: '#0169CD', fontSize: 16, fontWeight: 'bold'},
  activeFilterButton: {
    backgroundColor: '#0169CD',
  },

  activeFilterButtonText: {
    color: 'white',
  },
});

export default MapScreen;