import { icons } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { session,setSession } = useAuth();
 
  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.replace("/signin");
  };
 

 

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
        <TouchableOpacity onPress={logout} className="flex w-full items-end mb-10">
          <Image source={icons.logout} resizeMode="contain" className="w-6 h-6" />
        </TouchableOpacity>

        {session && (
          <>
            <View className="w-20 h-20 rounded-full bg-secondary justify-center items-center">
              
              <Text className="text-white text-2xl font-bold">
                {session.user.email?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-white text-lg mt-4 font-semibold">{session.user.email}</Text>
          </>
        )}
         
       
      </View>
    </SafeAreaView>
  );
};

export default Profile;
