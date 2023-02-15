import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import FormikVideoUploader from "./FormikVideoUploader";

export default function AddNewVideo({navigation}) {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <FormikVideoUploader navigation={navigation}/>
    </View>
  )
}
const Header = ({ navigation }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image
        source={require("../../assets/icons/back.png")}
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
    <Text style={styles.headerText}>New Video</Text>
    <Text></Text>
  </View>
);
const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5
  },
  headerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    marginRight: 23,
  },
});