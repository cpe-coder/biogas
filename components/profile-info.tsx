import { images } from "@/constant/images";
import React from "react";
import { Image, Text, View } from "react-native";

const ProfileInfo = () => {
	return (
		<View className=" flex-row justify-center px-4 items-center gap-5 py-8 border-b border-secondary mb-4">
			<Image
				source={images.Logo}
				alt="logo"
				className="w-20 h-20 rounded-full"
			/>
			<View className="flex flex-row gap-2 items-center">
				<Text className="text-primary font-bold text-4xl italic">RIPE</Text>
				<Text className="text-secondary font-bold text-4xl italic">SENSEI</Text>
			</View>
		</View>
	);
};

export default ProfileInfo;
