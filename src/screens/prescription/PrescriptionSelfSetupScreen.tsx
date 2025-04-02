// PrescriptionScreen.tsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Checkbox } from "react-native-paper";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "http://52.78.204.121:8080/medicine/todayAlarm/1";
const UPDATE_URL = "http://52.78.204.121:8080/prescription/updateTime";
const DELETE_URL = "http://52.78.204.121:8080/prescription/delete-time";
const PRESCRIPTION_DETAIL_URL = "http://52.78.204.121:8080/prescription/one/";

const PrescriptionScreen = () => {
  const navigation = useNavigation();
  const [alarms, setAlarms] = useState([]);
  const [medicineIds, setMedicineIds] = useState([]);
  const [detailedMedicines, setDetailedMedicines] = useState([]);
  const [selectedAlarm, setSelectedAlarm] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedTime, setEditedTime] = useState("");
  const [selectedMeds, setSelectedMeds] = useState({});
  const [prescriptionDetails, setPrescriptionDetails] = useState({});

  const fetchAlarms = useCallback(async () => {
    try {
      const { data } = await axios.get(API_URL);
      setAlarms(data.alarm || []);
      setMedicineIds(data.allMedicineIds || []);
    } catch (error) {
      console.error("알람 정보 오류:", error);
    }
  }, []);

  const fetchMedicineDetails = useCallback(async () => {
    try {
      const responses = await Promise.all(
        medicineIds.map((id) =>
          axios.get(`http://52.78.204.121:8080/medicine/search/${id}`)
        )
      );
      const result = responses.map((res) => res.data.data);
      setDetailedMedicines(result);
    } catch (error) {
      console.error("약 정보 오류:", error);
    }
  }, [medicineIds]);

  useEffect(() => {
    fetchAlarms();
  }, [fetchAlarms]);

  useEffect(() => {
    if (medicineIds.length > 0) {
      fetchMedicineDetails();
    }
  }, [medicineIds, fetchMedicineDetails]);

  const openModal = async (alarm) => {
    setSelectedAlarm(alarm);
    setEditedTime(alarm.alarmTime);

    const selected = {};
    const details = {};

    try {
      await Promise.all(
        alarm.prescriptionIds?.map(async (id) => {
          selected[id] = true;
          const { data } = await axios.get(`${PRESCRIPTION_DETAIL_URL}${id}`);
          details[id] = data;
        })
      );
      setSelectedMeds(selected);
      setPrescriptionDetails(details);
      setModalVisible(true);
    } catch (e) {
      console.error("모달 데이터 로딩 실패:", e);
    }
  };

  const handleUpdate = async () => {
    const prescriptionIds = Object.entries(selectedMeds)
      .filter(([_, checked]) => checked)
      .map(([id]) => Number(id));

    if (prescriptionIds.length === 0) return;

    try {
      await Promise.all(
        prescriptionIds.map((id) =>
          axios.put(UPDATE_URL, {
            prescriptionId: id,
            oldTime: selectedAlarm?.alarmTime,
            newTime: editedTime,
          })
        )
      );
      setModalVisible(false);
      fetchAlarms();
    } catch (e) {
      console.error("수정 실패:", e);
    }
  };

  const handleDelete = async () => {
    const prescriptionIds = Object.entries(selectedMeds)
      .filter(([_, checked]) => checked)
      .map(([id]) => Number(id));

    if (prescriptionIds.length === 0) {
      Alert.alert("삭제할 항목을 선택하세요.");
      return;
    }

    try {
      await Promise.all(
        prescriptionIds.map((id) =>
          axios.delete(DELETE_URL, {
            data: {
              prescriptionId: id,
              oldTime: selectedAlarm?.alarmTime,
              newTime: "",
            },
          })
        )
      );
      setModalVisible(false);
      fetchAlarms();
    } catch (e) {
      console.error("삭제 실패:", e);
    }
  };

  const toggleCheckbox = (id) =>
    setSelectedMeds((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>약/알람 관리</Text>

        <Text style={styles.sectionTitle}>약 알람</Text>
        <View style={styles.alarmContainer}>
          {alarms.map((alarm) => (
            <TouchableOpacity
              key={alarm.alarmTime}
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
          {detailedMedicines.length > 0 ? (
            detailedMedicines.map((medicine) => (
              <TouchableOpacity
                key={medicine.medicineId}
                style={styles.medicineCard}
              >
                {medicine.medicineImage ? (
                  <Image
                    source={{ uri: medicine.medicineImage }}
                    style={styles.medicineImage}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>이미지 없음</Text>
                  </View>
                )}
                <View>
                  <Text style={styles.medicineName}>
                    {medicine.medicineName}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("MedicineDetail", {
                        medicineId: medicine.medicineId,
                      })
                    }
                  >
                    <Text style={styles.viewMore}>자세히 보기</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noMedicineText}>복용 중인 약이 없습니다.</Text>
          )}
        </View>
      </ScrollView>

      {/* 🔹 알람 모달 */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modalWrapper}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader} />
          <View style={styles.timeDisplayBox}>
            <TextInput
              style={styles.modalTimeInput}
              value={editedTime}
              onChangeText={setEditedTime}
              placeholder="HH:MM"
              keyboardType="numeric"
            />
          </View>

          <ScrollView style={{ maxHeight: 250, marginTop: 20 }}>
            {selectedAlarm?.prescriptionIds?.map((id) => {
              const detail = prescriptionDetails[id];
              if (!detail) return null;

              return (
                <View key={id} style={{ marginBottom: 10 }}>
                  <View style={styles.medicineSection}>
                    <Checkbox.Android
                      status={selectedMeds[id] ? "checked" : "unchecked"}
                      onPress={() => toggleCheckbox(id)}
                      color="#007AFF"
                    />
                    <Text style={styles.medicineTitleBold}>
                      {detail.prescriptionName} ({detail.startDate})
                    </Text>
                  </View>
                  {detail.medicines?.map((med, idx) => (
                    <Text key={idx} style={styles.medicineItem}>
                      {med.medicineName}
                    </Text>
                  ))}
                </View>
              );
            })}
          </ScrollView>

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
    gap: 5,
    marginBottom: 16,
  },
  alarmCard: {
    backgroundColor: "#F2F8FF",
    padding: 16,
    borderRadius: 10,
    width: "22%",
    alignItems: "center",
    elevation: 2,
  },
  alarmTime: { fontSize: 16, fontWeight: "bold", color: "#007AFF" },
  alarmRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  alarmCount: { fontSize: 12, color: "#007AFF", marginLeft: 4 },
  medicineList: { marginTop: 10 },
  medicineCard: {
    flexDirection: "row",
    backgroundColor: "#F2F8FF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 4,
    alignItems: "center",
  },
  medicineImage: {
    width: 80,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: "contain",
  },
  imagePlaceholder: {
    width: 80,
    height: 50,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginRight: 10,
  },
  imagePlaceholderText: { fontSize: 12, color: "#888" },
  medicineName: { fontWeight: "bold", fontSize: 14 },
  viewMore: { fontSize: 12, color: "#007AFF", textDecorationLine: "underline" },
  noMedicineText: { fontSize: 14, color: "#999" },
  modalWrapper: { justifyContent: "flex-end", margin: 0 },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    width: 40,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 10,
  },
  timeDisplayBox: {
    backgroundColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 4,
    alignSelf: "center",
  },
  modalTimeInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  medicineSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  medicineTitleBold: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  medicineItem: {
    fontSize: 14,
    marginLeft: 35,
    color: "#555",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    width: "100%",
  },
  updateButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#2563EB",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  updateButtonText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PrescriptionScreen;
