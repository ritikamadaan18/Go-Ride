// import { useSignIn } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useAuth, useSignIn } from "@clerk/expo";

const SignIn = () => {
  const { signIn } = useSignIn();
  const { isLoaded } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const { error } = await signIn.password({
        emailAddress: form.email,
        password: form.password,
      });

      if (error) {
        console.log(JSON.stringify(error, null, 2));
        let message = "Something went wrong";

        if (typeof error === "object" && error !== null && "errors" in error) {
          const clerkErr = error as any;
          message = clerkErr.errors?.[0]?.longMessage || message;
        }

        Alert.alert("Error", message);

        return;
      }
    } catch (err: unknown) {
      let message = "Something went wrong";

      if (typeof err === "object" && err !== null && "errors" in err) {
        const clerkErr = err as any;
        message = clerkErr.errors?.[0]?.longMessage || message;
      }

      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", message);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome 👋
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <InputField
            label="Password"
            placeholder="Enter password"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-6"
          />

          <OAuth />

          <Link
            href="/sign-up"
            replace
            className="text-lg text-center text-general-200 mt-10"
          >
            Don&apos;t have an account?{" "}
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
