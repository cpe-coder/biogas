import { API_URL } from "@/context/auth-context";
import { sendNotification } from "@/lib/notifications";
import database from "@/utils/firebase.config";
import axios from "axios";
import { onValue, ref } from "firebase/database";
import moment from "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, ScrollView, Text, View } from "react-native";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";

const getManilaTimestamp = () => moment().tz("Asia/Manila").toISOString();
export default function Home() {
	const [ph, setPh] = useState(0);
	const [gasFlow, setGasFlow] = useState(0);
	const [gasLevel, setGasLevel] = useState(0);
	const [gas1, setGas1] = useState(0);
	const [gas2, setGas2] = useState(0);

	useEffect(() => {
		const unsubs = [
			onValue(ref(database, "sensors/ph"), (s) => setPh(+s.val() || 0)),
			onValue(ref(database, "sensors/gasFlow"), (s) =>
				setGasFlow(+s.val() || 0),
			),
			onValue(ref(database, "sensors/gasLevel"), (s) =>
				setGasLevel(+s.val() || 0),
			),
			onValue(ref(database, "sensors/gasLeak1"), (s) => setGas1(+s.val() || 0)),
			onValue(ref(database, "sensors/gasLeak2"), (s) => setGas2(+s.val() || 0)),
		];
		return () => unsubs.forEach((u) => u());
	}, []);

	const lastAlert = React.useRef<Record<string, boolean>>({});

	const notifyOnce = async (key: string, title: string, message: string) => {
		if (lastAlert.current[key]) return;
		lastAlert.current[key] = true;
		await sendNotification(title, message);
	};

	useEffect(() => {
		if (ph < 6.0)
			notifyOnce(
				"ph_low",
				"🚨 PH Critical",
				"Slurry PH is dangerously acidic!",
			);

		if (ph > 8.5)
			notifyOnce(
				"ph_high",
				"🚨 PH Critical",
				"Slurry PH is dangerously alkaline!",
			);

		if (gas1 >= 90)
			notifyOnce(
				"gas1_critical",
				"🚨 Gas Leak Detected",
				"Gas Leak Sensor 1 is CRITICAL",
			);

		if (gas2 >= 90)
			notifyOnce(
				"gas2_critical",
				"🚨 Gas Leak Detected",
				"Gas Leak Sensor 2 is CRITICAL",
			);

		if (gas1 >= 70 && gas1 < 90)
			notifyOnce(
				"gas1_warning",
				"⚠ Gas Leak Warning",
				"Gas Leak Sensor 1 is rising",
			);

		if (gas2 >= 70 && gas2 < 90)
			notifyOnce(
				"gas2_warning",
				"⚠ Gas Leak Warning",
				"Gas Leak Sensor 2 is rising",
			);

		if (gasLevel < 20)
			notifyOnce("tank_low", "⚠ Gas Level Low", "Gas tank is below 20%");

		if (gasLevel > 95)
			notifyOnce("tank_full", "⚠ Gas Tank Full", "Gas tank is almost full");

		if (gasFlow === 0)
			notifyOnce("flow_zero", "⚠ Gas Flow Stopped", "No gas flow detected");
	}, [ph, gas1, gas2, gasLevel, gasFlow]);

	useEffect(() => {
		if (ph >= 6.5 && ph <= 7.5) {
			delete lastAlert.current.ph_low;
			delete lastAlert.current.ph_high;
		}

		if (gas1 < 70) {
			delete lastAlert.current.gas1_warning;
			delete lastAlert.current.gas1_critical;
		}

		if (gas2 < 70) {
			delete lastAlert.current.gas2_warning;
			delete lastAlert.current.gas2_critical;
		}

		if (gasLevel >= 20 && gasLevel <= 95) {
			delete lastAlert.current.tank_low;
			delete lastAlert.current.tank_full;
		}

		if (gasFlow > 0) {
			delete lastAlert.current.flow_zero;
		}
	}, [ph, gas1, gas2, gasLevel, gasFlow]);

	const snapTo10 = (value: number) => Math.round(value / 10) * 10;

	const gasStatus = (v: number) => {
		if (v >= 90) return "bg-red-600";
		if (v >= 70) return "bg-yellow-400";
		return "bg-green-500";
	};

	useEffect(() => {
		const interval = setInterval(() => {
			const now = moment().tz("Asia/Manila");
			if (now.hour() === 0 && now.minute() === 0) {
				saveDailyLog();
			}
		}, 60000); // every minute

		return () => clearInterval(interval);
	}, [ph, gas1, gas2, gasFlow, gasLevel]);

	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 		console.log(
	// 			"⏱ Saving daily log for testing at",
	// 			moment().tz("Asia/Manila").format("HH:mm:ss"),
	// 		);
	// 		saveDailyLog();
	// 	}, 60000);

	// 	return () => clearInterval(interval);
	// });

	const saveDailyLog = async () => {
		try {
			await axios.post(`${API_URL}/api/saveLogs`, {
				ph,
				gasLeak1: gas1,
				gasLeak2: gas2,
				gasFlow,
				gasLevel,
				createdAt: getManilaTimestamp(),
			});
			console.log("✅ Daily log saved at", getManilaTimestamp());
		} catch (err) {
			console.error("❌ Failed to save daily log:", err);
		}
	};

	const GasFlowGauge = ({ value }: { value: number }) => {
		const snapped = snapTo10(value);

		const size = 220;
		const cx = size / 2;
		const cy = size / 2;
		const R = 85;
		const needleLen = 70;

		const targetAngle = (snapped / 100) * 180 - 90; // -90 to +90
		const animatedAngle = useRef(new Animated.Value(-90)).current;

		useEffect(() => {
			Animated.timing(animatedAngle, {
				toValue: targetAngle,
				duration: 500,
				useNativeDriver: true,
				easing: Easing.out(Easing.cubic),
			}).start();
		}, [targetAngle]);

		const rotate = animatedAngle.interpolate({
			inputRange: [-90, 90],
			outputRange: ["-90deg", "90deg"],
		});

		const startX = cx - R;
		const startY = cy;
		const endX = cx + R;
		const endY = cy;
		const arcPath = `M ${startX} ${startY} A ${R} ${R} 0 1 1 ${endX} ${endY}`;

		const ticks = Array.from({ length: 11 }, (_, i) => i * 10);
		const tickData = ticks.map((t) => {
			const angleDeg = 180 - (t / 100) * 180;
			const angleRad = (angleDeg * Math.PI) / 180;
			const innerR = R - 8;
			const outerR = R + 2;
			const labelR = R + 18;
			return {
				label: `${t}`,
				x1: cx + innerR * Math.cos(angleRad),
				y1: cy - innerR * Math.sin(angleRad),
				x2: cx + outerR * Math.cos(angleRad),
				y2: cy - outerR * Math.sin(angleRad),
				lx: cx + labelR * Math.cos(angleRad),
				ly: cy - labelR * Math.sin(angleRad),
			};
		});

		return (
			<View
				style={{
					alignItems: "center",
					padding: 16,
					backgroundColor: "#0f172a",
					borderRadius: 16,
				}}
			>
				<Text style={{ color: "#cbd5e1", marginBottom: 4 }}>Gas Flow</Text>

				<View style={{ width: size, height: size / 2 + 30 }}>
					<Svg
						width={size}
						height={size / 2 + 30}
						viewBox={`0 0 ${size} ${size / 2 + 30}`}
					>
						<Path
							d={arcPath}
							fill="none"
							stroke="#334155"
							strokeWidth={8}
							strokeLinecap="round"
						/>

						{tickData.map((t) => (
							<Line
								key={t.label}
								x1={t.x1}
								y1={t.y1}
								x2={t.x2}
								y2={t.y2}
								stroke="#64748b"
								strokeWidth={1.5}
							/>
						))}

						{tickData.map((t) => (
							<SvgText
								key={`lbl-${t.label}`}
								x={t.lx}
								y={t.ly + 4}
								fill="#94a3b8"
								fontSize={9}
								textAnchor="middle"
							>
								{t.label}
							</SvgText>
						))}

						<Circle cx={cx} cy={cy} r={6} fill="#94a3b8" />
					</Svg>

					<Animated.View
						style={{
							position: "absolute",
							bottom: 30,
							left: cx - 1.5,
							width: 3,
							height: needleLen,
							backgroundColor: "#4ade80",
							borderRadius: 2,
							transform: [
								{ translateY: needleLen / 2 },
								{ rotate },
								{ translateY: -(needleLen / 2) },
							],
						}}
					/>
				</View>

				<Text
					style={{
						color: "#4ade80",
						fontSize: 24,
						fontWeight: "bold",
						marginTop: 4,
					}}
				>
					{snapped}%
				</Text>
				<Text style={{ color: "#cbd5e1", fontSize: 12 }}>Steps: 10%</Text>
			</View>
		);
	};

	const GasMeter = ({ value }: { value: number }) => {
		const snapped = snapTo10(value);
		const size = 220;
		const cx = size / 2;
		const cy = size / 2;
		const R = 80;
		const needleLen = 65;

		const toRad = (deg: number) => (deg * Math.PI) / 180;

		const polarToCart = (deg: number, r: number) => ({
			x: cx + r * Math.sin(toRad(deg)),
			y: cy - r * Math.cos(toRad(deg)),
		});

		const arcStartDeg = 135;
		const s = polarToCart(arcStartDeg, R);
		const e = polarToCart(arcStartDeg + 270, R);
		const arcPath = `M ${s.x} ${s.y} A ${R} ${R} 0 1 1 ${e.x} ${e.y}`;

		const tickData = Array.from({ length: 11 }, (_, i) => {
			const t = i * 10;
			const deg = arcStartDeg + (t / 100) * 270;
			return {
				label: `${t}`,
				inner: polarToCart(deg, R - 8),
				outer: polarToCart(deg, R + 2),
				lbl: polarToCart(deg, R + 18),
			};
		});

		const targetAngle = arcStartDeg + (snapped / 100) * 270;
		const animatedAngle = useRef(new Animated.Value(arcStartDeg)).current;

		useEffect(() => {
			Animated.timing(animatedAngle, {
				toValue: targetAngle,
				duration: 500,
				useNativeDriver: true,
				easing: Easing.out(Easing.cubic),
			}).start();
		}, [targetAngle]);

		const rotate = animatedAngle.interpolate({
			inputRange: [arcStartDeg, arcStartDeg + 270],
			outputRange: [`${arcStartDeg}deg`, `${arcStartDeg + 270}deg`],
		});

		return (
			<View
				style={{
					alignItems: "center",
					padding: 16,
					backgroundColor: "#0f172a",
					borderRadius: 16,
				}}
			>
				<Text style={{ color: "#cbd5e1", marginBottom: 4 }}>
					Gas Meter (Tank Level)
				</Text>

				<View style={{ width: size, height: size }}>
					<Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
						<Path
							d={arcPath}
							fill="none"
							stroke="#334155"
							strokeWidth={8}
							strokeLinecap="round"
						/>

						{tickData.map((t) => (
							<Line
								key={t.label}
								x1={t.inner.x}
								y1={t.inner.y}
								x2={t.outer.x}
								y2={t.outer.y}
								stroke="#64748b"
								strokeWidth={1.5}
							/>
						))}

						{tickData.map((t) => (
							<SvgText
								key={`lbl-${t.label}`}
								x={t.lbl.x}
								y={t.lbl.y + 4}
								fill="#94a3b8"
								fontSize={9}
								textAnchor="middle"
							>
								{t.label}
							</SvgText>
						))}

						<Circle cx={cx} cy={cy} r={7} fill="#94a3b8" />
					</Svg>

					<Animated.View
						style={{
							position: "absolute",
							top: cy - needleLen,
							left: cx - 1.5,
							width: 3,
							height: needleLen,
							backgroundColor: "#ef4444",
							borderRadius: 2,
							transform: [
								{ translateY: needleLen / 2 },
								{ rotate },
								{ translateY: -(needleLen / 2) },
							],
						}}
					/>
				</View>

				<Text
					style={{
						color: "#22c55e",
						fontSize: 24,
						fontWeight: "bold",
						marginTop: 4,
					}}
				>
					{snapped}%
				</Text>
				<Text style={{ color: "#cbd5e1", fontSize: 12 }}>
					0% (Empty) — 100% (Full)
				</Text>
			</View>
		);
	};

	const GasLeakCard = ({ label, value }: any) => (
		<View className={`rounded-xl p-4 ${gasStatus(value)}`}>
			<Text className="text-white text-sm">{label}</Text>
			<Text className="text-white text-2xl font-bold">{value}%</Text>
			{value >= 90 && (
				<Text className="text-white text-xs mt-1 font-semibold">
					⚠ CRITICAL GAS LEAK
				</Text>
			)}
		</View>
	);

	const getPhStatus = (value: number) => {
		if (value < 6.0) return { label: "STRONG ACIDIC", bg: "bg-red-600" };

		if (value < 6.5) return { label: "ACIDIC", bg: "bg-yellow-400" };

		if (value <= 7.5) return { label: "OPTIMAL", bg: "bg-green-500" };

		if (value <= 8.5) return { label: "ALKALINE", bg: "bg-yellow-400" };

		return { label: "STRONG ALKALINE", bg: "bg-red-600" };
	};

	const PhLevelCard = ({ value }: { value: number }) => {
		const status = getPhStatus(value);

		return (
			<View className={`rounded-xl p-4 ${status.bg}`}>
				<Text className="text-white text-sm">Slurry PH Level</Text>

				<Text className="text-white text-3xl font-bold">
					{value.toFixed(2)}
				</Text>

				<Text className="text-white text-xs mt-1">Status: {status.label}</Text>

				<View className="flex-row justify-between mt-2">
					<Text className="text-white/80 text-xs">0 (Acid)</Text>
					<Text className="text-white/80 text-xs">7 (Neutral)</Text>
					<Text className="text-white/80 text-xs">14 (Base)</Text>
				</View>

				<Text className="text-white/70 text-xs mt-1">
					Optimal biogas range: 6.5 – 7.5
				</Text>
			</View>
		);
	};

	return (
		<ScrollView
			className="flex-1 bg-[#060e1f]"
			contentContainerStyle={{ paddingBottom: 24 }}
			showsVerticalScrollIndicator={false}
		>
			<View className="flex-1 bg-[#060e1f] px-4 pt-6 gap-4">
				<Text className="text-xl font-bold text-secondary">
					Biogas Monitoring Dashboard
				</Text>

				<PhLevelCard value={ph} />

				<View className="flex-row gap-4">
					<View className="flex-1">
						<GasFlowGauge value={gasFlow} />
					</View>
				</View>

				<View className="grid grid-cols-1 gap-3">
					<GasLeakCard label="Gas Leak Sensor 1" value={gas1} />
					<GasLeakCard label="Gas Leak Sensor 2" value={gas2} />
				</View>
				<View className="flex-1">
					<GasMeter value={gasLevel} />
				</View>
			</View>
		</ScrollView>
	);
}
