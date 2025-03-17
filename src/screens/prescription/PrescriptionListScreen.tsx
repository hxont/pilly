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

const API_URL = "http://52.78.204.121:8080/medicine/todayAlarm/1";

const PrescriptionListScreen = () => {
  const navigation = useNavigation();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 API에서 데이터 가져오기
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(API_URL);
        console.log("API 응답 데이터:", response.data);

        if (response.data && response.data.alarm) {
          const formattedData = response.data.alarm.map((item, index) => ({
            id: index.toString(),
            alarmTime: item.alarmTime,
            medicineCount: item.medicineCount,
            prescriptionIds: item.prescriptionIds.join(", "), // prescriptionIds를 문자열로 변환
          }));

          setPrescriptions(formattedData);
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
  const handleDelete = (id: string) => {
    setPrescriptions(prescriptions.filter((item) => item.id !== id));
  };

  // 🔹 아이템 클릭 시 상세 페이지로 이동
  const handlePressItem = (item: any) => {
    navigation.navigate("PrescriptionDetail", { prescription: item });
  };

  // 🔹 리스트 렌더링
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handlePressItem(item)} style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="alarm" size={20} color="red" />
        <Text style={styles.cardTitle}> 알람 시간: {item.alarmTime} </Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Icon name="trash-can-outline" size={20} color="gray" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardText}>약 개수: {item.medicineCount}개</Text>
      <Text style={styles.cardText}>처방전 ID: {item.prescriptionIds}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>오늘의 복약 알람</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={prescriptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
};

// 📌 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  cardText: {
    fontSize: 12,
    color: "#333",
    marginTop: 5,
  },
});

export default PrescriptionListScreen;
