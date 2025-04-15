import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Slider from '@react-native-community/slider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SIDE_EFFECT_OPTIONS = ["두통", "복통", "두드러기", "구토", "가려움증"];

const MedicineDetailScreen = ({ route, navigation }: any) => {
  const { medicineId } = route.params || {};
  const [medicineData, setMedicineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('basic');
  const [effectLevel, setEffectLevel] = useState(1);
  const [sideEffects, setSideEffects] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!medicineId) return;
    console.log(`약 아이디 : ${medicineId}`);
  
    const fetchDetails = async () => {
      try {
        const { data } = await axios.get(`http://52.78.204.121:8080/medicine/search/${medicineId}`);
        if (data.success && data.data) {
          setMedicineData(data.data);
  
          const history = data.data.sideEffectHistory;
          if (Array.isArray(history) && history.length > 0) {
            const latest = history[history.length - 1];
            setEffectLevel(latest.effectLevel || 1);
            setSideEffects(latest.sideEffects || []);
            setComment(latest.comments || '');
          }
        }
      } catch (e) {
        console.error('❌ 약 정보 실패:', e);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDetails();
  }, [medicineId]);

  const toggleSideEffect = (effect: string) => {
    setSideEffects(prev =>
      prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect]
    );
  };

  const submitEffect = async () => {
    try {
      const payload = {
        userId: 1,
        medicineId,
        recordDate: new Date().toISOString().slice(0, 10),
        effectLevel,
        sideEffectOccurred: sideEffects.length > 0,
        sideEffects,
        comments: comment,
      };

      await axios.post('http://52.78.204.121:8080/medicineEffectiveness', payload);
      alert('부작용이 저장되었습니다.');
    } catch (err) {
      alert('저장 실패!');
    }
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text>약 정보를 불러오는 중...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!medicineData) return <Text>약 정보 없음</Text>;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} />
            </TouchableOpacity>
            <Text style={styles.title}>약 정보 자세히보기</Text>
          </View>

          {/* image */}
          <View style={styles.imageBox}>
            {medicineData?.medicineImage ? (
              <Image source={{ uri: medicineData.medicineImage }} style={styles.medicineImage} />
            ) : (
              <Text>이미지 준비중</Text>
            )}
          </View>

          {/* tab switch */}
          <View style={styles.selectBox}>
            <TouchableOpacity onPress={() => setSelectedTab('basic')}>
              <Text style={[styles.selectText, selectedTab === 'basic' && styles.selectedText]}>기본 정보</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedTab('sideEffect')}>
              <Text style={[styles.selectText, selectedTab === 'sideEffect' && styles.selectedText]}>부작용</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentBox}>
            {selectedTab === 'basic' ? (
              <>
                <Text style={styles.contentTitle}>약품명</Text>
                <Text>{medicineData.medicineName}</Text>

                <Text style={styles.contentTitle}>효능효과</Text>
                <Text>{medicineData.effect}</Text>

                <Text style={styles.contentTitle}>복용법</Text>
                <Text>{medicineData.dosage}</Text>
              </>
            ) : (
              <>
                <Text style={styles.contentTitle}>주의사항</Text>
                <Text style={styles.contentText}>{medicineData.caution || '정보 없음'}</Text>

                <Text style={[styles.contentTitle, { marginTop: 20 }]}>복용 효과 정도 (1~5)</Text>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={1}
                  maximumValue={5}
                  step={1}
                  value={effectLevel}
                  onValueChange={setEffectLevel}
                  minimumTrackTintColor="#007AFF"
                  maximumTrackTintColor="#d3d3d3"
                />
                <Text>현재 선택: {effectLevel} 점</Text>

                <Text style={[styles.contentTitle, { marginTop: 20 }]}>부작용 선택</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {SIDE_EFFECT_OPTIONS.map(effect => (
                    <TouchableOpacity
                      key={effect}
                      style={[
                        styles.effectTag,
                        sideEffects.includes(effect) && styles.effectTagSelected,
                      ]}
                      onPress={() => toggleSideEffect(effect)}
                    >
                      <Text
                        style={[
                          styles.effectText,
                          sideEffects.includes(effect) && styles.effectTextSelected,
                        ]}
                      >
                        {effect}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.contentTitle, { marginTop: 20 }]}>기타 메모</Text>
                <TextInput
                  placeholder= "기타 부작용이나 느낌을 작성해주세요."
                  value={comment}
                  onChangeText={setComment}
                  style={styles.textInput}
                  multiline
                />

                <TouchableOpacity style={styles.saveButton} onPress={submitEffect}>
                  <Text style={styles.saveButtonText}>부작용 등록</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  imageBox: { alignItems: 'center', padding: 16 },
  medicineImage: { width: 200, height: 120 },

  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  selectText: { fontSize: 16, color: '#999' },
  selectedText: { color: '#007AFF', fontWeight: 'bold' },

  contentBox: { padding: 20 },

  contentTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  contentText: { fontSize: 13, color: '#555', marginTop: 5 },

  effectTag: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 2,
    backgroundColor: '#f8f8f8',
  },
  effectTagSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  effectText: { fontSize: 14, color: '#333' },
  effectTextSelected: { color: '#fff', fontWeight: 'bold' },

  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    marginTop: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
  },

  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


export default MedicineDetailScreen;
