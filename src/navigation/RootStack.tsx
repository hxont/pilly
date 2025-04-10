import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import BottomTabNavigator from "./BottomTabNavigator";
import PrescriptionList from "../screens/prescription/PrescriptionListScreen";
import PrescriptionDetail from "../screens/prescription/PrescriptionDetailScreen";
import PrescriptionSetupScreen from "../screens/prescription/PrescriptionSetupScreen";
import PrescriptionSelfSetupScreen from "../screens/prescription/PrescriptionSelfSetupScreen";
import CameraScreen from "../screens/alarm/CameraScreen";
import MedicineDetail from "../screens/MedicineDetailScreen";
import LoginScreen from "../screens/LoginScreen";
import PrescriptionSearchScreen from "../screens/search/PrescriptionSearchScreen"
import ProfileScreen from "../screens/ProfileScreen"

export type RootStackParamList = {
  PrescriptionSetupScreen: undefined;
  PrescriptionSelfSetupScreen: undefined;
  PrescriptionList: undefined;
  PrescriptionDetail: undefined;
  CameraScreen: undefined;
  MedicineDetail: undefined;
  PrescriptionSearchScreen : undefined;
  ProfileScreen : undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AfterLogin = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="PrescriptionList" component={PrescriptionList} />
      <Stack.Screen name="MedicineDetail" component={MedicineDetail} />
      <Stack.Screen name="PrescriptionDetail" component={PrescriptionDetail} />
      <Stack.Screen name="PrescriptionSetupScreen" component={PrescriptionSetupScreen} />
      <Stack.Screen name="PrescriptionSelfSetupScreen" component={PrescriptionSelfSetupScreen} />
      <Stack.Screen name="PrescriptionSearchScreen" component={PrescriptionSearchScreen} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
    </Stack.Navigator>
  );
};

const RootStack: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ 로그인 상태 관리

  return (
    <NavigationContainer>
      {isLoggedIn ? <AfterLogin /> : <LoginScreen setIsLoggedIn={setIsLoggedIn} />}
    </NavigationContainer>
  );
};

export default RootStack;
