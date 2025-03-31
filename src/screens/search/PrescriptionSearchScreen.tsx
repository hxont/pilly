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
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://52.78.204.121:8080/medicine/all';

const SearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const onSelect = route.params?.onSelect;

  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 🔹 전체 약 리스트 불러오기
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
    return medicines.filter((medicine) =>
      medicine.medicineName.includes(searchTerm)
    );
  }, [medicines, searchTerm]);

  // 🔹 약 선택 시 이전 화면에 콜백 전달
  const handleSelectMedicine = (medicineName: string) => {
    if (onSelect) {
      onSelect(medicineName);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>약 검색하기</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
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
              <View style={styles.card}>
                <View style={styles.imageContainer}>
                  {item.medicineImage ? (
                    <Image source={{ uri: item.medicineImage }} style={styles.image} />
                  ) : (
                    <Text style={styles.noImageText}>이미지 없음</Text>
                  )}
                </View>

                <View style={styles.infoContainer}>
                  <Text style={styles.medicineName}>{item.medicineName}</Text>
                </View>

                <View style={styles.actionContainer}>
                  <TouchableOpacity onPress={() => handleSelectMedicine(item.medicineName)}>
                    <Text style={styles.selectText}>+ 선택</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('MedicineDetail', {
                        medicineName: item.medicineName,
                      })
                    }
                  >
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
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold' },

  searchContainer: { alignItems: 'center', marginBottom: 10 },
  searchInput: {
    width: '90%',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#F2F8FF',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  noImageText: {
    fontSize: 12,
    color: '#999',
  },
  infoContainer: { flex: 1, marginLeft: 10 },
  medicineName: { fontSize: 16, fontWeight: 'bold' },

  actionContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  detailText: {
    textDecorationLine: 'underline',
    color: '#A8A8A8',
    fontSize: 12,
  },
  selectText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
});

export default SearchScreen;
