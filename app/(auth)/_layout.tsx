import { useAuth } from "@/context/AuthContext";
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function AuthLayout() {
  const { session, isSessionLoading } = useAuth();

  useEffect(() => {
    if (!isSessionLoading && session) {
      router.replace("/(tabs)");
    }
  }, [session, isSessionLoading]);

  if (isSessionLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white text-base">Đang kiểm tra đăng nhập...</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    />
  );
}
