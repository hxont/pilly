import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://52.78.204.121:8080/prescription/all/1";

const PrescriptionListScreen = () => {
  const navigation = useNavigation();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(API_URL);
        console.log("API 응답 데이터:", response.data);

        if (response.data) {
          setPrescriptions(response.data);
        }
      } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  // 🔹 삭제 기능
  const handleDelete = (id: number) => {
    setPrescriptions(prescriptions.filter((item) => item.prescriptionId !== id));
  };

  // 🔹 리스트 렌더링
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      {/* 헤더 (처방전 아이콘 + 상태 + 삭제 버튼) */}
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Icon name="medical-bag" size={20} color="red" />
          <Text style={styles.cardTitle}>
            처방전 <Text style={item.status === "복약중" ? styles.statusActive : styles.statusComplete}>{item.status}</Text>
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.prescriptionId)}>
          <Icon name="trash-can-outline" size={22} color="#888" />
        </TouchableOpacity>
      </View>

      {/* 기간 표시 */}
      <Text style={styles.dateText}>{item.startDate} ~ {item.endDate}</Text>

      {/* 약 목록 */}
      <Text style={styles.medicineText}>{item.medicineNames.join(", ")}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔹 상단 바 (뒤로가기 버튼 + 타이틀) */}
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

// 📌 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },
  statusActive: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  statusComplete: {
    color: "#888",
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 13,
    color: "#888",
    marginBottom: 4,
  },
  medicineText: {
    fontSize: 13,
    color: "#333",
  },
});

export default PrescriptionListScreen;
