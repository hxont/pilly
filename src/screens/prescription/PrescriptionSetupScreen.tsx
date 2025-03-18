import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Checkbox } from "react-native-paper";

const PrescriptionSetupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ 처방전 정보 초기화
  const prescription = route.params?.prescription || { medicinesList: [] };

  // ✅ 선택된 약 목록 초기화
  const [selectedMedicines, setSelectedMedicines] = useState<boolean[]>(
    prescription.medicinesList?.map(() => true) || []
  );
  const [medicineList, setMedicineList] = useState(prescription.medicinesList || []);
  const [medicineInput, setMedicineInput] = useState("");

  // ✅ 검색에서 넘어온 약 추가 (뒤로가기 후 자동 추가)
  useEffect(() => {
    if (route.params?.newMedicine) {
      const newMedicine = route.params.newMedicine;

      // 중복 추가 방지
      if (!medicineList.some((medicine) => medicine.name === newMedicine.name)) {
        setMedicineList((prev) => [...prev, newMedicine]);
        setSelectedMedicines((prev) => [...prev, true]);
      }
    }
  }, [route.params?.newMedicine]);

  // ✅ 체크박스 상태 변경 함수
  const toggleMedicineSelection = (index: number) => {
    setSelectedMedicines((prev) => {
      const updatedSelection = [...prev];
      updatedSelection[index] = !updatedSelection[index];
      return updatedSelection;
    });
  };

  // ✅ 직접 입력한 약 추가
  const addMedicineManually = () => {
    if (medicineInput.trim() !== "") {
      setMedicineList((prev) => [...prev, { name: medicineInput.trim() }]);
      setSelectedMedicines((prev) => [...prev, true]);
      setMedicineInput(""); // 입력 필드 초기화
    }
  };

  // ✅ 약 삭제 기능
  const removeMedicine = (index: number) => {
    setMedicineList((prev) => prev.filter((_, i) => i !== index));
    setSelectedMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ScrollView style={styles.container}>
      {/* 🔹 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>인식 결과 확인하기</Text>
      </View>

      {/* 🔹 직접 약 추가 */}
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

      {/* 🔹 추가된 약 리스트 (● 아이콘 포함) */}
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

      {/* 🔹 약 추가 버튼 */}
      <View style={styles.addMedicineBox}>
        <Text style={styles.infoText}>인식되지 않은 약이 있다면, 아래 버튼으로 추가해 주세요.</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate("PrescriptionSearchScreen")} // 🔹 검색 화면으로 이동
        >
          <Icon name="plus-circle-outline" size={24} color="#007AFF" />
          <Text style={styles.searchButtonText}>약 검색</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 저장 버튼 */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>약 추가 완료하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// 📌 스타일링
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 6,
    borderRadius: 10,
    fontSize: 13,
  },
  addButton: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    padding: 7,
    borderRadius: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  medicineListContainer: {
    marginTop: 8,
  },
  medicineItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8FF", // ✅ 하늘색 배경 적용
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  bullet: {
    fontSize: 16,
    color: "#000",
    marginRight: 5,
  },
  medicineText: {
    flex: 1,
    fontSize: 14,
  },
  addMedicineBox: {
    backgroundColor: "#F2F8F2",
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  infoText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "bold",
    marginLeft: 5,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PrescriptionSetupScreen;