import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://52.78.204.121:8080/medicine/todayAlarm/1";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [medicationStatus, setMedicationStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.data && response.data.alarm) {
          setAlarms(response.data.alarm);
        }
      } catch (error) {
        console.error("데이터를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlarms();
  }, []);

  
  const initialMedicationStatus = useMemo(() => {
    const status: { [key: string]: string } = {};
    alarms.forEach((alarm: any) => {
      status[alarm.alarmTime] = "복용 확인";
    });
    return status;
  }, [alarms]);

  useEffect(() => {
    setMedicationStatus(initialMedicationStatus);
  }, [initialMedicationStatus]);

  const toggleMedicationStatus = (time: string) => {
    setMedicationStatus((prevStatus) => ({
      ...prevStatus,
      [time]: prevStatus[time] === "복용 확인" ? "완료했어요" : "복용 확인",
    }));
  };

  const alarmList = useMemo(() => {
    return alarms.map((alarm, index) => (
      <View key={index} style={[styles.medicationRow, styles.shadow]}>
        <Text style={styles.timeText}>{alarm.alarmTime}</Text>
        <Text style={styles.pillCount}>약 {alarm.medicineCount}개</Text>
        <TouchableOpacity
          style={[
            styles.medicationButton,
            medicationStatus[alarm.alarmTime] === "완료했어요"
              ? styles.completedButton
              : styles.pendingButton,
          ]}
          onPress={() => toggleMedicationStatus(alarm.alarmTime)}
        >
          <Text
            style={[
              styles.buttonText,
              medicationStatus[alarm.alarmTime] === "완료했어요"
                ? styles.completedText
                : styles.pendingText,
            ]}
          >
            {medicationStatus[alarm.alarmTime]}
          </Text>
        </TouchableOpacity>
      </View>
    ));
  }, [alarms, medicationStatus]);

  return (
    <View style={styles.container}>
      <ScrollView>
        
        <View style={styles.header}>
          <Image source={require("../assets/logo.png")} style={styles.mainLogo} />
          <TouchableOpacity>
            <Image source={require("../assets/profile.png")} style={styles.profile} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>오늘 약 복용하셨나요?</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />
        ) : (
          alarmList
        )}

        <Text style={styles.sectionTitle}>쉽게 약 관리하기</Text>
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={[styles.card, styles.shadow]}
            onPress={() => navigation.navigate("CameraScreen")}
          >
            <Image source={require("../assets/camera-3.png")} style={styles.iconLarge} />
            <Text style={styles.cardTitle}>처방전/약봉투 촬영하기</Text>
            <Text style={styles.cardSubtitle}>사진 한 장으로 관리하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.shadow]}
            onPress={() => navigation.navigate("PrescriptionSelfSetupScreen")}
          >
            <Image source={require("../assets/pills.png")} style={styles.iconLarge} />
            <Text style={styles.cardTitle}>직접 약 등록하기</Text>
            <Text style={styles.cardSubtitle}>비타민/영양제 관리하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  mainLogo: {
    width: 60,
    height: 60,
  },
  profile: {
    width: 30,
    height: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
    marginTop: 16,
  },
  medicationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F2F8FF",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pillCount: {
    fontSize: 14,
    color: "#007AFF",
  },
  medicationButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  completedButton: {
    backgroundColor: "#007AFF",
  },
  pendingButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    backgroundColor: "white",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  completedText: {
    color: "#fff",
  },
  pendingText: {
    color: "#007AFF",
  },
  loadingIndicator: {
    marginTop: 20,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  card: {
    width: "48%",
    backgroundColor: "#F2F8FF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 14,
  },
  iconLarge: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default HomeScreen;
