import ProtectedTabs from "@/components/ProtectedTabs";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";


const TabBarIcon = ({ name, color, size, focused }: { name: keyof typeof Ionicons.glyphMap, color: string, size: number, focused: boolean }) => {
  return (
    <Ionicons name={name} color={focused ? "#eb9e34" : color} size={size} />
  );
};

export default function TabLayout() {
  return (
    <ProtectedTabs>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#030014",
            borderTopColor: "#030014",

          },
          tabBarActiveTintColor: "#eb9e34", // 👈 màu icon và chữ khi active
          // tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Trang chủ",
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon name="home" color={color} size={size} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: "Lưu",
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon name="heart" color={color} size={size} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="exam"
          options={{
            title: "Đề",
            tabBarIcon: ({ color, size, focused }) => (
              <TabBarIcon name="book" color={color} size={size} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Tôi",
            tabBarIcon: ({ color = "#eb9e34", size, focused }) => (
              <TabBarIcon name="person" color={color} size={size} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </ProtectedTabs>
  );
}
