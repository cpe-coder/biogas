import { CustomButton, InputField } from "@/components";
import { images } from "@/constant/images";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import React from "react";
import {
	Dimensions,
	Image,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function SignUp() {
	const [disable, setDisable] = React.useState(false);
	const [isSubmit, setIsSubmit] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState("");
	const [successMessage, setSuccessMessage] = React.useState("");
	const [form, setForm] = React.useState({
		name: "",
		email: "",
		password: "",
	});
	const router = useRouter();

	const { onRegister } = useAuth();

	React.useEffect(() => {
		checkingForm();
	});

	const checkingForm = async () => {
		if (form.name === "" || form.email === "" || form.password === "") {
			setDisable(true);
		} else {
			setDisable(false);
		}
	};

	const handleSubmit = async () => {
		setIsSubmit(true);
		setErrorMessage("");

		if (onRegister) {
			await onRegister!(form.name, form.email, form.password)
				.then((res) => {
					if (res.status === 201) {
						setErrorMessage("");
						setForm({
							name: "",
							email: "",
							password: "",
						});
						setSuccessMessage(res.data.message);
						setIsSubmit(false);
						setTimeout(() => {
							router.push("/sign-in");
						}, 1500);
					}
				})
				.catch((error) => {
					setErrorMessage(error.response.data.message);
					setIsSubmit(false);
				});
		} else {
			setErrorMessage("Registration function is not available.");
			setIsSubmit(false);
		}
	};

	const handleRoute = () => {
		router.push("/sign-in");
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
							Hello, Friend!
						</Text>

						<Text className="text-base text-center text-accent mt-2 font-bold">
							Create an account to get started
						</Text>
					</View>
					<InputField
						placeholder="Enter your name"
						title="Name:"
						value={form.name}
						handleChangeText={(e) => setForm({ ...form, name: e })}
						otherStyles="mt-10"
					/>

					<InputField
						placeholder="Enter your email"
						title="Email:"
						value={form.email}
						handleChangeText={(e: any) => setForm({ ...form, email: e })}
						otherStyles="mt-4"
					/>
					<InputField
						placeholder="Enter your password"
						title="Password:"
						value={form.password}
						handleChangeText={(e) => setForm({ ...form, password: e })}
						otherStyles="mt-4"
					/>

					<Text
						className={`text-lg text-red-500 font-semibold text-center py-1 px-4 ${
							errorMessage ? "block" : "hidden"
						}`}
					>
						{errorMessage}
					</Text>

					<Text
						className={`text-lg text-green-500 font-semibold text-center py-1 ${
							successMessage ? "block" : "hidden"
						}`}
					>
						{successMessage}
					</Text>
					<CustomButton
						handlePress={handleSubmit}
						textStyles=""
						title="Sign Up"
						disable={disable || isSubmit}
						containerStyles="mt-10 "
						submitting={isSubmit || isSubmit}
					/>

					<View className="flex justify-center pt-5 flex-row gap-2">
						<Text className="text-md text-accent font-regular">
							Have an account?
						</Text>
						<TouchableOpacity onPress={handleRoute}>
							<Text className="text-md font-semibold text-primary">
								Sign In
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
