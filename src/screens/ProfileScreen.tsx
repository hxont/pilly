import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ProfileScreen = ({ navigation }) => {
  const [surveyData, setSurveyData] = useState([]);
  const [feedbackText, setFeedbackText] = useState('');

  const fetchSurveyData = useCallback(async () => {
    try {
      const response = await fetch('http://52.78.204.121:8080/healthData/user/1');
      const data = await response.json();
      setSurveyData(data);
    } catch (err) {
      console.error('문진표 데이터 로드 실패:', err);
    }
  }, []);

  const fetchFeedback = useCallback(async () => {
    try {
      const response = await fetch('http://52.78.204.121:8080/healthData/predict/1');
      const json = await response.json();
      setFeedbackText(json.feedback);
    } catch (error) {
      console.error('피드백 불러오기 실패:', error);
    }
  }, []);

  useEffect(() => {
    fetchSurveyData();
    fetchFeedback();
  }, [fetchSurveyData, fetchFeedback]);

  const recentDates = surveyData.slice(-7).map(item => item.recordDate?.slice(5));
  const fatigueLevels = surveyData.slice(-7).map(item => item.fatigueLevel);
  const sleepHours = surveyData.slice(-7).map(item => item.sleepHours);
  const dizzinessLevels = surveyData.slice(-7).map(item => item.dizzinessLevel);

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(47, 85, 212, ${opacity})`,
    labelColor: () => '#333',
    propsForDots: {
      r: '4',
      strokeWidth: '1',
      stroke: '#2F55D4',
    },
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name="arrow-left" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerText}>나의 건강 프로필</Text>
            <Image
              source={require('../assets/profileImage.png')}
              style={styles.profileIcon}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.dateTitle}>🤖 제가 예측하기로는 !!</Text>
            <Text style={styles.feedback}>
              {feedbackText || '피드백을 불러오는 중...'}
            </Text>
          </View>

          {/* 피로도 변화 */}
          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>피로도 변화</Text>
            {fatigueLevels.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={{
                    labels: recentDates,
                    datasets: [{ data: fatigueLevels }],
                  }}
                  width={screenWidth * 1.6}
                  height={200}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </ScrollView>
            ) : (
              <Text style={styles.loadingText}>데이터 없음</Text>
            )}
          </View>

          {/* 수면 기록 */}
          <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>수면 기록 (평균 6시간)</Text>
            {sleepHours.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={{
                    labels: recentDates,
                    datasets: [{ data: sleepHours }],
                  }}
                  width={screenWidth * 1.6}
                  height={200}
                  yAxisSuffix="h"
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                  fromZero
                  style={styles.chart}
                />
              </ScrollView>
            ) : (
              <Text style={styles.loadingText}>데이터 없음</Text>
            )}
          </View>

          {/* 어지러움 증상 */}
          {/* <View style={styles.chartBox}>
            <Text style={styles.chartTitle}>어지러움 증상 변화</Text>
            {dizzinessLevels.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={{
                    labels: recentDates,
                    datasets: [{ data: dizzinessLevels }],
                  }}
                  width={screenWidth * 1.6}
                  height={200}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </ScrollView>
            ) : (
              <Text style={styles.loadingText}>데이터 없음</Text>
            )}
          </View> */}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { paddingBottom: 30, paddingHorizontal: 15 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  profileIcon: { width: 40, height: 40, marginRight: 10 },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d9d9d9',
    marginHorizontal: 0,
  },
  dateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2F55D4',
    marginBottom: 10,
  },
  feedback: {
    fontSize:12,
    fontWeight: 'bold',
    color: '#666',
  },
  chartBox: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 12,
  },
  loadingText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 13,
  },
});

export default ProfileScreen;
