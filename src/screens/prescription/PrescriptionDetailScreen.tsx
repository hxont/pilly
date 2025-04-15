import React, { useState, useCallback, memo, useMemo } from "react";
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

  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>처방전/약봉투 상세보기</Text>
      </View>

      <Text style={styles.date}>{prescription.startDate}</Text>

      {prescription.file && (
        <Image source={{ uri: prescription.file }} style={styles.image} />
      )}

      <Text style={styles.sectionTitle}>처방받은 약</Text>
      {prescription.medicines?.map((medicine, index) => (
        <MemoizedMedicineCard key={index} medicine={medicine} navigation={navigation} />
      ))}
    </ScrollView>
  );
};

const MedicineCard = ({ medicine, navigation }) => {
  const hasSideEffect = useMemo(() => {
    return (
      medicine?.sideEffectHistory &&
      Array.isArray(medicine.sideEffectHistory) &&
      medicine.sideEffectHistory.length > 0
    );
  }, [medicine.sideEffectHistory]);

  const handleNavigate = useCallback(() => {
    navigation.navigate("MedicineDetail", {
      medicineId: medicine.medicineId,
    });
  }, [navigation, medicine.medicineId]);

  return (
    <View
      style={[
        styles.medicineCard,
        hasSideEffect ? styles.sideEffectCard : styles.normalCard,
      ]}
    >
      {medicine.medicineImageUrl ? (
        <Image source={{ uri: medicine.medicineImageUrl }} style={styles.medicineImage} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>이미지 없음</Text>
        </View>
      )}

      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{medicine.medicineName}</Text>
        <TouchableOpacity onPress={handleNavigate}>
          <Text style={styles.linkText}>자세히 보기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MemoizedMedicineCard = memo(MedicineCard);

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
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  normalCard: {
    backgroundColor: "#F2F8FF",
  },
  sideEffectCard: {
    backgroundColor: "#FFF2F2", // ✅ 부작용 있을 때 색상 적용
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
