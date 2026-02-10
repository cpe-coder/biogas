import { icon } from "@/constant/icons";
import { useAuth } from "@/context/auth-context";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
	launchImageLibraryAsync,
	useMediaLibraryPermissions,
} from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

export default function Settings() {
	const [visible, setVisible] = React.useState(false);
	const { userImage, userData, onLogout } = useAuth();
	const [mediaPermission, requestMediaPermission] =
		useMediaLibraryPermissions();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		setTimeout(() => {
			setRefreshing(false);
		}, 1000);
	}, []);

	const chooseFromLibrary = async () => {
		if (!mediaPermission?.granted) {
			requestMediaPermission();
		} else {
			let result = await launchImageLibraryAsync({
				mediaTypes: "livePhotos",
				allowsEditing: true,
				aspect: [5, 5],
			});
			await SecureStore.deleteItemAsync("image");
			if (!result.canceled) {
				await SecureStore.setItemAsync("image", result.assets[0].uri);
			}
			onRefresh();
		}
	};
	return (
		<View className=" bg-white ">
			<View className="flex w-full justify-center items-center ">
				<Image
					source={!userImage ? icon.User : { uri: userImage.image }}
					className="w-28 h-28 border border-primary rounded-full"
				/>

				<Text className="text-text py-5 font-bold text-2xl">
					{!userData ? "Ripe Sensei" : userData?.name}
				</Text>
			</View>
			<View className="py-2">
				<Pressable className="flex-row px-4 py-2 justify-start items-center gap-5 active:bg-gray-300/20 transition-all duration-300 active:transition-all active:duration-300">
					<View className="bg-red-500 rounded-full p-3">
						<MaterialIcons name="alternate-email" size={24} color="white" />
					</View>
					<View>
						<Text className=" text-lg text-text">Email Account</Text>
						<Text className="text-secondText text-xs">{userData?.email}</Text>
					</View>
				</Pressable>
				<Pressable
					onPress={() => chooseFromLibrary()}
					className="flex-row px-4 py-2 justify-start items-center gap-5 active:bg-gray-300/20 transition-all duration-300 active:transition-all active:duration-300"
				>
					<View className="bg-secondary rounded-full p-3">
						<Entypo name="camera" size={24} color="white" />
					</View>
					<Text className=" text-lg text-text">Change Profile Image</Text>
				</Pressable>
			</View>
			<View className=" px-4 mt-5 flex bottom-0 h-full">
				<TouchableOpacity
					onPress={onLogout}
					className="bg-primary w-full p-2 rounded-sm"
				>
					<Text className="text-center text-white font-medium">Logout</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
