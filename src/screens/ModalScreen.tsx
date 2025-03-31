import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

function ModalScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [sideEffectOption, setSideEffectOption] = useState(null);
  const [prescriptionOption, setPrescriptionOption] = useState(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSelectOption = option => {
    setSelectedOption(option);
  };

  const handleSelectSideEffect = option => {
    setSideEffectOption(option);
  };

  const handleSelectPrescription = option => {
    setPrescriptionOption(option);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <TouchableOpacity onPress={toggleModal}>
            <Text>모달 열기</Text>
          </TouchableOpacity>
        </View>

        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          style={styles.modal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>나의 건강 상태 체크하기</Text>

            {/* 컨디션 선택 */}
            <Text style={styles.detailText}>
              오늘 하루 컨디션은 어떠신가요?
            </Text>
            <View style={styles.optionsContainer}>
              {['좋음', '보통', '나쁨'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    selectedOption === option && styles.selectedOption,
                  ]}
                  onPress={() => handleSelectOption(option)}>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 부작용 선택 */}
            <Text style={styles.detailText}>부작용이 있으셨나요?</Text>
            <View style={styles.optionsContainer}>
              {['예', '아니요'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    sideEffectOption === option && styles.selectedOption,
                  ]}
                  onPress={() => handleSelectSideEffect(option)}>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 처방전 선택 */}
            <Text style={styles.detailText}>
              부작용이 있었다면, 자세하게 서술해주세요.
            </Text>
            <Text style={styles.explainText}>
              건강한 복약 습관을 만들기 위해 사용돼요!
            </Text>
            <View style={styles.optionContainer}>
              {['처방전 1', '처방전 2', '처방전 3'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    prescriptionOption === option && styles.selectedOption,
                  ]}
                  onPress={() => handleSelectPrescription(option)}>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputBox}>
              <TextInput
                placeholder={'어떤 부작용이 나타났는지 작성해주세요.'}
                style={styles.input}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleModal}>
                <Text style={styles.closeText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkButton}>
                <Text style={styles.checkText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    width: 250,
    height: 80,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    height: '100%',
    width: '100%',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  closeText: {
    color: '#0169CD',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#0169CD',
  },
  checkButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0169CD',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#0169CD',
  },
  detailText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
  },
  optionsContainer: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  optionContainer: {
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
  explainText: {
    color: '#C5C5C5',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 15,
    flexDirection: 'row',
    gap: 20,
  },
});

export default ModalScreen;