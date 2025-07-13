import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedTabs({ children }: { children: React.ReactNode }) {
  const { session, isSessionLoading } = useAuth();

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.replace("/signin");
    }
  }, [session, isSessionLoading]);

  if (isSessionLoading || !session) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator color="white" size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
