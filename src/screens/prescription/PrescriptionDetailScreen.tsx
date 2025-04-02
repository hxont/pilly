import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";

const PrescriptionDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { prescription } = route.params;
  const [memo, setMemo] = useState("");

  return (
    <ScrollView style={styles.container}>
      {/* 🔹 네비게이션 바 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>처방전/약봉투 상세보기</Text>
      </View>

      {/* 🔹 날짜 */}
      <Text style={styles.date}>{prescription.startDate}</Text>

      {/* 🔹 처방전 이미지 */}
      {prescription.file && (
        <Image source={{ uri: prescription.file }} style={styles.image} />
      )}

      {/* 🔹 약 정보 리스트 (알림관리 스타일) */}
      <Text style={styles.sectionTitle}>처방받은 약</Text>
      {prescription.medicines?.map((medicine, index) => (
        <View key={index} style={styles.medicineCard}>
          {medicine.medicineImageUrl ? (
            <Image source={{ uri: medicine.medicineImageUrl }} style={styles.medicineImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>이미지 없음</Text>
            </View>
          )}

          <View style={styles.medicineInfo}>
            <Text style={styles.medicineName}>{medicine.medicineName}</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MedicineDetail", {
                  medicineId: medicine.medicineId,
                })
              }
            >
              <Text style={styles.linkText}>자세히 보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* 🔹 메모 입력 */}
      <Text style={styles.sectionTitle}>메모</Text>
      <TextInput
        style={styles.memoInput}
        placeholder="메모를 입력하세요"
        value={memo}
        onChangeText={setMemo}
        multiline
      />
      <TouchableOpacity style={styles.memoButton}>
        <Text style={styles.memoButtonText}>메모 저장하기</Text>
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
  date: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  medicineCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F8FF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2, // Android 그림자 효과
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
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  placeholderText: {
    fontSize: 12,
    color: "#888",
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  linkText: {
    fontSize: 12,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  memoInput: {
    backgroundColor: "#F8F8F8",
    padding: 10,
    borderRadius: 10,
    height: 100,
    textAlignVertical: "top",
  },
  memoButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  memoButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PrescriptionDetailScreen;
