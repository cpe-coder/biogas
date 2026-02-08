import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

import { icon } from "@/constant/icon";

interface FormFieldProps {
	title: string;
	value: string;
	placeholder: string;
	handleChangeText: (text: string) => void;
	otherStyles: string;
	borderStyle?: string;
}

const InputField: React.FC<FormFieldProps> = ({
	title,
	value,
	placeholder,
	handleChangeText,
	otherStyles,
	borderStyle,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<View className={`space-y-2 ${otherStyles}`}>
			<Text className="text-base text-secondary  mb-2 font-medium">
				{title}
			</Text>

			<View
				className={`w-full h-14 px-4 bg-black-100 rounded-xl border  border-primary  focus:border-primary flex flex-row items-center ${borderStyle} `}
			>
				<TextInput
					className="flex-1 text-accent font-semibold text-base"
					value={value}
					placeholder={placeholder}
					placeholderTextColor="#556270"
					onChangeText={handleChangeText}
					secureTextEntry={title === "Password" && !showPassword}
					{...props}
				/>

				{title === "Password" && (
					<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
						<Image
							source={!showPassword ? icon.Eye : icon.EyeClose}
							className="w-6 h-6"
							resizeMode="contain"
							tintColor="#ff8903"
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

export default InputField;
