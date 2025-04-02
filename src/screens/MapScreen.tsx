import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    PermissionsAndroid,
    Platform,
    Text,
    TouchableOpacity,
    Modal,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const MapScreen = () => {
    const [location, setLocation] = useState({
        latitude: 35.248224, 
        longitude: 128.902757,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const [pharmacies, setPharmacies] = useState([]);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    // 약국 마커 클릭 시 모달 열기
    const openModal = (pharmacy) => {
        setSelectedPharmacy(pharmacy);
        setModalVisible(true);
    };

// 모달 닫기 함수
    const closeModal = () => {
        setSelectedPharmacy(null);
        setModalVisible(false);
    };


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

                    // 위치 기반으로 약국 데이터 불러오기
                    fetchPharmacies("김해");  // 🔥 여기에 원하는 지역명 입력하면 돼!
                },
                (error) => console.log(error),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        };

        getCurrentLocation();
    }, []);

    // 약국 데이터 가져오는 함수
    const fetchPharmacies = async (keyword) => {
        try {
            const response = await fetch(`http://52.78.204.121:8080/pharmacy/search?keyword=${keyword}`);
            const data = await response.json();
            setPharmacies(data); // 약국 리스트 상태 업데이트
        } catch (error) {
            console.error("약국 데이터 로드 실패:", error);
        }
    };

    const renderOpeningHours = (pharmacy) => {
        const days = [
            { label: "월요일", open: pharmacy.monOpen, close: pharmacy.monClose },
            { label: "화요일", open: pharmacy.tueOpen, close: pharmacy.tueClose },
            { label: "수요일", open: pharmacy.wedOpen, close: pharmacy.wedClose },
            { label: "목요일", open: pharmacy.thuOpen, close: pharmacy.thuClose },
            { label: "금요일", open: pharmacy.friOpen, close: pharmacy.friClose },
            { label: "토요일", open: pharmacy.satOpen, close: pharmacy.satClose },
            { label: "일요일", open: pharmacy.sunOpen, close: pharmacy.sunClose },
            { label: "공휴일", open: pharmacy.holOpen, close: pharmacy.holClose },
        ];

        return days.map((day, index) => (
            <Text key={index} style={styles.hoursText}>
                {day.label} ⏰ {day.open && day.close ? `${day.open} - ${day.close}` : "휴무"}
            </Text>
        ));
    };


    return (
        <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
            <View style={styles.title}>
                <Text style={styles.titleText}>주변 약국 찾기</Text>
                <Text style={styles.detailText}>💊를 클릭하면 약국 정보를 볼 수 있어요</Text>
            </View>
            <MapView
                style={styles.map}
                initialRegion={location}
                region={location}
                showsUserLocation={true} // 현재 위치 표시
            >
                {/* 현재 위치 마커 */}
                <Marker coordinate={location} title="내 위치" description="현재 위치입니다." />

                {/* 약국 위치 마커 */}
                {pharmacies.map((pharmacy) => (
                    <Marker
                        key={pharmacy.pharmacyId}
                        coordinate={{ latitude: pharmacy.latitude, longitude: pharmacy.longitude }}
                        title={pharmacy.name}
                        onPress={() => openModal(pharmacy)}
                    >
                        <Text style={styles.markerEmoji}>💊</Text>
                    </Marker>
                ))}
            </MapView>
            {/* 약국 상세 정보 모달 */}
            {selectedPharmacy && (
                <Modal visible={isModalVisible} transparent={true} animationType="slide">
                    <View style={styles.modalOverlay} onTouchEnd={closeModal} />
                    <View style={styles.modalContainer}>
                        <Text style={styles.pharmacyName}>{selectedPharmacy.name}</Text>
                        <Text style={styles.phone}>☎️ {selectedPharmacy.phone}</Text>
                        <Text style={styles.address}>📍 {selectedPharmacy.address}</Text>
                        <View style={styles.hoursContainer}>
                            {renderOpeningHours(selectedPharmacy)}
                        </View>

                        <TouchableOpacity style={styles.detailButton} onPress={closeModal}>
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
    container: {
        flex: 1,
    },
    title: {
        flex: 0.6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    detailText: {
        marginVertical: 5,
        fontSize: 12,
        color: '#666666'
    },
    buttonBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginTop: 10,
    },
    map: {
        flex: 8,
        width: '100%',
        height: '100%',
    },
    markerEmoji: {
        fontSize: 30,
    },
    modalContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    tagContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    openTag: {
        backgroundColor: '#007bff',
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        fontSize: 14,
        marginRight: 5,
    },
    holidayTag: {
        backgroundColor: '#FFA500',
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        fontSize: 14,
    },
    pharmacyName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    address: {
        fontSize: 16,
        color: '#666666',
        marginBottom: 5,
        textAlign: 'center',
    },
    detailButton: {
        borderColor: '#0169CD',
        borderWidth: 1,
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#0169CD',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalContainer: {
        position: "absolute",  // 절대 위치 설정
        bottom: 0,  // 화면 아래에 배치
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 15,  // 모서리 둥글게
        borderTopRightRadius: 15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },  // 위쪽 그림자 효과
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    hoursContainer: {
        marginTop: 10,
        marginBottom: 10,
    },
    hoursText: {
        fontSize: 16,
        marginBottom: 3,
        color: '#666666',
    },
    phone: {
        fontSize: 16,
        color: "#666666",
        fontWeight: "bold",
        marginVertical: 5,
    },


});

export default MapScreen;
