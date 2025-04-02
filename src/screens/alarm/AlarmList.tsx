import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
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

  useEffect(() => {
    fetchAlarms();
  }, []);

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      try {
        const responses = await Promise.all(
          medicineIds.map((id) =>
            axios.get(`http://52.78.204.121:8080/medicine/search/${id}`)
          )
        );
        const detailed = responses.map((res) => res.data.data);
        setDetailedMedicines(detailed);
      } catch (error) {
        console.error("약 정보 조회 실패:", error);
      }
    };
    if (medicineIds.length > 0) {
      fetchMedicineDetails();
    }
  }, [medicineIds]);

  const openModal = async (alarm) => {
    setSelectedAlarm(alarm);
    setEditedTime(alarm.alarmTime);

    const selected = {};
    const details = {};

    if (Array.isArray(alarm.prescriptionIds)) {
      await Promise.all(
        alarm.prescriptionIds.map(async (id) => {
          selected[id] = true;
          try {
            const res = await axios.get(`${PRESCRIPTION_DETAIL_URL}${id}`);
            details[id] = res.data;
          } catch (e) {
            console.error("처방전 불러오기 실패:", e);
          }
        })
      );
    }

    setSelectedMeds(selected);
    setPrescriptionDetails(details);
    setModalVisible(true);
  };

  const toggleCheckbox = (id) => {
    setSelectedMeds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleUpdate = async () => {
    const prescriptionIds = Object.keys(selectedMeds).filter(
      (id) => selectedMeds[id]
    );

    try {
      await Promise.all(
        prescriptionIds.map((id) =>
          axios.put(UPDATE_URL, {
            prescriptionId: Number(id),
            oldTime: selectedAlarm?.alarmTime,
            newTime: editedTime,
          })
        )
      );
      setModalVisible(false);
      await fetchAlarms(); // 🌀 최신 알람 다시 불러오기
      setSelectedAlarm(null);
      setSelectedMeds({});
      setPrescriptionDetails({});
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  const handleDelete = async () => {
    const prescriptionIds = Object.keys(selectedMeds).filter((id) => selectedMeds[id]);
  
    try {
      await Promise.all(
        prescriptionIds.map((id) =>
          axios.delete(DELETE_URL, {
            data: {
              prescriptionId: Number(id),
              oldTime: selectedAlarm?.alarmTime,
              newTime: ""
            }
          })
        )
      );
      setModalVisible(false);
      await fetchAlarms(); // 삭제 후 최신 알람 다시 불러오기
      setSelectedAlarm(null);
      setSelectedMeds({});
      setPrescriptionDetails({});
    } catch (error) {
      console.error("삭제 실패:", error);
    }
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
          {detailedMedicines.length > 0 ? (
            detailedMedicines.map((medicine, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: "#F2F8FF",
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 10,
                  elevation: 4,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {medicine.medicineImage ? (
                  <Image
                    source={{ uri: medicine.medicineImage }}
                    style={{
                      width: 80,
                      height: 50,
                      borderRadius: 8,
                      marginRight: 10,
                      resizeMode: "contain",
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 80,
                      height: 50,
                      backgroundColor: "#eee",
                      borderRadius: 8,
                      marginRight: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#888" }}>
                      이미지 준비중
                    </Text>
                  </View>
                )}

                <View>
                  <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                    {medicine.medicineName}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("MedicineDetail", {
                        medicineId: medicine.medicineId,
                      })
                    }
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#007AFF",
                        textDecorationLine: "underline",
                      }}
                    >
                      자세히 보기
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noMedicineText}>복용 중인 약이 없습니다.</Text>
          )}
        </View>
      </ScrollView>

      {/* 알람 모달 */}
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
    justifyContent: "flex-start",
    gap: 5,
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
  medicineList: { marginTop: 10 },

  medicineItem: {
    fontSize: 14,
    marginLeft: 35, // ✅ 체크박스 오른쪽 정렬
    textAlign: 'left',
    color: '#555',
  },
  noMedicineText: { fontSize: 14, color: "#999" },
  medicineSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 0,
    width: '100%',
  },
  medicineTitleBold: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
    textAlign: 'left',
    flexShrink: 1, // ✅ 너무 길면 줄바꿈 되도록
  },
  modalWrapper: { justifyContent: "flex-end", margin: 0 },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "flex-start", // ✅ 중앙이 아닌 왼쪽 정렬
  },

  modalHeader: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
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
