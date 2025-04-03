import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import { View, Text, Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { requestNotificationPermission } from './utils/fcmUtils';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// ✅ 알림 채널 ID
const CHANNEL_ID = 'pilly-channel';

// ✅ 알림 중복 방지를 위한 변수
let lastNotificationId = "";

const App = () => {
  useEffect(() => {
    // ✅ Firebase 초기화를 지연하여 실행 (Activity가 완전히 붙은 후 실행)
    const timeoutId = setTimeout(async () => {
      try {
        console.log("🚀 Firebase 초기화 시작");

        // ✅ 푸시 알림 권한 요청
        await requestNotificationPermission();

        // ✅ FCM 토큰 가져오기 (콘솔에 출력)
        const token = await messaging().getToken();
        console.log('🔑 FCM 기기 토큰:', token);

        // ✅ iOS의 경우 토큰이 변경될 때 감지
        const unsubscribeOnTokenRefresh = messaging().onTokenRefresh(newToken => {
          console.log('🔄 FCM 토큰이 갱신됨:', newToken);
        });

        // ✅ Android 알림 채널 생성 (필수)
        if (Platform.OS === 'android') {
          PushNotification.createChannel(
            {
              channelId: CHANNEL_ID,
              channelName: 'Pilly Notifications',
              channelDescription: '푸시 알림을 받는 채널',
              importance: 4,
              vibrate: true,
            },
            (created) => console.log(`✅ 알림 채널 생성됨: ${created}`)
          );
        }

        // ✅ 포그라운드 상태에서 메시지 수신 처리
        const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
          console.log('📩 [포그라운드] 알림 수신:', remoteMessage);

          // ✅ 중복 알림 방지
          if (lastNotificationId === remoteMessage.messageId) {
            console.log("⚠️ 동일한 알림이 감지되어 무시됨");
            return;
          }
          lastNotificationId = remoteMessage.messageId || "";

          PushNotification.localNotification({
            channelId: CHANNEL_ID,
            title: remoteMessage.notification?.title || '알림',
            message: remoteMessage.notification?.body || '메시지 없음',
            playSound: true,
            soundName: 'default',
            importance: 4,
            vibrate: true,
          });
        });

        // ✅ 백그라운드 상태에서 푸시 알림 클릭 감지
        const unsubscribeOnOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
          console.log('🔔 [백그라운드] 알림 클릭:', remoteMessage);
          Alert.alert('백그라운드 알림 클릭!', JSON.stringify(remoteMessage, null, 2));
        });

        return () => {
          unsubscribeOnMessage();
          unsubscribeOnOpenedApp();
          unsubscribeOnTokenRefresh(); // 🔥 구독 해제 (메모리 누수 방지)
        };
      } catch (error) {
        console.error('❌ Firebase 초기화 중 오류 발생:', error);
      }
    }, 1000); // ✅ 1초 후 실행하여 Activity가 완전히 붙은 후 Firebase API 호출

    return () => clearTimeout(timeoutId); // ✅ 컴포넌트 언마운트 시 타이머 해제
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppNavigator />
      </GestureHandlerRootView>
    </Provider>
  );
};

// ✅ `setBackgroundMessageHandler`에서 `localNotification()` 실행하지 않음!
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 [백그라운드] 메시지 수신:', remoteMessage);
  // 백그라운드에서는 메시지만 처리하고 알림을 띄우지 않음.
});

export default App;
