import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthProps {
	authState?: { token: string | null; authenticated: boolean | null };
	onRegister?: (name: string, email: string, password: string) => Promise<any>;
	onLogin?: (name: string, email: string) => Promise<any>;
	onLogout?: () => Promise<any>;
	userData?: { id: string | null; name: string | null; email: string | null };
	userImage?: { image: string | null };
}

const TOKEN_KEY = "TOKEN";
export const API_URL = "https://hiponova-server.vercel.app";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
	const [authState, setAuthState] = useState<{
		token: string | null;
		authenticated: boolean | null;
	}>({
		token: null,
		authenticated: null,
	});
	const [userData, setUserData] = useState<{
		id: string;
		name: string;
		email: string;
	}>({
		id: "",
		name: "",
		email: "",
	});
	const [userImage, setUserImage] = useState<{ image: string }>({ image: "" });
	useEffect(() => {
		const getImage = async () => {
			const image = await SecureStore.getItemAsync("image");
			setUserImage({ image: image || "" });
		};
		getImage();
	}, []);

	useEffect(() => {
		const verifyToken = async () => {
			const token = await SecureStore.getItemAsync(TOKEN_KEY);

			const authorization = (axios.defaults.headers.common["Authorization"] =
				`Bearer ${token}`);

			try {
				await axios
					.post(`${API_URL}/api/authentication`, { authorization })
					.then(async (res) => {
						if (res.data.message === "Authenticated") {
							setAuthState({
								token: token,
								authenticated: true,
							});
							setUserData(res.data.user);
						} else {
							axios.defaults.headers.common["Authorization"] = "";
							await SecureStore.deleteItemAsync(TOKEN_KEY);
							setAuthState({
								token: null,
								authenticated: false,
							});
						}
					})
					.catch((err) => {
						console.log(err.data.message);
					});
			} catch (error) {
				console.log(error);
			}
		};
		verifyToken();
	});

	const register = async (name: string, email: string, password: string) => {
		console.log("registering");
		return await axios.post(`${API_URL}/api/auth/register`, {
			name,
			email,
			password,
		});
	};
	const login = async (email: string, password: string) => {
		const result = await axios.post(`${API_URL}/api/auth/login`, {
			email,
			password,
		});
		setAuthState({
			token: result.data.token,
			authenticated: true,
		});
		axios.defaults.headers.common["Authorization"] =
			`Bearer ${result.data.token}`;

		await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

		return result;
	};

	const Logout = async () => {
		console.log("logout");
		await SecureStore.deleteItemAsync(TOKEN_KEY);

		axios.defaults.headers.common["Authorization"] = "";

		setAuthState({
			token: null,
			authenticated: false,
		});
	};

	const value = {
		onRegister: register,
		onLogin: login,
		onLogout: Logout,
		authState,
		userData,
		userImage,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
