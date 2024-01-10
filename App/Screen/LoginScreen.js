import React, { useState, useEffect } from "react";
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
import { useDispatch } from "react-redux";
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .label("Email")
    .email("Enter a valid email")
    .required("Please enter your email address."),
  password: Yup.string()
    .label("Password")
    .required("Please enter your password.")
    .min(3, "Password must have at least 3 characters"),
});
const LoginScreen = ({ navigation }) => {
  const [Token, setToken] = useState({});
  const [Submit, setSubmit] = useState(false);
  const [fetchCallData, setFetchCallData] = useState({});
  const controlSubmit = (values) => {
    setFetchCallData(values);
    setSubmit(true);
  };
  const dispatch = useDispatch();
  // Login
  useEffect(() => {
    if (!Submit) {
      return;
    }

    fetch("https://darkvilla.onrender.com/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: fetchCallData.email,
        password: fetchCallData.password,
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
        "Login Failed!",
        "The password is invalid or the user does not have a password.",
        [
          {
            text: "OK",
            onPress: () => console.log("OK"),
            style: "cancel",
          },
          {
            text: "Sign Up",
            onPress: () => navigation.push("SignupScreen"),
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
      });
  }, [Token]);

  // Profile Details

  useEffect(() => {
    if (!Token.access_token) {
      return;
    }
    fetch("https://darkvilla.onrender.com/api/profile", {
      method: "GET",
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ImageBackground
        source={require("../assets/image/background2.jpg")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          style={styles.avoidKeyboard}
          behavior="padding"
          enabled
          keyboardVerticalOffset={-1000}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <View
                style={{
                  marginTop: 150,
                  alignSelf: "flex-start",
                  paddingHorizontal: 30,
                }}
              >
                <Text
                  style={{
                    fontSize: 36,
                    fontWeight: "bold",
                    color: "#7842e5",
                  }}
                  adjustsFontSizeToFit
                >
                  Login
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: "#7842e5",
                    marginVertical: 10,
                  }}
                >
                  Please sign in to continue.
                </Text>
              </View>
              <View style={styles.form}>
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
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
                        name="email"
                        value={values.email}
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        placeholder="Email"
                        keyboardType="email-address"
                        returnKeyType="done"
                        autoCapitalize="none"
                        iconName="mail"
                        iconColor="grey"
                      />
                      <ErrorMessage
                        errorValue={touched.email && errors.email}
                      />

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
                        iconColor="grey"
                      />
                      <ErrorMessage
                        errorValue={touched.password && errors.password}
                      />

                      <InputButton
                        onPress={handleSubmit}
                        disabled={!isValid}
                        buttonType="solid"
                        title="LOGIN"
                        buttonColor="#7842e5"
                      />
                    </>
                  )}
                </Formik>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 160,
                  marginBottom: 30,
                }}
              >
                <Text style={{ fontSize: 17, color: "#eee" }}>
                  Don't have an account?
                </Text>
                <TouchableOpacity
                  style={{ marginLeft: 4 }}
                  onPress={() => navigation.push("SignupScreen")}
                >
                  <Text
                    style={{
                      color: "#7842e5",
                      fontSize: 17,
                      fontWeight: "bold",
                    }}
                  >
                    Sign up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
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
    marginTop: 55,
  },
  avoidKeyboard: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
  },
});

export default LoginScreen;
