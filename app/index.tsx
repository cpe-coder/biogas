"use client";

import { images } from "@/constant/images";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";

export default function Welcome() {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.replace("/Home");
		}, 2000);

		return () => clearTimeout(timer);
	}, [router]);

	return (
		<View className="flex-1 items-center justify-centerpx-8 bg-primary">
			<View className="flex flex-col gap-4 justify-center items-center bg-green-100 pr-1 pt-1 rounded-full">
				<Image
					className="w-[150px] h-[150px]"
					source={images.Logo}
					resizeMode="contain"
				/>
			</View>
			<Text className="font-bold text-xl text-[#fff] mt-10">AutoTrak</Text>
		</View>
	);
}
