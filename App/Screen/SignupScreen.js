import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import InputField from "../formComponents/InputField";
import InputButton from "../formComponents/InputButton";
import ErrorMessage from "../formComponents/ErrorMessage";
import { Formik } from "formik";
import * as Yup from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch } from "react-redux";
const validationSchema = Yup.object().shape({
  fullname: Yup.string()
    .label("Fullname")
    .required("Please enter username.")
    .min(3, "Username must have at least 3 characters.")
    .max(30, "Username must be less than or equal to 30 characters."),
  email: Yup.string()
    .label("Email")
    .email("Enter a valid email")
    .required("Please enter your email address."),
  password: Yup.string()
    .label("Password")
    .required("Please enter your password.")
    .min(3, "Password must have at least 3 characters."),
  repeat_password: Yup.string()
    .label("Repeat Password")
    .required("Please make sure your password match.")
    .min(3, "Password must have at least 3 characters."),
});
const SignupScreen = ({ navigation }) => {
  const [Token, setToken] = useState({});
  const [Submit, setSubmit] = useState(false);
  const [fetchCallData, setFetchCallData] = useState({});

  const controlSubmit = (values) => {
    setFetchCallData(values);
    setSubmit(true);
  };
  const dispatch = useDispatch();
  // Register
  useEffect(() => {
    if (!Submit) {
      return;
    }

    fetch("https://darkvilla.onrender.com/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fetchCallData.fullname,
        email: fetchCallData.email,
        password: fetchCallData.password,
        repeat_password: fetchCallData.repeat_password,
      }),
    })
      .then((res) => res.json())
      .then((tokenData) => {
        setToken(tokenData);
        dispatch({
          type: "ADD_TOKEN",
          payload: {
            tokenData,
          },
        });
      });
  }, [Submit]);
  
  // User Details
  useEffect(() => {
    if (!Submit) {
      return;
    }

    if (!Token.access_token) {
      Alert.alert(
        "Signup Failed!",
        "This email address has been taken by another account or password and repeat password does not match.",
        [
          {
            text: "OK",
            onPress: () => console.log("OK"),
            style: "cancel",
          },
          {
            text: "Sign In",
            onPress: () => navigation.push("LoginScreen"),
          },
        ]
      );
      setSubmit(false);
      return;
    }
    fetch("https://darkvilla.onrender.com/api/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((userData) => {
        dispatch({
          type: "ADD_USER",
          payload: {
            userData,
          },
        });
        setSubmit(false);
        navigation.push("VideoScreen");
      });
  }, [Token]);
  useEffect(() => {
    if (!Submit) {
      return;
    }
    if (!Token.access_token) {
      return;
    }
    fetch("https://darkvilla.onrender.com/api/profile/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Token.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((profileData) => {
        dispatch({
          type: "ADD_PROFILE",
          payload: {
            profileData,
          },
        });
        setSubmit(false);
        navigation.push("VideoScreen");
      });
  }, [Token]);
  return (
    <ImageBackground source={require("../assets/image/background2.jpg")} style={{flex: 1}} resizeMode="cover">
    <KeyboardAvoidingView
      style={styles.avoidKeyboard}
      behavior="padding"
      enabled
      keyboardVerticalOffset={-1000}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            style={{
              alignSelf: "flex-start",
              marginTop: 30,
              paddingHorizontal: 30,
            }}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="keyboard-backspace"
              size={36}
              color={"#eee"}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 36,
              fontWeight: "bold",
              marginTop: 40,
              alignSelf: "flex-start",
              paddingHorizontal: 30,
              color: "#7842e5",
            }}
            adjustsFontSizeToFit
          >
            Create Account
          </Text>
          <View style={styles.form}>
            <Formik
              initialValues={{
                fullname: "",
                email: "",
                password: "",
                repeat_password: "",
              }}
              onSubmit={(values) => {
                controlSubmit(values);
              }}
              validationSchema={validationSchema}
              validateOnMount={true}
            >
              {({
                handleChange,
                values,
                handleSubmit,
                errors,
                isValid,
                touched,
                handleBlur,
              }) => (
                <>
                  <InputField
                    name="fullname"
                    value={values.fullname}
                    onChangeText={handleChange("fullname")}
                    onBlur={handleBlur("fullname")}
                    placeholder="Username"
                    returnKeyType="done"
                    iconName="user"
                    iconColor="gray"
                  />
                  <ErrorMessage
                    errorValue={touched.fullname && errors.fullname}
                  />

                  <InputField
                    name="email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    placeholder="Email"
                    keyboardType="email-address"
                    returnKeyType="done"
                    autoCapitalize="none"
                    iconName="mail"
                    iconColor="gray"
                  />
                  <ErrorMessage errorValue={touched.email && errors.email} />

                  <InputField
                    name="password"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    placeholder="Password"
                    returnKeyType="done"
                    autoCapitalize="none"
                    secureTextEntry={true}
                    iconName="lock"
                    iconColor="gray"
                  />
                  <ErrorMessage
                    errorValue={touched.password && errors.password}
                  />

                  <InputField
                    name="repeat_password"
                    value={values.repeat_password}
                    onChangeText={handleChange("repeat_password")}
                    onBlur={handleBlur("repeat_password")}
                    placeholder="Confirm password"
                    returnKeyType="done"
                    autoCapitalize="none"
                    secureTextEntry={true}
                    iconName="unlock"
                    iconColor="gray"
                  />
                  <ErrorMessage
                    errorValue={
                      touched.repeat_password && errors.repeat_password
                    }
                  />

                  <InputButton
                    onPress={handleSubmit}
                    disabled={!isValid}
                    buttonType="solid"
                    title="SIGN UP"
                    buttonColor="#7842e5"
                  />
                </>
              )}
            </Formik>
          </View>
          <StatusBar style="auto" />
          <View
            style={{
              flexDirection: "row",
              marginTop: 100,
              marginBottom: 25,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 17, color: "#eee" }}>
              Already have a account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.push("LoginScreen")}
              style={{ marginLeft: 4 }}
            >
              <Text
                style={{
                  color: "#7842e5",
                  fontSize: 17,
                  fontWeight: "bold",
                }}
              >
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: "90%",
    marginTop: 30,
  },
  avoidKeyboard: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});

export default SignupScreen;
