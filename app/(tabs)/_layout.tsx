import { Settings } from "@/components";
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
				tabBarActiveTintColor: "#ff8903",
			}}
		>
			<Tabs.Screen
				name="Home"
				options={{
					title: "Home",

					headerRight: () => {
						return <Settings />;
					},
					headerStyle: { backgroundColor: "#fff" },
					headerTintColor: "#ff8903",
					tabBarIcon: ({ focused }) => (
						<FontAwesome6
							name="house"
							size={24}
							color={focused ? "#ff8903" : "#374151"}
							focusable={focused}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name="Logs"
				options={{
					title: "Logs",
					headerRight: () => {
						return <Settings />;
					},
					headerStyle: { backgroundColor: "#fff" },
					headerTintColor: "#ff8903",
					tabBarIcon: ({ focused }) => (
						<MaterialIcons
							name="article"
							size={28}
							color={focused ? "#ff8903" : "#374151"}
							focusable={focused}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
