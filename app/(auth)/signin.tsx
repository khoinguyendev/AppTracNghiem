import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import { images } from "@/constants";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Signin = () => {
  const { setSession } = useAuth();


  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = async () => {
    const newErrors: typeof errors = {};

    if (!form.email) {
      newErrors.email = "Vui lòng nhập email.";
    }

    if (!form.password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // xóa lỗi cũ

    try {
      setIsSubmitting(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) {
        setErrors({ general: error.message=="Invalid login credentials"?"Email hoặc mật khẩu không đúng": error.message });
      } else {
        setSession(data.session); 
        router.replace("/(tabs)");
      }
    } catch (err) {
      setErrors({ general: "Lỗi không xác định. Vui lòng thử lại." });
    } finally {
      setIsSubmitting(false);
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
          {/* Logo */}
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />

          {/* <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
          Đăng nhập
        </Text> */}
          {errors.general && <Text className="text-red-500 text-sm mt-4">{errors.general}</Text>}

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            autoCapitalize="none"

            keyboardType="email-address"
          />
          {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>}

          <FormField
            title="Mật khẩu"
            type='Password'
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          {errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>}

          <CustomButton
            title="Đăng nhập"
            handlePress={submit}
            containerStyles="mt-7 w-full"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Bạn chưa có tài khoản?
            </Text>
            <Link
              href="/signup"
              className="text-lg font-psemibold text-secondary"
            >
              Đăng kí
            </Link>
          </View>
          {/* Nút Google */}
          {/* <TouchableOpacity
          onPress={()=>router.push("/(tabs)")}
          className="flex-row items-center bg-white px-5 py-3 rounded-full shadow"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Image
              source={{
                uri: 'https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png',
              }}
              className="w-6 h-6 mr-3"
            />
            <Text className="text-black font-medium text-base">
              Đăng nhập bằng Google
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;
