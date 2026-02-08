import { useAuth } from "@/context/auth-context";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Settings from "./settings";

const Logout = () => {
	const { onLogout } = useAuth();
	return (
		<View className="flex-row items-center justify-between mt-auto mb-4 py-4 px-3">
			<Pressable
				onPress={onLogout}
				className="active:bg-gray-200/20 focus:bg-gray-200/30 py-4 rounded-lg px-6 w-fit"
			>
				<Text className="text-center text-white items-center">Logout</Text>
			</Pressable>
			<Settings />
		</View>
	);
};

export default Logout;
