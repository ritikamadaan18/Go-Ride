import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { fetchAPI } from "./fetch";

export const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export const googleOAuth = async (startSSOFlow: any) => {
  try {
    const { createdSessionId, setActive, signUp } = await startSSOFlow({
      strategy: "oauth_google",
      redirectUrl: AuthSession.makeRedirectUri({
        scheme: "goride",
        path: "/(root)/(tabs)/home",
      }),
    });

    // If session created → login success
    if (createdSessionId && setActive) {
      await setActive({ session: createdSessionId });

      // Store new user in db
      if (signUp?.createdUserId) {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: `${signUp.firstName || ""} ${signUp.lastName || ""}`,
            email: signUp.emailAddress,
            clerkId: signUp.createdUserId,
          }),
        });
      }

      return {
        success: true,
        code: "success",
        message: "You have successfully signed in with Google",
      };
    }

    // No session - needs extra steps
    return {
      success: false,
      code: "incomplete",
      message: "Additional authentication steps required",
    };
  } catch (err: any) {
    console.error(err);

    return {
      success: false,
      code: err.code,
      message: err?.errors?.[0]?.longMessage || "OAuth failed",
    };
  }
};
