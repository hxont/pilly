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
        if (response.data) {
          setPrescriptions(response.data);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handlePress = async (id: number) => {
    try {
      const response = await axios.get(`http://52.78.204.121:8080/prescription/one/${id}`);
      const detail = response.data;
      navigation.navigate("PrescriptionDetail", { prescription: detail });
    } catch (error) {
      console.error("상세 조회 실패:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.prescriptionId)}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Icon name="medical-bag" size={20} color="red" />
          <Text style={styles.cardTitle}>
            {item.prescriptionName}{" "}
            <Text style={item.status === "복약중" ? styles.statusActive : styles.statusComplete}>
              ({item.status})
            </Text>
          </Text>
        </View>
        <TouchableOpacity onPress={() => console.log("삭제기능 구현 필요")}>
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
