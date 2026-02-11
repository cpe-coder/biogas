import { API_URL } from "@/context/auth-context";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	RefreshControl,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const formatManilaTime = (date: string | null) => {
	if (!date) return "-";
	return new Date(date).toLocaleString("en-PH", {
		timeZone: "Asia/Manila",
		year: "numeric",
		month: "long",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	});
};

const formatDate = (date: string | null) => {
	if (!date) return "-";
	return new Date(date).toLocaleDateString("en-PH", {
		timeZone: "Asia/Manila",
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
};

const formatTime = (date: string | null) => {
	if (!date) return "-";
	return new Date(date).toLocaleTimeString("en-PH", {
		timeZone: "Asia/Manila",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	});
};

const getPhStatus = (v: number) => {
	if (v < 6.0) return { label: "ACIDIC", color: "#ef4444", bg: "#3f1212" };
	if (v < 6.5) return { label: "LOW", color: "#f59e0b", bg: "#3b2a06" };
	if (v <= 7.5) return { label: "OPTIMAL", color: "#22c55e", bg: "#0f2e1a" };
	if (v <= 8.5) return { label: "HIGH", color: "#f59e0b", bg: "#3b2a06" };
	return { label: "ALKALINE", color: "#ef4444", bg: "#3f1212" };
};

const getGasLeakStatus = (v: number) => {
	if (v >= 90) return { label: "CRITICAL", color: "#ef4444", bg: "#3f1212" };
	if (v >= 70) return { label: "WARNING", color: "#f59e0b", bg: "#3b2a06" };
	return { label: "NORMAL", color: "#22c55e", bg: "#0f2e1a" };
};

const getGasLevelStatus = (v: number) => {
	if (v < 20) return { label: "LOW", color: "#ef4444", bg: "#3f1212" };
	if (v > 95) return { label: "FULL", color: "#3b82f6", bg: "#0f1e3b" };
	return { label: "OK", color: "#22c55e", bg: "#0f2e1a" };
};

const getFlowStatus = (v: number) => {
	if (v === 0) return { label: "STOPPED", color: "#ef4444", bg: "#3f1212" };
	if (v < 30) return { label: "LOW", color: "#f59e0b", bg: "#3b2a06" };
	return { label: "FLOWING", color: "#22c55e", bg: "#0f2e1a" };
};

const MiniBar = ({
	value,
	color,
	max = 100,
}: {
	value: number;
	color: string;
	max?: number;
}) => (
	<View
		style={{
			height: 4,
			backgroundColor: "#1e293b",
			borderRadius: 2,
			marginTop: 4,
			overflow: "hidden",
		}}
	>
		<View
			style={{
				width: `${Math.min((value / max) * 100, 100)}%`,
				height: "100%",
				backgroundColor: color,
				borderRadius: 2,
			}}
		/>
	</View>
);

const MetricRow = ({
	icon,
	label,
	value,
	unit,
	status,
	showBar = false,
	barMax = 100,
}: {
	icon: string;
	label: string;
	value: number;
	unit: string;
	status: { label: string; color: string; bg: string };
	showBar?: boolean;
	barMax?: number;
}) => (
	<View
		style={{
			marginBottom: 10,
		}}
	>
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
			}}
		>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
				<Text style={{ fontSize: 13 }}>{icon}</Text>
				<Text
					style={{
						color: "#94a3b8",
						fontSize: 11,
						fontWeight: "600",
						letterSpacing: 0.5,
						textTransform: "uppercase",
					}}
				>
					{label}
				</Text>
			</View>

			<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
				<Text
					style={{
						color: "#f1f5f9",
						fontSize: 14,
						fontWeight: "700",
					}}
				>
					{typeof value === "number" ? value.toFixed(2) : value}
					<Text style={{ color: "#64748b", fontSize: 11 }}> {unit}</Text>
				</Text>
				<View
					style={{
						backgroundColor: status.bg,
						borderRadius: 4,
						paddingHorizontal: 6,
						paddingVertical: 2,
						borderWidth: 1,
						borderColor: status.color + "40",
					}}
				>
					<Text
						style={{
							color: status.color,
							fontSize: 9,
							fontWeight: "700",
							letterSpacing: 0.8,
						}}
					>
						{status.label}
					</Text>
				</View>
			</View>
		</View>

		{showBar && <MiniBar value={value} color={status.color} max={barMax} />}
	</View>
);

