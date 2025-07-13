import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import { images } from "@/constants";
import { supabase } from '@/lib/supabase';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Signup = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const submit = async () => {
    const newErrors: typeof errors = {};

    if (!form.email) {
      newErrors.email = "Vui lòng nhập email.";
    }

    if (!form.password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // clear errors

    try {
      setSubmitting(true);

      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setErrors({ email: "Email đã được đăng ký." });
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      Alert.alert(
        "Thành công",
        "Vui lòng kiểm tra email để xác nhận đăng ký.",
        [{ text: "OK", onPress: () => router.replace("/signin") }]
      );
    } catch (err) {
      setErrors({ general: "Lỗi không xác định. Vui lòng thử lại." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center items-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />

          {errors.general && (
            <Text className="text-red-500 text-sm mt-2">{errors.general}</Text>
          )}

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          {errors.email && (
            <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
          )}

          <FormField
            title="Mật khẩu"
            value={form.password}
            type="Password"
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          {errors.password && (
            <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
          )}

          <FormField
            title="Xác nhận mật khẩu"
            value={form.confirmPassword}
            type="Password"
            handleChangeText={(e) =>
              setForm({ ...form, confirmPassword: e })
            }
            otherStyles="mt-7"
          />
          {errors.confirmPassword && (
            <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword}</Text>
          )}

          <CustomButton
            title="Đăng kí"
            handlePress={submit}
            containerStyles="mt-7 w-full"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Bạn đã có tài khoản?
            </Text>
            <Link
              href="/signin"
              className="text-lg font-psemibold text-secondary"
            >
              Đăng nhập
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
