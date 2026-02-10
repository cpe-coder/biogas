import { useAuth } from "@/context/auth-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Redirect, Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
	const { authState } = useAuth();
	const [isAuthenticated, setIsAuthenticated] = React.useState(false);

	React.useEffect(() => {
		setIsAuthenticated(!authState?.authenticated);
	}, [authState]);

	if (isAuthenticated) {
		return <Redirect href="../sign-in" />;
	}

	return (
		<Tabs
			screenOptions={{
				headerShadowVisible: false,
				tabBarStyle: {
					backgroundColor: "#fff",
					borderTopWidth: 0,
				},
				tabBarInactiveTintColor: "#374151",
				tabBarActiveTintColor: "#1E40AF",
			}}
		>
			<Tabs.Screen
				name="Home"
				options={{
					title: "Home",
					headerStyle: {
						backgroundColor: "#fff",
					},
					headerTintColor: "#1E40AF",
					tabBarIcon: ({ focused }) => (
						<FontAwesome6
							name="house"
							size={24}
							color={focused ? "#1E40AF" : "#374151"}
							focusable={focused}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="Logs"
				options={{
					title: "Logs",

					headerStyle: { backgroundColor: "60A5FA" },
					headerTintColor: "#1E40AF",
					tabBarIcon: ({ focused }) => (
						<MaterialIcons
							name="article"
							size={28}
							color={focused ? "#1E40AF" : "#374151"}
							focusable={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="Settings"
				options={{
					title: "Settings",

					headerStyle: { backgroundColor: "#fff" },
					headerTintColor: "#1E40AF",
					tabBarIcon: ({ focused }) => (
						<MaterialIcons
							name="settings"
							size={28}
							color={focused ? "#1E40AF" : "#374151"}
							focusable={focused}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
