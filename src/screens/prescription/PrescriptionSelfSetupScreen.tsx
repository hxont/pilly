import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Checkbox } from "react-native-paper";
import axios from "axios";

const API_URL = "http://52.78.204.121:8080/prescription/create";

const PrescriptionSetupScreen = () => {
  const navigation = useNavigation();

  const [prescriptionName, setPrescriptionName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [medicineList, setMedicineList] = useState<string[]>([]);
  const [medicineInput, setMedicineInput] = useState("");

  const [morningChecked, setMorningChecked] = useState(false);
  const [afternoonChecked, setAfternoonChecked] = useState(false);
  const [eveningChecked, setEveningChecked] = useState(false);

  const normalize = useCallback((name: string) => name.trim().toLowerCase(), []);

  const uniqueMedicineList = useMemo(() => {
    const seen = new Set();
    return medicineList.filter((name) => {
      const key = normalize(name);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [medicineList, normalize]);

  const addMedicineManually = () => {
    const trimmed = medicineInput.trim();
    if (
      trimmed !== "" &&
      !medicineList.map(normalize).includes(normalize(trimmed))
    ) {
      setMedicineList((prev) => [...prev, trimmed]);
      setMedicineInput("");
    }
  };

  const removeMedicine = (index: number) => {
    setMedicineList((prev) => prev.filter((_, i) => i !== index));
  };

  const submitPrescription = async () => {
    if (!prescriptionName || !startDate || !endDate || uniqueMedicineList.length === 0) {
      Alert.alert("입력 오류", "처방전 이름, 기간, 약 목록을 모두 입력해주세요.");
      return;
    }

    const requestData = {
      userId: 1,
      prescriptionName: prescriptionName.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      morningTime: morningChecked ? "09:00" : "",
      afternoonTime: afternoonChecked ? "13:00" : "",
      eveningTime: eveningChecked ? "19:00" : "",
      medicineNames: uniqueMedicineList.map((name) => name.trim()),
    };

    console.log("📦 전송 데이터:", requestData);

    try {
      await axios.post(API_URL, requestData);
      Alert.alert("성공", "처방전이 등록되었습니다!");
      navigation.goBack();
    } catch (error: any) {
      console.error("❌ 처방전 등록 실패:", error.response?.data || error.message);
      Alert.alert("실패", "처방전 등록에 실패했습니다.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>직접 약 등록하기</Text>
      </View>

      <Text style={styles.subtitle}>약 이름을 직접 추가</Text>
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

      {uniqueMedicineList.length > 0 && (
        <View style={styles.medicineListContainer}>
          {uniqueMedicineList.map((medicine, index) => (
            <View key={`${medicine}-${index}`} style={styles.medicineItem}>
              <Text style={styles.bullet}>●</Text>
              <Text style={styles.medicineText}>{medicine}</Text>
              <TouchableOpacity onPress={() => removeMedicine(index)}>
                <Icon name="close-circle" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.searchFromCamera}
        onPress={() =>
          navigation.navigate("PrescriptionSearchScreen", {
            onSelect: (selected: string) => {
              const trimmed = selected.trim();
              if (
                trimmed &&
                !medicineList.map(normalize).includes(normalize(trimmed))
              ) {
                setMedicineList((prev) => [...prev, trimmed]);
              }
            },
          })
        }
      >
        <Text style={styles.searchFromCameraText}>+ 약 검색하기</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>처방전 상세 정보</Text>
      <TextInput
        style={[styles.input, styles.dateInput, { marginBottom: 8 }]}
        placeholder="처방전 이름을 입력하세요."
        value={prescriptionName}
        onChangeText={setPrescriptionName}
      />
      <View style={styles.dateInputContainer}>
        <TextInput
          style={[styles.input, styles.dateInput]}
          placeholder="YYYY-MM-DD"
          value={startDate}
          onChangeText={setStartDate}
        />
        <Text style={styles.dateSeparator}>~</Text>
        <TextInput
          style={[styles.input, styles.dateInput]}
          placeholder="YYYY-MM-DD"
          value={endDate}
          onChangeText={setEndDate}
        />
      </View>

      <View style={styles.medicineTimeContainer}>
        <View style={styles.medicineTimeRow}>
          <Checkbox.Android
            status={morningChecked ? "checked" : "unchecked"}
            onPress={() => setMorningChecked(!morningChecked)}
            color="#007AFF"
          />
          <Text style={styles.medicineTimeText}>아침 09:00</Text>
        </View>
        <View style={styles.medicineTimeRow}>
          <Checkbox.Android
            status={afternoonChecked ? "checked" : "unchecked"}
            onPress={() => setAfternoonChecked(!afternoonChecked)}
            color="#007AFF"
          />
          <Text style={styles.medicineTimeText}>점심 13:00</Text>
        </View>
        <View style={styles.medicineTimeRow}>
          <Checkbox.Android
            status={eveningChecked ? "checked" : "unchecked"}
            onPress={() => setEveningChecked(!eveningChecked)}
            color="#007AFF"
          />
          <Text style={styles.medicineTimeText}>저녁 19:00</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={submitPrescription}>
        <Text style={styles.saveButtonText}>약 추가 완료하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", paddingBottom: 16 },
  backButton: { marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  searchFromCamera: {
    backgroundColor: "#F0F4FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  searchFromCameraText: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  subtitle: { fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  inputRow: { flexDirection: "row", alignItems: "center" },
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
  addButtonText: { color: "#fff", fontWeight: "bold" },
  medicineListContainer: { marginTop: 8 },
  medicineItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8FF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  bullet: { fontSize: 16, color: "#000", marginRight: 5 },
  medicineText: { flex: 1, fontSize: 14 },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateInput: {
    flex: 1,
    textAlign: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    fontSize: 13,
  },
  dateSeparator: { fontSize: 15, fontWeight: "bold", marginHorizontal: 10 },
  medicineTimeContainer: { marginTop: 10 },
  medicineTimeRow: { flexDirection: "row", alignItems: "center" },
  medicineTimeText: { fontSize: 14, marginLeft: 10 },
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
