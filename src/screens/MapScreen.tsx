import React, { useEffect, useState } from "react";
import { View, Image, ActivityIndicator, Text, StyleSheet } from "react-native";

function MapScreen() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ API에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://52.78.204.121:8080/prescription/one/61");
        const data = await response.json();
        console.log("API 응답 데이터:", data);

        // ✅ API 응답에서 "file" 필드를 찾아 이미지 URL 설정
        if (data && data.file) {
          setImageUrl(data.file);
        } else {
          console.warn("이미지 URL이 없습니다.");
        }
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        // ✅ 데이터 로딩 중 (로딩 인디케이터 표시)
        <ActivityIndicator size="large" color="#007AFF" />
      ) : imageUrl ? (
        // ✅ 이미지가 있는 경우 표시
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        // ✅ 이미지가 없을 경우 텍스트 표시
        <Text style={styles.errorText}>이미지를 불러올 수 없습니다.</Text>
      )}
    </View>
  );
}

// 📌 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
  },
  image: {
    width: 300, // ✅ 원하는 크기로 조정
    height: 300,
    resizeMode: "contain",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default MapScreen;