const LogCard = ({ log, index }: { log: any; index: number }) => {
	const [expanded, setExpanded] = useState(false);

	const phStatus = getPhStatus(log.ph ?? 0);
	const leak1Status = getGasLeakStatus(log.gasLeak1 ?? 0);
	const leak2Status = getGasLeakStatus(log.gasLeak2 ?? 0);
	const levelStatus = getGasLevelStatus(log.gasLevel ?? 0);
	const flowStatus = getFlowStatus(log.gasFlow ?? 0);

	const hasAlert = [leak1Status, leak2Status].some(
		(s) => s.label === "CRITICAL",
	);
	const hasWarning =
		!hasAlert &&
		[phStatus, leak1Status, leak2Status, levelStatus, flowStatus].some(
			(s) =>
				s.label !== "OPTIMAL" &&
				s.label !== "OK" &&
				s.label !== "FLOWING" &&
				s.label !== "FULL",
		);

	const borderColor = hasAlert ? "#ef4444" : hasWarning ? "#f59e0b" : "#22c55e";

	return (
		<View
			style={{
				backgroundColor: "#0f172a",
				borderRadius: 14,
				marginBottom: 12,
				overflow: "hidden",
				borderWidth: 1,
				borderColor: borderColor + "30",
			}}
		>
			<View
				style={{
					position: "absolute",
					left: 0,
					top: 0,
					bottom: 0,
					width: 3,
					backgroundColor: borderColor,
					borderTopLeftRadius: 14,
					borderBottomLeftRadius: 14,
				}}
			/>

			<TouchableOpacity
				onPress={() => setExpanded((p) => !p)}
				activeOpacity={0.8}
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					paddingHorizontal: 16,
					paddingLeft: 20,
					paddingVertical: 12,
				}}
			>
				{/* Log number + timestamp */}
				<View style={{ flex: 1 }}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: 8,
							marginBottom: 2,
						}}
					>
						<View
							style={{
								backgroundColor: "#1e293b",
								borderRadius: 6,
								paddingHorizontal: 7,
								paddingVertical: 2,
							}}
						>
							<Text
								style={{
									color: "#64748b",
									fontSize: 10,
									fontWeight: "700",
									letterSpacing: 0.5,
								}}
							>
								#{String(index + 1).padStart(3, "0")}
							</Text>
						</View>
						{hasAlert && (
							<View
								style={{
									backgroundColor: "#3f1212",
									borderRadius: 5,
									paddingHorizontal: 6,
									paddingVertical: 1,
								}}
							>
								<Text
									style={{ color: "#ef4444", fontSize: 9, fontWeight: "700" }}
								>
									⚠ ALERT
								</Text>
							</View>
						)}
						{hasWarning && !hasAlert && (
							<View
								style={{
									backgroundColor: "#3b2a06",
									borderRadius: 5,
									paddingHorizontal: 6,
									paddingVertical: 1,
								}}
							>
								<Text
									style={{ color: "#f59e0b", fontSize: 9, fontWeight: "700" }}
								>
									⚠ WARNING
								</Text>
							</View>
						)}
					</View>
					<Text style={{ color: "#94a3b8", fontSize: 11, marginBottom: 1 }}>
						{formatDate(log.createdAt)}
					</Text>
					<Text style={{ color: "#475569", fontSize: 10 }}>
						{formatTime(log.createdAt)}
					</Text>
				</View>

				{/* Quick summary pills */}
				<View style={{ alignItems: "flex-end", gap: 4 }}>
					<View style={{ flexDirection: "row", gap: 4 }}>
						<View
							style={{
								backgroundColor: phStatus.bg,
								borderRadius: 4,
								paddingHorizontal: 6,
								paddingVertical: 2,
							}}
						>
							<Text
								style={{
									color: phStatus.color,
									fontSize: 9,
									fontWeight: "700",
								}}
							>
								PH {(log.ph ?? 0).toFixed(1)}
							</Text>
						</View>
						<View
							style={{
								backgroundColor: levelStatus.bg,
								borderRadius: 4,
								paddingHorizontal: 6,
								paddingVertical: 2,
							}}
						>
							<Text
								style={{
									color: levelStatus.color,
									fontSize: 9,
									fontWeight: "700",
								}}
							>
								LVL {log.gasLevel ?? 0}%
							</Text>
						</View>
					</View>
					<Text style={{ color: "#334155", fontSize: 18, marginTop: 2 }}>
						{expanded ? "▲" : "▼"}
					</Text>
				</View>
			</TouchableOpacity>

			{/* Expanded detail */}
			{expanded && (
				<View
					style={{
						paddingHorizontal: 20,
						paddingBottom: 14,
						borderTopWidth: 1,
						borderTopColor: "#1e293b",
					}}
				>
					<View style={{ height: 10 }} />
					<MetricRow
						icon="🧪"
						label="PH Level"
						value={log.ph ?? 0}
						unit="pH"
						status={phStatus}
						showBar
						barMax={14}
					/>
					<MetricRow
						icon="💨"
						label="Gas Leak Sensor 1"
						value={log.gasLeak1 ?? 0}
						unit="%"
						status={leak1Status}
						showBar
					/>
					<MetricRow
						icon="💨"
						label="Gas Leak Sensor 2"
						value={log.gasLeak2 ?? 0}
						unit="%"
						status={leak2Status}
						showBar
					/>
					<MetricRow
						icon="🔄"
						label="Gas Flow"
						value={log.gasFlow ?? 0}
						unit="%"
						status={flowStatus}
						showBar
					/>
					<MetricRow
						icon="🛢️"
						label="Gas Level (Tank)"
						value={log.gasLevel ?? 0}
						unit="%"
						status={levelStatus}
						showBar
					/>

					<View
						style={{
							marginTop: 8,
							paddingTop: 8,
							borderTopWidth: 1,
							borderTopColor: "#1e293b",
						}}
					>
						<Text style={{ color: "#334155", fontSize: 10 }}>
							🕐 {formatManilaTime(log.createdAt)}
						</Text>
					</View>
				</View>
			)}
		</View>
	);
};

