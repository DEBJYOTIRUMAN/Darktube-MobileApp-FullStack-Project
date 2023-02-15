import React from "react";
import { Input } from "react-native-elements";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";

const InputField = ({
    iconName,
    iconColor,
    name,
    placeholder,
    value,
    input,
    ...rest
}) => (
    <View style={styles.container}>
        <Input
            {...rest}
            leftIcon={<Feather name={iconName} size={25} color={iconColor} />}
            leftIconContainerStyle={styles.iconStyle}
            placeholderTextColor="grey"
            name={name}
            value={value}
            placeholder={placeholder}
            inputContainerStyle={{
                borderBottomWidth: 0,
                backgroundColor: "#ebeaef",
                padding: 8,
                borderRadius: 5,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.18,
                shadowRadius: 1.0,

                elevation: 1,
            }}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginBottom: -5,
        width: "100%",
    },
    iconStyle: {
        marginHorizontal: 5
    },
});

export default InputField;
