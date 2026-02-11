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
import {
	Image,
	Pressable,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function Settings() {
	const [visible, setVisible] = React.useState(false);
	const { userImage, userData, onLogout } = useAuth();
	const [mediaPermission, requestMediaPermission] =
		useMediaLibraryPermissions();
	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		setTimeout(() => setRefreshing(false), 1000);
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
		<ScrollView
			style={{ flex: 1, backgroundColor: "#060e1f" }}
			contentContainerStyle={{ paddingBottom: 40 }}
			showsVerticalScrollIndicator={false}
		>
			{/* ── Hero / Avatar section ── */}
			<View
				style={{
					alignItems: "center",
					paddingTop: 48,
					paddingBottom: 32,
					paddingHorizontal: 24,
				}}
			>
				{/* Avatar with green ring */}
				<View
					style={{
						width: 104,
						height: 104,
						borderRadius: 52,
						padding: 3,
						backgroundColor: "#22c55e",
						marginBottom: 14,
						shadowColor: "#22c55e",
						shadowOffset: { width: 0, height: 0 },
						shadowOpacity: 0.5,
						shadowRadius: 16,
						elevation: 10,
					}}
				>
					<Image
						source={!userImage ? icon.User : { uri: userImage.image }}
						style={{
							width: "100%",
							height: "100%",
							borderRadius: 50,
							backgroundColor: "#0f172a",
						}}
					/>

					{/* Online dot */}
					<View
						style={{
							position: "absolute",
							bottom: 4,
							right: 4,
							width: 14,
							height: 14,
							borderRadius: 7,
							backgroundColor: "#22c55e",
							borderWidth: 2,
							borderColor: "#060e1f",
						}}
					/>
				</View>

				{/* Name */}
				<Text
					style={{
						color: "#f1f5f9",
						fontSize: 22,
						fontWeight: "800",
						letterSpacing: -0.4,
						marginBottom: 4,
					}}
				>
					{userData?.name ?? "Ripe Sensei"}
				</Text>

				{/* Role badge */}
				<View
					style={{
						backgroundColor: "#0f2e1a",
						borderRadius: 20,
						paddingHorizontal: 12,
						paddingVertical: 4,
						borderWidth: 1,
						borderColor: "#22c55e40",
					}}
				>
					<Text
						style={{
							color: "#22c55e",
							fontSize: 11,
							fontWeight: "700",
							letterSpacing: 1,
							textTransform: "uppercase",
						}}
					>
						● Operator
					</Text>
				</View>
			</View>

			{/* ── Divider ── */}
			<View
				style={{
					height: 1,
					backgroundColor: "#0f172a",
					marginHorizontal: 20,
					marginBottom: 20,
				}}
			/>

			{/* ── Section label ── */}
			<Text
				style={{
					color: "#334155",
					fontSize: 10,
					fontWeight: "700",
					letterSpacing: 1.5,
					textTransform: "uppercase",
					paddingHorizontal: 20,
					marginBottom: 10,
				}}
			>
				Account
			</Text>

			{/* ── Settings rows ── */}
			<View
				style={{
					marginHorizontal: 16,
					backgroundColor: "#0f172a",
					borderRadius: 16,
					overflow: "hidden",
					borderWidth: 1,
					borderColor: "#1e293b",
				}}
			>
				{/* Email row — non-interactive info */}
				<View className="flex flex-row items-center px-4 py-4">
					<View
						style={{
							width: 40,
							height: 40,
							borderRadius: 12,
							backgroundColor: "#3f1212",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
						}}
					>
						<MaterialIcons name="alternate-email" size={20} color="#ef4444" />
					</View>
					<View style={{ flex: 1, marginLeft: 14 }}>
						<Text style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>
							Email Account
						</Text>
						<Text
							style={{
								color: "#f1f5f9",
								fontSize: 14,
								fontWeight: "600",
							}}
							numberOfLines={1}
						>
							{userData?.email ?? "—"}
						</Text>
					</View>
					{/* Lock icon to indicate read-only */}
					<MaterialIcons name="lock-outline" size={16} color="#334155" />
				</View>

				{/* Separator */}
				<View
					style={{
						marginHorizontal: 16,
						backgroundColor: "#0f172a",
						borderRadius: 16,
						overflow: "hidden",
						borderWidth: 1,
						borderColor: "#1e293b",
					}}
				/>

				<Pressable
					className="flex flex-row items-center px-4 py-4"
					onPress={chooseFromLibrary}
					android_ripple={{ color: "#1e293b" }}
					style={({ pressed }) => ({
						backgroundColor: pressed ? "#1e293b" : "transparent",
					})}
				>
					<View
						style={{
							width: 40,
							height: 40,
							borderRadius: 12,
							backgroundColor: "#0f1e3b",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
						}}
					>
						<Entypo name="camera" size={20} color="#3b82f6" />
					</View>
					<View style={{ flex: 1, marginLeft: 14 }}>
						<Text
							style={{
								color: "#f1f5f9",
								fontSize: 14,
								fontWeight: "600",
							}}
						>
							Change Profile Image
						</Text>
						<Text style={{ color: "#475569", fontSize: 11, marginTop: 1 }}>
							Choose from your photo library
						</Text>
					</View>
					<MaterialIcons name="chevron-right" size={20} color="#334155" />
				</Pressable>
			</View>

			{/* ── Section label ── */}
			<Text
				style={{
					color: "#334155",
					fontSize: 10,
					fontWeight: "700",
					letterSpacing: 1.5,
					textTransform: "uppercase",
					paddingHorizontal: 20,
					marginTop: 24,
					marginBottom: 10,
				}}
			>
				System
			</Text>

			{/* ── App info card ── */}
			<View
				style={{
					marginHorizontal: 16,
					backgroundColor: "#0f172a",
					borderRadius: 16,
					overflow: "hidden",
					borderWidth: 1,
					borderColor: "#1e293b",
					marginBottom: 28,
				}}
			>
				<View className="flex flex-row items-center px-4 py-4">
					<View
						style={{
							width: 40,
							height: 40,
							borderRadius: 12,
							backgroundColor: "#0f2e1a",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
						}}
					>
						<MaterialIcons name="info-outline" size={20} color="#22c55e" />
					</View>
					<View style={{ flex: 1, marginLeft: 14 }}>
						<Text style={{ color: "#94a3b8", fontSize: 11, marginBottom: 2 }}>
							App Version
						</Text>
						<Text
							style={{
								color: "#f1f5f9",
								fontSize: 14,
								fontWeight: "600",
							}}
						>
							Biogas Monitor v1.0.0
						</Text>
					</View>
				</View>
			</View>

			{/* ── Logout button ── */}
			<View style={{ paddingHorizontal: 16 }}>
				<TouchableOpacity
					onPress={onLogout}
					activeOpacity={0.8}
					style={{
						backgroundColor: "#3f1212",
						borderRadius: 14,
						paddingVertical: 15,
						alignItems: "center",
						borderWidth: 1,
						borderColor: "#ef444440",
						flexDirection: "row",
						justifyContent: "center",
					}}
				>
					<MaterialIcons
						name="logout"
						size={18}
						color="#ef4444"
						style={{ marginRight: 8 }}
					/>
					<Text
						style={{
							color: "#ef4444",
							fontSize: 15,
							fontWeight: "700",
							letterSpacing: 0.3,
						}}
					>
						Log Out
					</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}