export default function Logs() {
	const [logs, setLogs] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const fetchLogs = async (isRefresh = false) => {
		if (isRefresh) setRefreshing(true);
		try {
			const res = await axios.get(`${API_URL}/api/showLogs`);
			setLogs(res.data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchLogs();
	}, []);

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: "#060e1f" }}
			contentContainerStyle={{
				paddingHorizontal: 16,
				paddingTop: 24,
				paddingBottom: 32,
			}}
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={() => fetchLogs(true)}
					tintColor="#22c55e"
					colors={["#22c55e"]}
				/>
			}
		>
			<View style={{ marginBottom: 20 }}>
				<Text
					style={{
						color: "#f1f5f9",
						fontSize: 22,
						fontWeight: "800",
						letterSpacing: -0.5,
					}}
				>
					Data Logs
				</Text>
				<Text style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>
					{logs.length} record{logs.length !== 1 ? "s" : ""} · Pull to refresh
				</Text>
			</View>

			<View
				style={{
					flexDirection: "row",
					gap: 12,
					marginBottom: 16,
					flexWrap: "wrap",
				}}
			>
				{[
					{ color: "#22c55e", label: "Normal" },
					{ color: "#f59e0b", label: "Warning" },
					{ color: "#ef4444", label: "Alert" },
				].map((item) => (
					<View
						key={item.label}
						style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
					>
						<View
							style={{
								width: 8,
								height: 8,
								borderRadius: 4,
								backgroundColor: item.color,
							}}
						/>
						<Text style={{ color: "#64748b", fontSize: 11 }}>{item.label}</Text>
					</View>
				))}
			</View>

			{loading ? (
				<View style={{ alignItems: "center", marginTop: 60 }}>
					<ActivityIndicator size="large" color="#22c55e" />
					<Text style={{ color: "#475569", fontSize: 13, marginTop: 12 }}>
						Fetching logs...
					</Text>
				</View>
			) : logs.length === 0 ? (
				<View
					style={{
						alignItems: "center",
						marginTop: 60,
						backgroundColor: "#0f172a",
						borderRadius: 16,
						padding: 32,
					}}
				>
					<Text style={{ fontSize: 32, marginBottom: 12 }}>📋</Text>
					<Text
						style={{
							color: "#475569",
							fontSize: 14,
							textAlign: "center",
						}}
					>
						No logs found.{"\n"}Data is saved daily at midnight.
					</Text>
				</View>
			) : (
				logs.map((log, index) => (
					<LogCard key={index} log={log} index={index} />
				))
			)}
		</ScrollView>
	);
}
