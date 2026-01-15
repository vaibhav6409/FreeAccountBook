// src/utils/AppUpdateHelper.js
import { Linking, Platform } from "react-native";
import InAppUpdates, { IAUUpdateKind } from "sp-react-native-in-app-updates";
// import Siren from "react-native-siren";
// import APIURL from "../constants/Urls";

const inAppUpdates = new InAppUpdates(false); // debug=false
const APP_STORE_ID = "6747184242"; // FNF app’s iOS App Store ID

export const checkForAppUpdate = async () => {
  if (Platform.OS === "android") {
    try {
      const result = await inAppUpdates.checkNeedsUpdate();
      console.log("Android update check result:", result);

      if (result.shouldUpdate) {
        // Start update if needed
        // inAppUpdates.startUpdate({ updateType: IAUUpdateKind.IMMEDIATE });
        return true;
      }
      return false;
    } catch (e) {
      console.log("Android update error:", e);
      return false;
    }
//   } else if (Platform.OS === "ios") {
//     try {
//       const result = await Siren.performCheck({
//         appID: APP_STORE_ID,
//         alertType: "force",
//         // countryCode: "US",
//       });

//       console.log("iOS update result:", result);

//       if (result.updateIsAvailable && result.version > APIURL.VersionCode) {
//         // await Siren.promptUser({ appID: APP_STORE_ID, alertType: "force" });
//         return true;
//       }
//       return false;
//     } catch (e) {
//       console.log("iOS update error:", e);
//       return false;
//     }
  }

  return false;
};

// export const iOSAppUpdate = async () => {
//   if (Platform.OS === "ios") {
//     try {
//       const result = await Siren.performCheck({
//         appID: APP_STORE_ID,
//         alertType: "force",
//         // countryCode: "US",
//       });

//       console.log("iOS update result:", result);

//       if (result.updateIsAvailable && result.version > APIURL.VersionCode) {
//         // await Siren.promptUser({ appID: APP_STORE_ID, alertType: "force" });
//         const appStoreURI = `itms-apps://apps.apple.com/app/id${APP_STORE_ID}?mt=8`
//         const appStoreURL = `https://apps.apple.com/app/id${APP_STORE_ID}?mt=8`

//         Linking.canOpenURL(appStoreURI).then(supported => {
//           if (supported) {
//             Linking.openURL(appStoreURI)
//           } else {
//             Linking.openURL(appStoreURL)
//           }
//         }).catch((e)=>{
//           console.log("e",e);
          
//         })
//         // Linking.openURL('https://apps.apple.com/us/app/fitnfine-aero/id6747184242')
//         return true;
//       }
//       return false;
//     } catch (e) {
//       console.log("iOS update error:", e);
//       return false;
//     }
//   }

//   return false;
// };

export const androidAppUpdate = async () => {
  if (Platform.OS === "android") {
    try {
      const result = await inAppUpdates.checkNeedsUpdate();
      console.log("Android update check result:", result);

      if (result.shouldUpdate) {
        // Start update if needed
        // inAppUpdates.startUpdate({ updateType: IAUUpdateKind.IMMEDIATE });
        Linking.openURL('https://play.google.com/store/apps/details?id=com.fitnfineaero');
        return true;
      }
      return false;
    } catch (e) {
      console.log("Android update error:", e);
      return false;
    }
  }

  return false;
};
