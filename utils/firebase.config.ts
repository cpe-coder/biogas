// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBLFeJ9RQzykmAn9EkEr3EgXEEwAqnLWdE",
	authDomain: "biogas-bcea7.firebaseapp.com",
	databaseURL: "https://biogas-bcea7-default-rtdb.firebaseio.com",
	projectId: "biogas-bcea7",
	storageBucket: "biogas-bcea7.firebasestorage.app",
	messagingSenderId: "626272309451",
	appId: "1:626272309451:web:cfd8cf061d1c6cdbfc8b4e",
	measurementId: "G-NTQCG83HGY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default { database };
