import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import BottomTabs from "../Components/utility/BottomTabs";

const PopularScreen = ({ navigation, route }) => {
  const data = route.params.data;
  const screenName = route.params.screenName;
  const sortedData = data.sort((a, b) => {
    return b.likes.length - a.likes.length;
  }).slice(0, 20);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground source={require("../assets/image/background1.jpg")} style={{flex: 1}} resizeMode="cover">
      <View style={styles.container}>
        <Header navigation={navigation} screenName={screenName} />
        <PopularList
          navigation={navigation}
          sortedData={sortedData}
          screenName={screenName}
        />
      </View>
      <View style={styles.wrapper}>
        {screenName === "Popular Videos" ? <BottomTabs navigation={navigation} tabName="Home" /> : <BottomTabs navigation={navigation} tabName="Movie" />}
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
const Header = ({ navigation, screenName }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image
        source={require("../assets/icons/back.png")}
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
    <Text style={styles.headerText}>{screenName}</Text>
    <Text></Text>
  </View>
);

const PopularList = ({ navigation, sortedData, screenName }) => (
  <View
    style={{
      width: "100%",
      paddingHorizontal: 15,
      alignSelf: "center",
    }}
  >
    <FlatList
      data={sortedData}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{
            height: 80,
            alignItems: "center",
            borderColor: "white",
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottomWidth: 0.5,
          }}
          onPress={() => {
            screenName === "Popular Posts"
              ? navigation.push("HomeScreen", item)
              : (screenName === "Popular Videos"
                  ? navigation.push("VideoPlayScreen", item)
                  : navigation.push("MoviePlayScreen", item));
          }}
        >
          <View style={{ width: "92%", flexDirection: "row" }}>
            <Image
              source={
                (screenName ==="Popular Posts"
                  ? { uri: item.imageUrl }
                  : { uri: item.thumbnailUrl })
              }
              style={styles.story}
            />
            <View style={{marginHorizontal: 15, justifyContent: 'center'}}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "white",
              }}
            >
              {(screenName === "Popular Posts" ? item.caption : item.title)}
            </Text>
            </View>
          </View>

          <View
            style={{
              width: 25,
              height: 25,
              backgroundColor: "white",
              justifyContent: "center",
              borderRadius: 1000,
            }}
          >
            <EvilIcons name="chevron-right" size={25} />
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
      showsVerticalScrollIndicator={false}
    />
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
    marginVertical: 6
  },
  headerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    marginRight: 23,
  },
  story: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  wrapper: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    zIndex: 999,
  },
});
export default PopularScreen;
