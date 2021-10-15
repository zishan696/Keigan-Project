import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "./HomePage";
import MapPage from "./MapPage";
import WebViewMqtt from "./WebViewMqtt";

const AppStack = createStackNavigator();
export default function NavigatorApp() {
  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={{ headerShown: true }}>
        <AppStack.Screen name="HomePage" component={HomePage} />
        <AppStack.Screen name="MapPage" component={MapPage} />
        <AppStack.Screen name="WebViewMqtt" component={WebViewMqtt} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
