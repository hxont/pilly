import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const S3Uploader = () => {
  const [image, setImage] = useState(null);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          console.log('사용자가 취소함');
        } else if (response.errorCode) {
          Alert.alert('에러', response.errorMessage);
        } else {
          const asset = response.assets?.[0];
          if (asset) {
            setImage(asset);
          }
        }
      }
    );
  };

  const uploadImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('file', {
      uri: image.uri,
      name: image.fileName || `photo.jpg`,
      type: image.type || 'image/jpeg',
    });

    try {
      const res = await axios.post('http://YOUR_SERVER_URL/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('✅ 업로드 성공', `파일 URL: ${res.data.url}`);
    } catch (err) {
      console.error(err);
      Alert.alert('❌ 업로드 실패', '다시 시도해주세요');
    }
  };

  return (
    <View style={styles.container}>
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 200, height: 200, marginBottom: 10 }}
        />
      )}
      <Button title="사진 선택하기" onPress={pickImage} />
      <Button title="S3에 업로드" onPress={uploadImage} disabled={!image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', flex: 1, justifyContent: 'center' },
});

export default S3Uploader;
