import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import config from "./config";

const firebaseConfig = config;

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);