// ModalScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import Slider from '@react-native-community/slider';

const ModalScreen = ({
  isVisible,
  onClose,
  selectedOption,
  setSelectedOption,
  fatigueLevel,
  setFatigueLevel,
  dizzinessLevel,
  setDizzinessLevel,
  sleepHours,
  setSleepHours,
}) => {
  const options = ['좋음', '보통', '나쁨'];

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalText}>나의 건강 상태 체크하기</Text>

        <Text style={styles.detailText}>오늘 하루 컨디션은 어떠셨나요?</Text>
        <View style={styles.optionsContainer}>
          {options.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                selectedOption === option && styles.selectedOption,
              ]}
              onPress={() => setSelectedOption(option)}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.detailText}>오늘 하루 피로도는 어떠셨나요?</Text>
        <Slider
          style={{ width: 250, height: 40 }}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={fatigueLevel}
          onValueChange={setFatigueLevel}
          minimumTrackTintColor="#0169CD"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#0169CD"
        />
        <Text style={styles.explain}>현재 피로도: {fatigueLevel}</Text>

        <Text style={styles.detailText}>오늘 어지러움 증상이 있었나요?</Text>
        <Slider
          style={{ width: 250, height: 40 }}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={dizzinessLevel}
          onValueChange={setDizzinessLevel}
          minimumTrackTintColor="#0169CD"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#0169CD"
        />
        <Text style={styles.explain}>현재 어지러움: {dizzinessLevel}</Text>

        <Text style={styles.detailText}>오늘 몇 시간 주무셨나요?</Text>
        <TextInput
          style={styles.input}
          placeholder="예) 7.5 = 7시간 30분"
          value={sleepHours}
          onChangeText={setSleepHours}
          keyboardType="numeric"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkButton} onPress={onClose}>
            <Text style={styles.checkText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: { justifyContent: 'center', alignItems: 'center', margin: 0 },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#0169CD',
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666666',
  },
  optionsContainer: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  optionButton: {
    padding: 8,
    margin: 8,
    backgroundColor: '#C5C5C5',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#0169CD',
  },
  optionText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  explain: {
    color: '#666',
    marginBottom: 10,
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 15,
    flexDirection: 'row',
    gap: 20,
  },
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#0169CD',
  },
  closeText: {
    color: '#0169CD',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#0169CD',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#0169CD',
  },
  checkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ModalScreen;
