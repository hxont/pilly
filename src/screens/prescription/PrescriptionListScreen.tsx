import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://52.78.204.121:8080/prescription/all/1";
const PRESCRIPTION_DETAIL_URL = "http://52.78.204.121:8080/prescription/one/";
const DELETE_PRESCRIPTION_URL = "http://52.78.204.121:8080/prescription/delete/1"; // 뒤에 /{id}

const PrescriptionListScreen = () => {
  const navigation = useNavigation();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrescriptions = useCallback(async () => {
    try {
      const { data } = await axios.get(API_URL);
      setPrescriptions(data || []);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const handlePress = async (id: number) => {
    try {
      const { data } = await axios.get(`${PRESCRIPTION_DETAIL_URL}${id}`);
      navigation.navigate("PrescriptionDetail", { prescription: data });
    } catch (error) {
      console.error("상세 조회 실패:", error);
    }
  };

  const handleDelete = async (prescriptionId: number) => {
    Alert.alert("삭제 확인", "정말 이 처방전을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            const { data } = await axios.delete(`${DELETE_PRESCRIPTION_URL}/${prescriptionId}`);
            if (data.success) {
              Alert.alert("삭제 완료", data.message);
              setPrescriptions((prev) =>
                prev.filter((item) => item.prescriptionId !== prescriptionId)
              );
            }
          } catch (error) {
            console.error("삭제 실패:", error);
            Alert.alert("오류", "처방전 삭제 중 문제가 발생했습니다.");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.prescriptionId)}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Icon name="medical-bag" size={20} color="red" />
          <Text style={styles.cardTitle}>
            {item.prescriptionName}{" "}
            <Text
              style={
                item.status === "복약중"
                  ? styles.statusActive
                  : styles.statusComplete
              }
            >
              ({item.status})
            </Text>
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.prescriptionId)}>
          <Icon name="trash-can-outline" size={22} color="#888" />
        </TouchableOpacity>
      </View>
      <Text style={styles.dateText}>
        {item.startDate} ~ {item.endDate}
      </Text>
      <Text style={styles.medicineText}>{item.medicineNames.join(", ")}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>등록한 처방전/약봉투 확인하기</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={prescriptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.prescriptionId.toString()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
  },
  backButton: { position: "absolute", left: 0, padding: 10 },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  titleContainer: { flexDirection: "row", alignItems: "center" },
  cardTitle: { fontSize: 14, fontWeight: "bold", marginLeft: 6 },
  statusActive: { color: "#007AFF", fontWeight: "bold" },
  statusComplete: { color: "#888", fontWeight: "bold" },
  dateText: { fontSize: 13, color: "#888", marginBottom: 4 },
  medicineText: { fontSize: 13, color: "#333" },
});

export default PrescriptionListScreen;
