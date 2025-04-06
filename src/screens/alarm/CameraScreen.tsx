import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import usePermissions from '../../hooks/userCameraPermision';

const CameraScreen = () => {
  const navigation = useNavigation();
  const hasPermission = usePermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [permissionChecked, setPermissionChecked] = useState(false);

  const url = 'http://10.0.2.2:3000/upload';
  useEffect(() => {
    if (!permissionChecked && hasPermission) {
      setPermissionChecked(true);
      takePhoto();
    }
  }, [hasPermission]);

  const takePhoto = async () => {
    launchCamera(
      { mediaType: 'photo', quality: 0.8, includeBase64: false },
      async response => {
        if (response.didCancel) {
          navigation.goBack();
        } else if (response.errorMessage) {
          Alert.alert('에러', '사진을 촬영할 수 없습니다.');
          navigation.goBack();
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          const uri = asset.uri;

          if (!uri) {
            Alert.alert('에러', '사진 정보를 불러오지 못했습니다.');
            return;
          }

          setPhoto(uri);
          setLoading(true);

          try {
            // 📤 FormData 구성
            const formData = new FormData();
            formData.append('file', {
              uri: uri,
              name: asset.fileName || 'photo.jpg',
              type: asset.type || 'image/jpeg',
            });

            // 🔥 서버에 업로드 요청
            const { data } = await axios.post(
              url,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            );

            console.log('✅ 업로드 완료:', data);

            // 📦 mock: 업로드 이후 이미지 처리 결과 받았다고 가정
            const result = {
              success: true,
              medicines: ['타이레놀정', '세레콕시브캡슐', '종합감기약'],
            };

            if (result.success) {
              navigation.replace('PrescriptionSetupScreen', {
                medicines: result.medicines,
              });
            } else {
              Alert.alert('인식 실패', '약을 인식하지 못했습니다.');
              navigation.goBack();
            }
          } catch (error) {
            console.error('❌ 업로드 실패:', error);
            Alert.alert('오류', '이미지 업로드에 실패했습니다.');
            navigation.goBack();
          } finally {
            setLoading(false);
          }
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0169CD" />
          <Text style={styles.loadingText}>처방전 인식 중...</Text>
        </View>
      ) : (
        photo && <Image source={{ uri: photo }} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: 200, height: 200, marginTop: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
});

export default CameraScreen;
