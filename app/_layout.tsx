import { AuthProvider } from "@/context/auth-context";
import { Stack } from "expo-router";
import React from "react";
import "../global.css";

export default function RootLayout() {
	return (
		<AuthProvider>
			<Stack>
				<Stack.Screen
					name="(tabs)"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="(auth)"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="index"
					options={{
						headerShown: false,
					}}
				/>
			</Stack>
		</AuthProvider>
	);
}
