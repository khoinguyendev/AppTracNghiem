import React, { useState } from "react";
import { Image, Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { icons } from "../constants";

type FormFieldProps = {
  title: string;
  value: string;
  type?:string;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
} & TextInputProps;

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  type="text",
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View
        className={`w-full h-16 px-4 rounded-2xl flex flex-row items-center bg-black-100 border-2 ${
          isFocused ? "border-secondary" : "border-black"
        }`}
      >
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={type === "Password" && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {type === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
