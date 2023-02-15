import { View, TouchableOpacity, Image } from "react-native";
import React from "react";

const PostContent = ({ posts, navigation }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
      }}
    >
      {posts.map((post, index) => (
        <TouchableOpacity
          style={{
            width: 180,
            height: 180,
            marginBottom: 20,
          }}
          key={index}
          onPress={() => navigation.push("HomeScreen", post)}
        >
          <Image
            source={{ uri: post.imageUrl }}
            style={{ width: "100%", height: "100%", borderRadius: 20 }}
          />
          <Image
            source={require("../../assets/icons/like_normal.png")}
            style={{
              width: 25,
              height: 25,
              position: "absolute",
              right: 5,
              top: 5,
            }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PostContent;
