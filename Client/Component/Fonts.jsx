import * as Font from "expo-font";

const useFonts = async () => {
   await Font.loadAsync({
    'Urbanist-Black': require('../assets/fonts/Urbanist-Black.ttf'),
    'Urbanist-Bold': require('../assets/fonts/Urbanist-Bold.ttf'),
    'Urbanist-ExtraBold': require('../assets/fonts/Urbanist-ExtraBold.ttf'),
    'Urbanist-ExtraLight': require('../assets/fonts/Urbanist-ExtraLight.ttf'),
    'Urbanist-Light': require('../assets/fonts/Urbanist-Light.ttf'),
    'Urbanist-Medium': require('../assets/fonts/Urbanist-Medium.ttf'),
    'Urbanist-Regular': require('../assets/fonts/Urbanist-Regular.ttf'),
    'Urbanist-SemiBold': require('../assets/fonts/Urbanist-SemiBold.ttf'),
    'Urbanist-Thin': require('../assets/fonts/Urbanist-Thin.ttf'),
    
    });
};



export default useFonts;