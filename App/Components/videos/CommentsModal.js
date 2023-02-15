import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ImageBackground,
} from "react-native";
import { Divider } from "react-native-elements";
import { useSelector } from "react-redux";
const getProfileById = (
  userId,
  navigation,
  setModalVisible,
  profile,
  setVideoPlayModal
) => {
  if (profile.userId === userId) {
    setVideoPlayModal(false);
    navigation.push("ProfileScreen", profile);
    setModalVisible(false);
  } else {
    fetch(`https://darkvilla.onrender.com/api/profile/user/${userId}`)
      .then((res) => res.json())
      .then((profile) => {
        setVideoPlayModal(false);
        navigation.push("ProfileScreen", profile);
        setModalVisible(false);
      });
  }
};
export default function CommentsModal({
  setModalVisible,
  userId,
  userName,
  profilePic,
  updateVideo,
  setUpdateVideo,
  navigation,
  profile,
  setVideoPlayModal,
  screenHeight,
}) {
  const [submitComments, setSubmitComments] = useState(false);
  const [text, onChangeText] = useState("");
  const { token } = useSelector((state) => state.tokenReducer);
  let videoComments = updateVideo.comments;
  //Update Video Comments
  useEffect(() => {
    if (!submitComments) {
      return;
    }
    if (!token.access_token) {
      return;
    }
    fetch(`https://darkvilla.onrender.com/api/video/comment/${updateVideo._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`,
      },
      body: JSON.stringify({
        comments: videoComments,
      }),
    })
      .then((res) => res.json())
      .then((document) => {
        setUpdateVideo(document);
        setSubmitComments(false);
        onChangeText("");
        setModalVisible(false);
      });
  }, [submitComments]);
  return (
    <View style={styles.modalContainer}>
      <View
        style={{
          borderWidth: 1,
          backgroundColor: "black",
          height: screenHeight - 201,
        }}
      >
        <ImageBackground
          source={require("../../assets/image/background4.jpg")}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
        <ModalHeader setModalVisible={setModalVisible} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <VideoDetails
            updateVideo={updateVideo}
            navigation={navigation}
            setModalVisible={setModalVisible}
            profile={profile}
            setVideoPlayModal={setVideoPlayModal}
          />
          <Divider width={1} orientation="vertical" style={{ marginTop: 15 }} />
          <Comments
            videoComments={videoComments}
            userId={userId}
            setSubmitComments={setSubmitComments}
            navigation={navigation}
            setModalVisible={setModalVisible}
            profile={profile}
            setVideoPlayModal={setVideoPlayModal}
          />
        </ScrollView>
        <Divider width={1} orientation="vertical" />
        <AddComment
          profilePic={profilePic}
          text={text}
          onChangeText={onChangeText}
          setSubmitComments={setSubmitComments}
          videoComments={videoComments}
          userId={userId}
          userName={userName}
        />
        </ImageBackground>
      </View>
    </View>
  );
}
const ModalHeader = ({ setModalVisible }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => setModalVisible(false)}>
      <Image
        source={require("../../assets/icons/back.png")}
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
    <Text style={styles.headerText}>Comments</Text>
    <Text></Text>
  </View>
);
const VideoDetails = ({
  updateVideo,
  navigation,
  setModalVisible,
  profile,
  setVideoPlayModal,
}) => (
  <TouchableOpacity
    style={{
      flexDirection: "row",
      marginHorizontal: 10,
      marginTop: 30,
      alignItems: "center",
    }}
    onPress={() =>
      getProfileById(
        updateVideo.userId,
        navigation,
        setModalVisible,
        profile,
        setVideoPlayModal
      )
    }
  >
    <View style={{ width: "10%" }}>
      <Image
        source={{ uri: updateVideo.profilePic }}
        style={{ width: 35, height: 35, borderRadius: 50 }}
      />
    </View>
    <View style={{ width: "90%" }}>
      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          marginLeft: 8,
          textAlignVertical: "center",
          textAlign: "justify",
        }}
      >
        {updateVideo.userName}
        <Text style={{ color: "white", fontWeight: "100" }}>
          {" "}
          #{updateVideo.title}
        </Text>
      </Text>
    </View>
  </TouchableOpacity>
);
const Comments = ({
  videoComments,
  userId,
  setSubmitComments,
  navigation,
  setModalVisible,
  profile,
  setVideoPlayModal,
}) => {
  const deleteComment = (index) => {
    videoComments.splice(index, 1);
    setSubmitComments(true);
  };
  return (
    <>
      {videoComments.map((comment, index) => (
        <TouchableOpacity
          style={{ flexDirection: "row", marginHorizontal: 10, marginTop: 25 }}
          key={index}
          onPress={() =>
            getProfileById(
              comment.userId,
              navigation,
              setModalVisible,
              profile,
              setVideoPlayModal
            )
          }
        >
          <View style={{ width: "10%" }}>
            <Image
              source={{ uri: comment.profilePic }}
              style={{ width: 35, height: 35, borderRadius: 50 }}
            />
          </View>
          <View style={{ width: "85%", justifyContent: "center" }}>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                marginHorizontal: 8,
                textAlign: "justify",
              }}
            >
              {comment.userName}
              <Text style={{ color: "white", fontWeight: "100" }}>
                {" "}
                {comment.comment}
              </Text>
            </Text>
          </View>
          {comment.userId === userId ? (
            <TouchableOpacity
              style={{ width: "5%", justifyContent: "center" }}
              onPress={() => deleteComment(index)}
            >
              <Image
                source={require("../../assets/icons/cancel.png")}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ width: "5%", justifyContent: "center" }}>
              <Image
                source={require("../../assets/icons/dot.png")}
                style={{ width: 20, height: 20 }}
              />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </>
  );
};
const AddComment = ({
  profilePic,
  text,
  onChangeText,
  setSubmitComments,
  videoComments,
  userId,
  userName,
}) => {
  const addComment = () => {
    videoComments.push({
      userId: userId,
      userName: userName,
      profilePic: profilePic,
      comment: text,
    });
    setSubmitComments(true);
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
      }}
    >
      <View style={{ width: "10%", alignItems: "center" }}>
        <Image
          source={{ uri: profilePic }}
          style={{ width: 35, height: 35, borderRadius: 50 }}
        />
      </View>
      <View style={{ width: "80%" }}>
        <TextInput
          style={{
            margin: 12,
            borderWidth: 1,
            padding: 10,
            height: 35,
            borderWidth: 0,
            color: "white",
          }}
          onChangeText={onChangeText}
          value={text}
          placeholder="Add a comment.."
          placeholderTextColor="white"
        />
      </View>
      {text.length < 2 ? (
        <View style={{ width: "10%" }}>
          <Text style={{ color: "gray", textAlign: "center" }}>Post</Text>
        </View>
      ) : (
        <TouchableOpacity style={{ width: "10%" }} onPress={() => addComment()}>
          <Text style={{ color: "white", textAlign: "center" }}>Post</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  headerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
    marginRight: 23,
  },
});
