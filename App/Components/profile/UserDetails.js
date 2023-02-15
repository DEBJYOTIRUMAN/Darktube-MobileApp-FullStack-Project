import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { useSelector } from "react-redux";
import FollowersModal from "./FollowersModal";
import FollowingModal from "./FollowingModal";
import PicUploadModal from "./PicUploadModal";
const UserDetails = ({
  profile,
  setProfile,
  userId,
  videos,
  navigation,
  localUri,
  setLocalUri,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { token } = useSelector((state) => state.tokenReducer);
  const admin = useSelector((state) => state.profileReducer);
  const [submit, setSubmit] = useState(false);
  const [followersVisible, setFollowersVisible] = useState(false);
  const [followingVisible, setFollowingVisible] = useState(false);

  useEffect(() => {
    if (!submit) {
      return;
    }
    if (!token.access_token) {
      return;
    }
    let updateFollowers = profile.followers;
    let updateFollowing = admin.profile.following;
    if (!updateFollowers.includes(userId)) {
      updateFollowers.push(userId);
      updateFollowing.push(profile.userId);
    } else {
      updateFollowers = updateFollowers.filter((item) => item !== userId);
      updateFollowing = updateFollowing.filter(
        (item) => item !== profile.userId
      );
    }
    fetch(
      `https://darkvilla.onrender.com/api/profile/update_follow/${profile.userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access_token}`,
        },
        body: JSON.stringify({
          followers: updateFollowers,
          following: updateFollowing,
        }),
      }
    )
      .then((res) => res.json())
      .then((updateProfile) => {
        setProfile(updateProfile);
        setSubmit(false);
      });
  }, [submit]);

  return (
    <>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 40,
        }}
      >
        {profile.userId === userId ? (
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Image
              source={
                localUri === ""
                  ? { uri: profile.profilePic }
                  : { uri: localUri }
              }
              style={{
                width: 150,
                height: 150,
                borderColor: "#7842e5",
                borderWidth: 8,
                borderRadius: 20000,
              }}
            />
          </TouchableOpacity>
        ) : (
          <View>
            <Image
              source={{ uri: profile.profilePic }}
              style={{
                width: 150,
                height: 150,
                borderColor: "#7842e5",
                borderWidth: 8,
                borderRadius: 20000,
              }}
            />
          </View>
        )}

        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 20,
            color: "white",
          }}
        >
          {profile.userName}
        </Text>
        <Text style={{ fontSize: 17, marginTop: 5, color: "#eee" }}>
          Prime Member
        </Text>
      </View>
      {profile.userId !== userId ? (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <TouchableOpacity
            style={{
              width: 100,
              alignSelf: "center",
              marginTop: 8,
              borderRadius: 15,
              overflow: "hidden",
              marginHorizontal: 10,
            }}
            onPress={() => setSubmit(true)}
          >
            <Text
              style={{
                textAlign: "center",
                backgroundColor: "#7842e5",
                fontSize: 17,
                color: "white",
                fontWeight: "bold",
                padding: 5,
              }}
            >
              {profile.followers.includes(userId) ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 100,
              alignSelf: "center",
              marginTop: 8,
              borderRadius: 15,
              overflow: "hidden",
              marginHorizontal: 10,
            }}
            onPress={() => navigation.push("MessengerScreen")}
          >
            <Text
              style={{
                textAlign: "center",
                backgroundColor: "#7842e5",
                fontSize: 17,
                color: "white",
                fontWeight: "bold",
                padding: 5,
              }}
            >
              Message
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          marginTop: 8,
        }}
      >
        {/* User Videos */}

        <View style={{ width: 80, alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
            {videos.length}
          </Text>
          <Text style={{ color: "white" }}>Videos</Text>
        </View>

        {/* Followers */}

        {profile.followers.length !== 0 ? (
          <TouchableOpacity
            style={{
              width: 80,
              marginLeft: 20,
              marginRight: 20,
              alignItems: "center",
            }}
            onPress={() => setFollowersVisible(true)}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
              {profile.followers.length}
            </Text>
            <Text style={{ color: "white" }}>Followers</Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: 80,
              marginLeft: 20,
              marginRight: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
              {profile.followers.length}
            </Text>
            <Text style={{ color: "white" }}>Followers</Text>
          </View>
        )}

        {/* Following */}

        {profile.following.length !== 0 ? (
          <TouchableOpacity
            style={{ width: 80, alignItems: "center" }}
            onPress={() => setFollowingVisible(true)}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
              {profile.following.length}
            </Text>
            <Text style={{ color: "white" }}>Following</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80, alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
              {profile.following.length}
            </Text>
            <Text style={{ color: "white" }}>Following</Text>
          </View>
        )}
      </View>
      {/* Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <View style={{ width: "90%" }}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 30,
              overflow: "hidden",
            }}
          >
            <Text
              style={{
                color: "black",
                textAlign: "center",
                fontSize: 17,
                fontWeight: "bold",
                padding: 7,
              }}
            >
              Videos
            </Text>
          </View>
        </View>
      </View>

      {/* Picture Upload Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <PicUploadModal
          setModalVisible={setModalVisible}
          setLocalUri={setLocalUri}
          profilePic={profile.profilePic}
          localUri={localUri}
        />
      </Modal>
      {/* Followers Visible Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={followersVisible}
        onRequestClose={() => setFollowersVisible(false)}
      >
        <FollowersModal
          setFollowersVisible={setFollowersVisible}
          userFollowers={profile.followers}
          navigation={navigation}
        />
      </Modal>
      {/* Following Visible Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={followingVisible}
        onRequestClose={() => setFollowingVisible(false)}
      >
        <FollowingModal
          setFollowingVisible={setFollowingVisible}
          allFollowing={profile.following}
          navigation={navigation}
        />
      </Modal>
    </>
  );
};

export default UserDetails;
