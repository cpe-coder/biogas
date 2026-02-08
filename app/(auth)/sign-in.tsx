import { CustomButton, InputField } from "@/components";
import { useRouter } from "expo-router";
import {
	Dimensions,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constant/images";
import { useAuth } from "@/context/auth-context";
import React from "react";

export default function SignIn() {
	const [disable, setDisable] = React.useState(true);
	const [isSubmit, setIsSubmit] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState("");
	const [successMessage, setSuccessMessage] = React.useState("");
	const { onLogin } = useAuth();
	const router = useRouter();
	const [form, setForm] = React.useState({
		email: "",
		password: "",
	});

	React.useEffect(() => {
		checkingForm();
	});

	const checkingForm = async () => {
		if (form.email === "" || form.password === "") {
			setDisable(true);
		} else {
			setDisable(false);
		}
	};

	const handleLogin = async () => {
		setIsSubmit(true);
		setErrorMessage("");
		if (onLogin) {
			try {
				const res = await onLogin!(form.email, form.password);
				if (res.status === 200) {
					setErrorMessage("");
					setSuccessMessage(res.data.message);
					setIsSubmit(false);
					setTimeout(() => {
						router.push("/Home");
					}, 1500);
				}
			} catch (error: any) {
				setErrorMessage(error.response.data.message);
				setIsSubmit(false);
			}
		}
	};

	const handleRoute = () => {
		router.push("/(auth)/sign-up");
	};

	return (
		<SafeAreaView className="bg-background h-full">
			<ScrollView>
				<View
					className="w-full flex justify-center h-full px-4"
					style={{
						minHeight: Dimensions.get("window").height - 100,
					}}
				>
					<View className="items-center justify-center">
						<Image source={images.Logo} className="h-40 w-40" />
						<Text className="text-3xl text-center text-primary font-bold">
							Welcome Back!
						</Text>

						<Text className="text-base text-center text-accent mt-2 font-bold">
							Sign In to your account to continue
						</Text>
					</View>

					<InputField
						title="Email:"
						placeholder="Enter your email"
						value={form.email}
						handleChangeText={(e: any) => setForm({ ...form, email: e })}
						otherStyles="mt-10"
					/>

					<InputField
						placeholder="Enter your password"
						title="Password:"
						value={form.password}
						handleChangeText={(e: any) => setForm({ ...form, password: e })}
						otherStyles="mt-4"
					/>
					<Text
						className={`text-md text-red-500 font-semibold text-center py-1 px-4 ${
							errorMessage ? "block" : "hidden"
						}`}
					>
						{errorMessage}
					</Text>

					<Text
						className={`text-md text-green-500 font-semibold text-center py-1 ${
							successMessage ? "block" : "hidden"
						}`}
					>
						{successMessage}
					</Text>

					<CustomButton
						title="Login"
						textStyles=""
						handlePress={handleLogin}
						submitting={isSubmit || isSubmit}
						containerStyles="mt-10"
						disable={disable || isSubmit}
					/>

					<View className="flex justify-center pt-5 flex-row gap-2">
						<Text className="text-md text-accent font-regular">
							Don&apos;t have an account?
						</Text>
						<TouchableOpacity onPress={handleRoute}>
							<Text className="text-md font-semibold text-primary">
								Sign-Up
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
