import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const PrescriptionSetupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ 기존 약 목록을 유지하면서 추가된 약을 반영
  const [medicineList, setMedicineList] = useState<{ name: string }[]>(route.params?.medicineList || []);
  const [medicineInput, setMedicineInput] = useState("");

  // ✅ 검색에서 추가된 약 반영 (이전 화면이 다시 활성화될 때 실행)
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.newMedicine) {
        setMedicineList((prev) => [...prev, ...route.params.newMedicine]);
        navigation.setParams({ newMedicine: null }); // ✅ 중복 추가 방지
      }
    }, [route.params?.newMedicine])
  );

  // ✅ 직접 입력한 약 추가
  const addMedicineManually = () => {
    if (medicineInput.trim() !== "") {
      setMedicineList((prev) => [...prev, { name: medicineInput.trim() }]);
      setMedicineInput(""); // 입력 필드 초기화
    }
  };

  // ✅ 약 삭제 기능
  const removeMedicine = (index: number) => {
    setMedicineList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>직접 약 등록하기</Text>
      </View>

      <Text style={styles.subtitle}>약 이름을 추가해주세요.</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="예) 타이레놀, 감기약"
          value={medicineInput}
          onChangeText={setMedicineInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={addMedicineManually}>
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>

      {medicineList.length > 0 && (
        <View style={styles.medicineListContainer}>
          {medicineList.map((medicine, index) => (
            <View key={index} style={styles.medicineItem}>
              <Text style={styles.bullet}>●</Text>
              <Text style={styles.medicineText}>{medicine.name}</Text>
              <TouchableOpacity onPress={() => removeMedicine(index)}>
                <Icon name="close-circle" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.addMedicineBox}>
        <Text style={styles.infoText}>아래 버튼으로 약을 검색하여 추가해보세요.</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() =>
            navigation.navigate("PrescriptionSearchScreen", { medicineList })
          }
        >
          <Icon name="plus-circle-outline" size={24} color="#007AFF" />
          <Text style={styles.searchButtonText}>약 검색</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


// 📌 스타일
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", paddingBottom: 16 },
  backButton: { marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  subtitle: { fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  inputRow: { flexDirection: "row", alignItems: "center" },
  input: { flex: 1, backgroundColor: "#F8F8F8", padding: 12, borderRadius: 10, fontSize: 14 },
  addButton: { marginLeft: 8, backgroundColor: "#007AFF", padding: 10, borderRadius: 10 },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  medicineListContainer: { marginTop: 8 },
  medicineItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8FF", padding: 10, borderRadius: 10, marginBottom: 5 },
  medicineText: { flex: 1, fontSize: 14 },
  addMedicineBox: { backgroundColor: "#F2F8FF", padding: 16, borderRadius: 10, marginTop: 20, alignItems: "center" },
  infoText: { fontSize: 14, color: "#555", marginBottom: 10, textAlign: "center" },
  searchButton: { flexDirection: "row", alignItems: "center" },
  searchButtonText: { fontSize: 16, color: "#007AFF", fontWeight: "bold", marginLeft: 5 },
  saveButton: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
  saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default PrescriptionSetupScreen;
