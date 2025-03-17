import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";

const SearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ 기존 약 목록 유지하면서 새 약 추가
 const handleSelectMedicine = (medicine: { name: string }) => {
  const existingMedicines = route.params?.medicineList || [];
  const updatedMedicines = [...existingMedicines, medicine];

  // ✅ navigation.setParams 대신, navigation.navigate 사용
  navigation.navigate("PrescriptionSetupScreen", { newMedicine: updatedMedicines });
};


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>약 검색하기</Text>
        </View>

        <View style={styles.searchBox}>
          <TextInput style={styles.searchBar} placeholder={" 약을 검색해보세요."} />
        </View>

        <View style={styles.medicineContainer}>
          {["알레그라정", "타이레놀"].map((medicine, index) => (
            <View key={index} style={styles.medicineBox}>
              <View style={styles.textBox}>
                <Text style={{ fontWeight: "bold" }}>{medicine}</Text>
                <Text style={{ marginTop: "1%", fontSize: 12 }}>비염증상 완화</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleSelectMedicine({ name: medicine })}
                style={styles.addButton}
              >
                <Icon name="plus-circle-outline" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchBox: {
    alignItems: "center",
    marginVertical: 10,
  },
  searchBar: {
    width: "90%",
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    padding: 10,
  },
  medicineContainer: {
    alignItems: "center",
  },
  medicineBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F8FF",
    borderRadius: 10,
    padding: 10,
    width: "90%",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  textBox: {
    flex: 1,
    marginLeft: 10,
  },
  addButton: {
    padding: 10,
  },
});

export default SearchScreen;
