import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Checkbox } from "react-native-paper";
import axios from "axios";

const API_URL = "http://52.78.204.121:8080/prescription/create";

const PrescriptionSetupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const initialMedicines = route.params?.medicines || [];

  const [prescriptionName, setPrescriptionName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [medicineList, setMedicineList] = useState<string[]>(initialMedicines);
  const [medicineInput, setMedicineInput] = useState("");
  const [checkedStates, setCheckedStates] = useState<{ [key: string]: boolean }>({});

  const [morningChecked, setMorningChecked] = useState(true);
  const [afternoonChecked, setAfternoonChecked] = useState(true);
  const [eveningChecked, setEveningChecked] = useState(true);
  const isInitialized = useRef(false);

  const normalize = useCallback((name: string) => name.trim().toLowerCase(), []);

  useEffect(() => {
    if (!isInitialized.current && initialMedicines.length > 0) {
      const initialStates: { [key: string]: boolean } = {};
      initialMedicines.forEach((m) => {
        initialStates[m] = true;
      });
      setCheckedStates(initialStates);
      isInitialized.current = true;
    }
  }, [initialMedicines]);

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
    if (trimmed && !medicineList.map(normalize).includes(normalize(trimmed))) {
      setMedicineList((prev) => [...prev, trimmed]);
      setCheckedStates((prev) => ({ ...prev, [trimmed]: true }));
      setMedicineInput("");
    }
  };

  const isValidDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);

  const submitPrescription = async () => {
    const filteredMedicines = uniqueMedicineList.filter((m) => checkedStates[m]);

    if (!prescriptionName || !startDate || !endDate || filteredMedicines.length === 0) {
      Alert.alert("입력 오류", "처방전 이름, 기간, 약 목록을 모두 입력해주세요.");
      return;
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      Alert.alert("날짜 형식 오류", "날짜는 YYYY-MM-DD 형식으로 입력해주세요.");
      return;
    }

    if (!morningChecked && !afternoonChecked && !eveningChecked) {
      Alert.alert("알림 시간", "최소 하나의 복용 시간을 선택해주세요.");
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
      medicineNames: filteredMedicines.map((name) => name.trim()),
    };

    try {
      await axios.post(API_URL, requestData);
      Alert.alert("성공", "처방전이 등록되었습니다!");
      navigation.goBack();
    } catch (error: any) {
      console.error("❌ 처방전 등록 실패:", error);
      Alert.alert("실패", "처방전 등록에 실패했습니다.");
    }
  };

  const toggleCheckbox = (medicine: string) => {
    setCheckedStates((prev) => ({
      ...prev,
      [medicine]: !prev[medicine],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>인식결과 확인하기</Text>
      </View>

      <Text style={styles.sectionTitle}>인식된 약을 확인하고 등록해주세요</Text>
      {uniqueMedicineList.map((medicine, index) => (
        <View key={index} style={styles.checkedMedicineItem}>
          <Checkbox.Android
            status={checkedStates[medicine] ? "checked" : "unchecked"}
            onPress={() => toggleCheckbox(medicine)}
            color="#007AFF"
          />
          <Text style={styles.checkedMedicineText}>{medicine}</Text>
        </View>
      ))}

      <View style={styles.cardSearchBox}>
        <Text style={styles.cardSearchText}>
          인식되지 않은 약이 있다면,{'\n'}아래버튼으로 추가해 주세요.
        </Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() =>
            navigation.navigate("PrescriptionSearchScreen", {
              onSelect: (selected: string) => {
                const trimmed = selected.trim();
                if (trimmed && !medicineList.map(normalize).includes(normalize(trimmed))) {
                  setMedicineList((prev) => [...prev, trimmed]);
                  setCheckedStates((prev) => ({ ...prev, [trimmed]: true }));
                }
              },
            })
          }
        >
          <Icon name="plus-circle-outline" size={24} color="#007AFF" />
          <Text style={styles.searchButtonText}>약 검색</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>처방전의 상세정보를 입력해주세요</Text>

      <TextInput
        style={[styles.input, { marginBottom: 10 }]}
        placeholder="처방전 이름을 입력해주세요. 예) 감기약 처방전"
        value={prescriptionName}
        onChangeText={setPrescriptionName}
      />

      <View style={styles.dateInputRow}>
        <TextInput
          style={styles.dateInput}
          placeholder="YYYY-MM-DD"
          value={startDate}
          onChangeText={setStartDate}
        />
        <Text style={styles.dateDash}>~</Text>
        <TextInput
          style={styles.dateInput}
          placeholder="YYYY-MM-DD"
          value={endDate}
          onChangeText={setEndDate}
        />
      </View>

      <View style={{ marginVertical: 10 }}>
        <View style={styles.timeRow}>
          <Checkbox.Android
            status={morningChecked ? "checked" : "unchecked"}
            onPress={() => setMorningChecked(!morningChecked)}
            color="#007AFF"
          />
          <Text style={styles.timeLabel}>아침 09:00</Text>
        </View>
        <View style={styles.timeRow}>
          <Checkbox.Android
            status={afternoonChecked ? "checked" : "unchecked"}
            onPress={() => setAfternoonChecked(!afternoonChecked)}
            color="#007AFF"
          />
          <Text style={styles.timeLabel}>점심 13:00</Text>
        </View>
        <View style={styles.timeRow}>
          <Checkbox.Android
            status={eveningChecked ? "checked" : "unchecked"}
            onPress={() => setEveningChecked(!eveningChecked)}
            color="#007AFF"
          />
          <Text style={styles.timeLabel}>저녁 19:00</Text>
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
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backButton: { marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#333",
  },
  checkedMedicineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  checkedMedicineText: {
    fontSize: 14,
    color: "#333",
  },
  cardSearchBox: {
    backgroundColor: "#F0F4FF",
    padding: 16,
    borderRadius: 12,
    marginVertical: 16,
    alignItems: "center",
  },
  cardSearchText: {
    fontSize: 13,
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
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 13,
    height: 40,
  },
  dateInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 13,
  },
  dateDash: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: "bold",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  timeLabel: {
    fontSize: 14,
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PrescriptionSetupScreen;
