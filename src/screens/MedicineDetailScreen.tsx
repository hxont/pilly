import React, { useState, useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, TouchableOpacity, View, Text, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // ✅ 아이콘 추가

function MedicineDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { medicineName = "기본 값 없음" } = route.params || {};
  
  console.log("Received medicineName:", medicineName);

  const [medicineData, setMedicineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('basic');

  useEffect(() => {
    if (!medicineName || medicineName === "기본 값 없음") {
      console.error("medicineName이 없습니다.");
      setLoading(false);
      return;
    }

    const fetchMedicineDetails = async () => {
      try {
        console.log("API 요청:", `http://52.78.204.121:8080/medicine/search/${medicineName}`);
        const response = await axios.get(`http://52.78.204.121:8080/medicine/search/${medicineName}`);
        console.log("API 응답:", response.data);
        if (response.data.success && response.data.data.length > 0) {
          setMedicineData(response.data.data[0]);
        } else {
          console.error("약 정보를 찾을 수 없음:", response.data);
        }
      } catch (error) {
        console.error('약 정보 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicineDetails();
  }, [medicineName]);

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text>약 정보를 불러오는 중...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!medicineData) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <Text style={styles.errorText}>약 정보를 찾을 수 없습니다.</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* ✅ 검정 화살표 아이콘 적용 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>약 정보 자세히보기</Text>
        </View>

        {/* 약 이미지 */}
        <View style={styles.imageBox}>
          {medicineData?.medicineImage ? (
            <Image source={{ uri: medicineData.medicineImage }} style={styles.medicineImage} />
          ) : (
            <Text style={styles.noImageText}>이미지 준비중</Text>
          )}
        </View>

        {/* 정보 탭 */}
        <View style={styles.infoContainer}>
          <View style={styles.selectBox}>
            <TouchableOpacity onPress={() => setSelectedTab('basic')}>
              <Text style={[styles.selectText, selectedTab === 'basic' && styles.selectedText]}>
                기본 정보
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSelectedTab('sideEffect')}>
              <Text style={[styles.selectText, selectedTab === 'sideEffect' && styles.selectedText]}>
                부작용
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 1, backgroundColor: '#d9d9d9', width: '100%' }} />

          {/* 약 정보 출력 */}
          <View style={styles.contentBox}>
            {selectedTab === 'basic' ? (
              <>
                <Text style={styles.contentTitle}>약품명</Text>
                <Text style={styles.contentText}>{medicineData?.medicineName || '정보 없음'}</Text>

                <Text style={styles.contentTitle}>효능효과</Text>
                <Text style={styles.contentText}>{medicineData?.effect || '정보 없음'}</Text>

                <Text style={styles.contentTitle}>복용법</Text>
                <Text style={styles.contentText}>{medicineData?.dosage || '정보 없음'}</Text>
              </>
            ) : (
              <>
                <Text style={styles.contentTitle}>기본 부작용</Text>
                <Text style={styles.contentText}>
                  {medicineData?.caution || '부작용 정보 없음'}
                </Text>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// 📌 스타일 정의
const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: 20,
  },
  medicineImage: {
    width: 180,
    height: 180,
  },
  noImageText: {
    fontSize: 14,
    color: '#999',
  },
  infoContainer: { flex: 1 },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  selectText: { fontSize: 16, fontWeight: 'bold', color: '#B2B2B2' },
  selectedText: { fontSize: 16, fontWeight: 'bold', color: '#666666' },
  contentBox: { paddingHorizontal: 20 },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 15,
  },
  contentText: { fontSize: 14, fontWeight: 'bold', color: '#A8A8A8' },
});

export default MedicineDetailScreen;
