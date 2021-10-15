import "react-native-gesture-handler";
import React, { Component } from "react";
import {
  Image,
  TouchableHighlight,
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  Text,
  SafeAreaView,
  Button,
} from "react-native";
import styles from "./styles/Style";
import MapPage from "./screens/MapPage";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomePage from "./screens/HomePage";
import WebViewMqtt from "./screens/WebViewMqtt";
import WebViewRemote from "./screens/WebViewRemote";
import JoyStick from "./screens/JoyStick";

const Drawer = createDrawerNavigator();
function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home Page" component={HomePage} />
      <Drawer.Screen name="Map Remote" component={MapPage} />
      <Drawer.Screen name="Joy Stick" component={JoyStick} />
      <Drawer.Screen name="Web view Mqtt" component={WebViewMqtt} />
      <Drawer.Screen name="Web view Remote" component={WebViewRemote} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <>
      <SafeAreaView style={styles.topSafeArea} />
      <SafeAreaView style={styles.bottomSafeArea}>
        <StatusBar barStyle="light-content" />
        <NavigationContainer>
          <MyDrawer />
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
}
