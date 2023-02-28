import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace with your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCkkVFqNxS29xzhFoTFiZtjVyas0UqVxTk",
//   authDomain: "chatkitty-react-native-example.firebaseapp.com",
//   projectId: "chatkitty-react-native-example",
//   storageBucket: "chatkitty-react-native-example.appspot.com",
//   messagingSenderId: "105958027318",
//   appId: "1:105958027318:web:fdac741221ed00e6f0a897"
// };
const firebaseConfig = {
  apiKey: "AIzaSyDG1dK10JBiJA-YkDvI_5EPcaY3FOX3HR4",
  authDomain: "worcare-3df72.firebaseapp.com",
  projectId: "worcare-3df72",
  storageBucket: "worcare-3df72.appspot.com",
  messagingSenderId: "417490397074",
  appId: "1:417490397074:web:19b8c43a793c251813034b"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };