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
					backgroundColor: "#0d1424",
					borderTopWidth: 0,
				},
				tabBarInactiveTintColor: "#fff",
				tabBarActiveTintColor: "#3B82F6",
			}}
		>
			<Tabs.Screen
				name="Home"
				options={{
					title: "Home",
					headerStyle: {
						backgroundColor: "#0d1424",
					},
					headerTintColor: "#fff",
					tabBarIcon: ({ focused }) => (
						<FontAwesome6
							name="house"
							size={24}
							color={focused ? "#3B82F6" : "#fff"}
							focusable={focused}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="Logs"
				options={{
					title: "Logs",

					headerStyle: { backgroundColor: "#0d1424" },
					headerTintColor: "#fff",
					tabBarIcon: ({ focused }) => (
						<MaterialIcons
							name="article"
							size={28}
							color={focused ? "#3B82F6" : "#fff"}
							focusable={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="Settings"
				options={{
					title: "Settings",

					headerStyle: { backgroundColor: "#0d1424" },
					headerTintColor: "#fff",
					tabBarIcon: ({ focused }) => (
						<MaterialIcons
							name="settings"
							size={28}
							color={focused ? "#3B82F6" : "#fff"}
							focusable={focused}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
