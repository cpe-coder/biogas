import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

export const sendNotification = async (title: string, body: string) => {
	await Notifications.scheduleNotificationAsync({
		content: {
			title,
			body,
			sound: "default",
			priority: Notifications.AndroidNotificationPriority.MAX,
		},
		trigger: null,
	});
};
