import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Checkbox } from "react-native-paper";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "http://52.78.204.121:8080/medicine/todayAlarm/1";

const PrescriptionScreen = () => {
  const [alarms, setAlarms] = useState([]);
  const [medicineIds, setMedicineIds] = useState([]);
  const [selectedAlarm, setSelectedAlarm] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedTime, setEditedTime] = useState("");
  const [selectedMeds, setSelectedMeds] = useState({});

  const handleUpdate = () => {
    console.log("🛠 수정할 알람 시간:", editedTime);
    console.log("✔ 선택된 처방전:", selectedMeds);
    setModalVisible(false);
  };
  
  const handleDelete = () => {
    console.log("🗑 삭제할 처방전:", selectedMeds);
    setModalVisible(false);
  };
  

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.data) {
          setAlarms(response.data.alarm);
          setMedicineIds(response.data.allMedicineIds);
        }
      } catch (error) {
        console.error("알람 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchAlarms();
  }, []);

  // ✅ 알람 버튼 클릭 시 모달 열기
  const openModal = (alarm) => {
    setSelectedAlarm(alarm);
    setEditedTime(alarm.alarmTime);
    setSelectedMeds(
      alarm.prescriptionIds.reduce((acc, id) => ({ ...acc, [id]: true }), {})
    );
    setModalVisible(true);
  };

  // ✅ 체크박스 토글
  const toggleCheckbox = (id) => {
    setSelectedMeds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>약/알람 관리</Text>

        <Text style={styles.sectionTitle}>약 알람</Text>
        <View style={styles.alarmContainer}>
          {alarms.map((alarm, index) => (
            <TouchableOpacity
              key={index}
              style={styles.alarmCard}
              onPress={() => openModal(alarm)}
            >
              <Text style={styles.alarmTime}>{alarm.alarmTime}</Text>
              <View style={styles.alarmRow}>
                <Icon name="pill" size={14} color="#007AFF" />
                <Text style={styles.alarmCount}>{alarm.medicineCount}개</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>현재 복용 중인 약</Text>
        <View style={styles.medicineList}>
          {medicineIds.length > 0 ? (
            medicineIds.map((id, index) => (
              <Text key={index} style={styles.medicineItem}>
                - 약 ID: {id}
              </Text>
            ))
          ) : (
            <Text style={styles.noMedicineText}>복용 중인 약이 없습니다.</Text>
          )}
        </View>
      </ScrollView>

     {/* 🔹 모달 */}
<Modal
  isVisible={modalVisible}
  onBackdropPress={() => setModalVisible(false)}
  style={styles.modalWrapper}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalHeader} />

    <TouchableOpacity style={styles.timeBox}>
      <TextInput
        style={styles.modalTimeInput}
        value={editedTime}
        onChangeText={setEditedTime}
        placeholder="HH:MM"
        keyboardType="numeric"
      />
    </TouchableOpacity>

    <View style={styles.medicineList}>
      {/* 체크박스 그룹 */}
      <View style={styles.medicineSection}>
        <Checkbox.Android
          status={selectedMeds[21] ? "checked" : "unchecked"}
          onPress={() => toggleCheckbox(21)}
          color="#007AFF"
        />
        <Text style={styles.medicineTitleBold}>처방받은 약 (2025/02/25)</Text>
      </View>
      <Text style={styles.medicineItem}>삼진디아제팜정 2mg</Text>

      <View style={styles.medicineSection}>
        <Checkbox.Android
          status={selectedMeds[17] ? "checked" : "unchecked"}
          onPress={() => toggleCheckbox(17)}
          color="#007AFF"
        />
        <Text style={styles.medicineTitleBold}>
          처방전 이름(사용자가 설정한) (2025/02/26)
        </Text>
      </View>
      <Text style={styles.medicineItem}>삼진디아제팜정 2mg</Text>
      <Text style={styles.medicineItem}>아미세타정 325mg</Text>
    </View>

    <View style={styles.buttonGroup}>
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>수정하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>삭제하기</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#888", marginBottom: 8 },

  alarmContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap : 5,
    alignItems: "center",
    marginBottom: 16,
  },
  alarmCard: {
    backgroundColor: "#F2F8FF",
    padding: 16,
    borderRadius: 10,
    width: "22%",
    alignItems: "center",
    elevation: 3,
  },
  alarmTime: { fontSize: 16, fontWeight: "bold", color: "#007AFF" },
  alarmRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  alarmCount: { fontSize: 12, color: "#007AFF", marginLeft: 4 },

  modalWrapper: { justifyContent: "flex-end", margin: 0 },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalHeader: { width: 40, height: 4, backgroundColor: "#ddd", borderRadius: 2, marginBottom: 10 },
  timeBox: { backgroundColor: "#E0E0E0", padding: 10, borderRadius: 5 },
  modalTime: { fontSize: 18, fontWeight: "bold", textAlign: "center" },

  medicineSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  medicineTitleBold: { fontSize: 16, fontWeight: "bold", marginLeft: 5 },
  medicineItem: { fontSize: 14, marginLeft: 25 },

  modalTimeInput: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  

  buttonGroup: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  updateButton: { flex: 1, borderWidth: 1, borderColor: "#007AFF", padding: 10, borderRadius: 5, alignItems: "center", marginRight: 5 },
  updateButtonText: { color: "#007AFF", fontWeight: "bold" },
  deleteButton: { flex: 1, backgroundColor: "#007AFF", padding: 10, borderRadius: 5, alignItems: "center" },
  deleteButtonText: { color: "white", fontWeight: "bold" },
});

export default PrescriptionScreen;
