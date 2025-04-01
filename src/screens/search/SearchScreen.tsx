import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://52.78.204.121:8080/medicine/all';

function SearchScreen({ navigation }: { navigation: any }) {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 🔹 API에서 데이터 가져오기
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.data.success) {
          setMedicines(response.data.data);
        }
      } catch (error) {
        console.error('데이터를 불러오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  // 🔹 검색 필터링된 결과
const filteredMedicines = useMemo(() => {
  return medicines.filter(
    (medicine) =>
      medicine.medicineName.includes(searchTerm) &&
      !!medicine.medicineImage // 이미지 있는 항목만 표시
  );
}, [medicines, searchTerm]);


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>약 검색하기</Text>
        </View>

        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchBar}
            placeholder=" 약을 검색해보세요."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <FlatList
            data={filteredMedicines}
            keyExtractor={(item) => item.medicineId.toString()}
            renderItem={({ item }) => (
              <View style={styles.medicineBox}>
                <View style={styles.imageBox}>
                <Image source={{ uri: item.medicineImage }} style={styles.image} />
                </View>

                <View style={styles.textBox}>
                  <Text style={styles.medicineName}>{item.medicineName}</Text>
                </View>

                <View style={styles.detailBox}>
                  <TouchableOpacity onPress={() => navigation.navigate('MedicineDetail', { medicineName: item.medicineName })}>
                    <Text style={styles.detailText}>자세히보기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// 📌 **스타일 수정**
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },

  searchBox: { alignItems: 'center', marginBottom: 10 },
  searchBar: {
    width: '90%',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },

  // ✅ **카드 스타일 수정 (그림자 효과 & 크기 조정)**
  medicineBox: {
    flexDirection: 'row',
    backgroundColor: '#F2F8FF',
    borderRadius: 15, // ✅ 둥근 모서리 조정
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5, // ✅ 안드로이드 그림자 효과
    shadowColor: '#000', // ✅ iOS 그림자 효과
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageBox: {
    width: 80,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  
  medicineImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // ✅ 이미지가 잘리지 않고 비율 유지
  },
  noImageText: {
    fontSize: 12,
    color: '#999',
  },

  textBox: { flex: 1, marginLeft: 10 },
  medicineName: { fontSize: 16, fontWeight: 'bold' },
  medicineDesc: { fontSize: 12, color: '#555' },

  detailBox: { alignItems: 'flex-end' },
  detailText: {
    textDecorationLine: 'underline',
    color: '#A8A8A8',
    fontSize: 12,
  },
});

export default SearchScreen;
