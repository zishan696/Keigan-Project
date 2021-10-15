import React, { Component } from "react";
import Svg, { Line } from "react-native-svg";
import {
  TouchableOpacity,
  View,
  Text,
  Button,
  ImageBackground,
} from "react-native";
import styles from "../styles/Style";
import "../shim.js";
import { decode as atob, encode as btoa } from "base-64";
import { ScrollView } from "react-native-gesture-handler";

import { SafeAreaView } from "react-native-safe-area-context";
let mqtt = require("mqtt");
let pub = mqtt.connect("wss://test.mosquitto.org:8081");
let sub = mqtt.connect("wss://test.mosquitto.org:8081");
var Img = " ";

export default class MapPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      base64Icon: "https://reactjs.org/logo-og.png",
      xCor: 0,
      yCor: 0,
      xCorDoll: 0,
      yCorDoll: 0,
      asked: false,
      showClickPos: false,
      showDolly: false,
      greenCoordinatesX: [],
      greenCoordinatesY: [],
    };
    this.askImage = this.askImage.bind(this);
    this.displayImage = this.displayImage.bind(this);
    this.handlePress = this.handlePress.bind(this);
  }

  componentDidMount() {
    sub.subscribe("topic/x");
    sub.subscribe("topic/y");
    sub.subscribe("topic/Stop_BlueDot");
    sub.subscribe("XGreenLine_topic");
    sub.subscribe("YGreenLine_topic");
    sub.on(
      "message",
      function (topic, message) {
        // message is Buffer
        console.log("Location updated");
        if (topic === "topic/x") {
          //console.log("Subscribed to dolly x-coordinate");
          var xDoll = parseFloat(message);
          this.setState({ xCorDoll: xDoll * 15 + 175 });
        }
        if (topic === "topic/y") {
          //console.log("Subscribed to dolly y-coordinate");
          var yDoll = parseFloat(message);
          this.setState({ yCorDoll: -yDoll * 15 + 130 });
        }
        if (topic === "topic/Stop_BlueDot") {
          console.log("Blue Dot off: ", message.toString());
          this.setState({ showClickPos: false });
        }
        if (topic === "XGreenLine_topic") {
          let data = message;
          let valueX = [];
          let st = "";
          let j = 0;
          for (let i = 0; i <= data.length; i++) {
            if (String.fromCharCode(data[i]) != ",") {
              st += String.fromCharCode(data[i]);
            } else {
              valueX[j] = parseFloat(st);
              st = "";
              j++;
            }
          }
          //console.log("X array: ", valueX);
          this.setState({ greenCoordinatesX: valueX.slice() });
        }
        if (topic === "YGreenLine_topic") {
          let data = message;
          let valueY = [];
          let st = "";
          let j = 0;
          for (let i = 0; i <= data.length; i++) {
            if (String.fromCharCode(data[i]) != ",") {
              st += String.fromCharCode(data[i]);
            } else {
              valueY[j] = parseFloat(st);
              st = "";
              j++;
            }
          }
          this.setState({ greenCoordinatesY: valueY.slice() });
        }
        console.log("The array X: ", this.state.greenCoordinatesX);
        console.log("The array Y: ", this.state.greenCoordinatesY);
      }.bind(this)
    );
  }

  handlePress(evt) {
    var PosX = evt.nativeEvent.locationX;
    var PosY = evt.nativeEvent.locationY;
    console.log("X: " + PosX, "Y: " + PosY);
    PosX = PosX - 23;
    PosY = PosY - 23;
    this.setState({
      xCor: PosX + 12,
      yCor: PosY - 18,
      showClickPos: true,
    });
    let axisX = PosX.toString();
    let axisY = PosY.toString();
    pub.publish("x_Coordinate", axisX);
    pub.publish("y_Coordinate", axisY);
  }
  displayImage() {
    this.setState({
      base64Icon:
        "https://i.pinimg.com/originals/10/b2/f6/10b2f6d95195994fca386842dae53bb2.png",
    });
    this.askImage();
  }
  askImage() {
    //image map display
    this.setState({ asked: true });
    this.setState({ showDolly: true });
    pub.publish("askMap", "Map asked");

    sub.subscribe("topic/img");
    sub.on(
      "message",
      function (topic, message) {
        // message is Buffer
        if (topic === "topic/img") {
          console.log("topic/img");
          let data = message;
          let st = "";
          for (let i = 0; i < data.length; i++) {
            st += String.fromCharCode(data[i]);
          }
          Img = "data:image/png;base64," + btoa(st);
        }
        this.setState({
          base64Icon: Img,
        });
      }.bind(this)
    );
  }
  render() {
    let blueDot =
      this.state.showClickPos && this.state.asked ? (
        <View style={{ position: "absolute" }}>
          <Text
            style={{
              color: "blue",
              paddingTop: this.state.yCor,
              paddingLeft: this.state.xCor,
              fontSize: 50,
              fontWeight: "bold",
            }}
          >
            .
          </Text>
        </View>
      ) : null;
    let redDot = this.state.showDolly ? (
      <View style={{ position: "absolute" }}>
        <Text
          style={{
            color: "red",
            paddingTop: this.state.yCorDoll,
            paddingLeft: this.state.xCorDoll,
            fontSize: 50,
            fontWeight: "bold",
          }}
        >
          .
        </Text>
      </View>
    ) : null;
    let lineShow = this.state.showClickPos ? (
      <Svg>
        <Line
          x1={this.state.xCorDoll + 10}
          y1={this.state.yCorDoll + 60}
          x2={this.state.xCor}
          y2={this.state.yCor + 38}
          stroke="green"
          strokeWidth="5"
        />
        <View style={{ position: "absolute" }}>
          <Text
            style={{
              color: "green",
              paddingTop: this.state.yCorDoll,
              paddingLeft: this.state.xCorDoll,
            }}
          >
            .
          </Text>
        </View>
      </Svg>
    ) : null;

    return (
      <SafeAreaView style={styles.view}>
        <ScrollView
          style={{
            flex: 1,
            paddingTop: "5%",
          }}
        >
          <View style={styles.view}>
            <Text>Map screen</Text>
            <View style={styles.box}>
              <TouchableOpacity
                style={{}}
                onPress={
                  this.state.asked
                    ? (evt) => this.handlePress(evt)
                    : console.log("Press Asked Map")
                }
              >
                <ImageBackground
                  source={{
                    uri: this.state.base64Icon,
                  }}
                  style={styles.imageStyle}
                >
                  {blueDot}
                  {redDot}
                  {lineShow}
                </ImageBackground>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <Button title="Ask Map" onPress={this.displayImage}></Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
