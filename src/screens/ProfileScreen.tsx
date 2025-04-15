import React, { useEffect, useState, useCallback, memo, useMemo } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

  const renderSurveyCard = useCallback(
    (entry, index) => (
      <SurveyCard key={`${entry.recordDate}-${index}`} entry={entry} />
    ),
    []
  );
  
  {surveyData.map(renderSurveyCard)}
  

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerText}>나의 건강 프로필</Text>
          <Image
            source={require('../assets/profileImage.png')}
            style={styles.profileIcon}
          />
        </View>
        <View style={styles.card}>
            <Text style={styles.dateTitle}>🤖 AI가 예측한 나의 건강 상태</Text>
            <Text style={styles.feedback}>
              {feedbackText || '피드백을 불러오는 중...'}
            </Text>
          </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {surveyData.map(renderSurveyCard)}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const SurveyCard = memo(({ entry }) => (
  <View style={styles.card}>
    <Text style={styles.dateTitle}>{entry.recordDate} 문진표</Text>
    <InfoRow label="당일 나의 컨디션" value={entry.mood} />
    <InfoRow label="당일 나의 피로도" progress={entry.fatigueLevel} />
    <InfoRow label="당일 나의 어지러움 증상" progress={entry.dizzinessLevel} />
    <InfoRow label="나의 수면시간" value={`${entry.sleepHours} 시간`} />
  </View>
));

const InfoRow = memo(({ label, value, progress }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    {progress !== undefined ? (
      <RoundedProgressBar progress={progress} />
    ) : (
      <Text style={styles.value}>{value}</Text>
    )}
  </View>
));

const RoundedProgressBar = memo(({ progress }) => {
  const percent = useMemo(() => Math.min(progress * 20, 100), [progress]);

  return (
    <View style={progressBarStyles.backgroundBar}>
      <View style={[progressBarStyles.foregroundBar, { width: `${percent}%` }]} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { paddingBottom: 30, paddingHorizontal: 15 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 10, marginBottom: 10,
    justifyContent: 'space-between',
  },
  profileIcon: { width: 40, height: 40, marginRight: 10 },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  card: {
    backgroundColor: '#F9FAFB', borderRadius: 16,
    padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
    borderWidth: 0.5, borderColor: '#d9d9d9',
  },
  dateTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#2F55D4', marginBottom: 10,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 12,
  },
  label: {
    width: 130, fontSize: 14, color: '#555', fontWeight: 'bold',
  },
  value: {
    fontSize: 14, color: '#333', fontWeight: 'bold',
  },
  feedback: {
    fontWeight: 'bold', color: '#666666',
  },
  
});

const progressBarStyles = StyleSheet.create({
  backgroundBar: {
    height: 10, backgroundColor: '#E0E0E0',
    borderRadius: 10, overflow: 'hidden',
    flex: 1, marginLeft: 10,
  },
  foregroundBar: {
    height: '100%', backgroundColor: '#2F55D4',
    borderRadius: 10,
  },
});

export default ProfileScreen;
