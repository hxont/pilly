import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image, // ✅ 기본 Image 컴포넌트
} from 'react-native';
import axios from 'axios';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://52.78.204.121:8080/medicine/all';

function SearchScreen({ navigation }) {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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

  const filteredMedicines = useMemo(() => {
    return medicines.filter(
      (medicine) =>
        medicine.medicineName.includes(searchTerm) &&
        !!medicine.medicineImage
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
                  <Image
                    style={styles.medicineImage}
                    source={{ uri: item.medicineImage }}
                    resizeMode="contain" // ✅ 기본 Image의 속성 사용
                  />
                </View>

                <View style={styles.textBox}>
                  <Text style={styles.medicineName}>{item.medicineName}</Text>
                </View>

                <View style={styles.detailBox}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('MedicineDetail', {
                        medicineId: item.medicineId,
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
}

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

  medicineBox: {
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
    width: '100%',
    height: '100%',
  },
  textBox: { flex: 1, marginLeft: 10 },
  medicineName: { fontSize: 14, fontWeight: 'bold' },
  medicineIdText: { fontSize: 12, color: '#999' },

  detailBox: { alignItems: 'flex-end' },
  detailText: {
    textDecorationLine: 'underline',
    color: '#A8A8A8',
    fontSize: 12,
  },
});

export default SearchScreen;
