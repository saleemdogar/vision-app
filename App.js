import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import { Camera } from "expo-camera";
import { config } from "./config/visionapi";
import * as FileSystem from "expo-file-system";

export default function App() {
	const [hasPermission, setHasPermission] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [camera, setCamera] = useState(null);
	const [googleVisionDetetion, setGoogleVisionDetetion] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	if (hasPermission === null) {
		return <View />;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}
	const snap = async () => {
		let photo = await camera.takePictureAsync();
		setIsLoading(true);
		const base64 = await FileSystem.readAsStringAsync(photo.uri, {
			encoding: "base64",
		});
		callGoogleVIsionApi(base64);
	};
	const goBack = () => {
		setGoogleVisionDetetion(null);
	};
	const callGoogleVIsionApi = async (base64) => {
		let googleVisionRes = await fetch(`${config.apiUrl}?key=${config.apiKey}`, {
			method: "POST",
			body: JSON.stringify({
				requests: [
					{
						image: {
							content: base64,
						},
						features: [{ type: "OBJECT_LOCALIZATION", maxResults: 5 }],
					},
				],
			}),
		});

		await googleVisionRes
			.json()
			.then((googleVisionRes) => {
				setIsLoading(false);
				if (googleVisionRes) {
					setGoogleVisionDetetion(googleVisionRes.responses[0]);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};
	return (
		<View style={styles.container}>
			{isLoading ? (
				<View style={styles.spinnerStyle}>
					<ActivityIndicator size={"large"} />
					<Text style={styles.spinerTxt}>Wait i am fetching data....</Text>
				</View>
			) : googleVisionDetetion ? (
				<View style={styles.resultGrid}>
					<Text style={styles.heading}>Results</Text>
					<View>
						<ScrollView>
							{googleVisionDetetion.localizedObjectAnnotations.map(
								(data, index) => {
									return (
										<View key={index} style={styles.resultTable}>
											<Text>Object Name : {data.name}</Text>
											<Text>score : {data.score}</Text>
										</View>
									);
								}
							)}
						</ScrollView>
					</View>
					<TouchableOpacity style={styles.backBtn} onPress={goBack}>
						<Text style={styles.buttonTxt}>Back</Text>
					</TouchableOpacity>
				</View>
			) : (
				<Camera
					style={styles.main}
					ref={(ref) => {
						setCamera(ref);
					}}
					type={type}
				>
					<View style={styles.row}>
						<TouchableOpacity
							style={styles.button}
							onPress={() => {
								setType(
									type === Camera.Constants.Type.back
										? Camera.Constants.Type.front
										: Camera.Constants.Type.back
								);
							}}
						>
							<Text style={styles.buttonTxt}>Flip</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.button} onPress={snap}>
							<Text style={styles.buttonTxt}>Take Photo</Text>
						</TouchableOpacity>
					</View>
				</Camera>
			)}
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: "relative",
	},
	main: {
		flex: 1,
	},
	row: {
		flex: 1,
		backgroundColor: "transparent",
		flexDirection: "column",
		justifyContent: "center",
		position: "absolute",
		bottom: 0,
		width: "100%",
		height: "auto",
		alignItems: "center",
	},
	button: {
		alignItems: "center",
		marginBottom: 20,
		textAlignVertical: "center",
	},
	buttonTxt: {
		backgroundColor: "#C2AC2D",
		fontSize: 18,
		marginBottom: 10,
		color: "white",
		textAlign: "center",
		width: 200,
		padding: 7,
	},
	spinnerStyle: {
		flex: 1,
		justifyContent: "center",
	},
	spinerTxt: {
		paddingTop: 10,
		color: "black",
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
	},
	resultGrid: {
		flex: 1,
		flexDirection: "column",
		paddingTop: 20,
	},
	heading: {
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 10,
		marginTop: 20,
		alignSelf: "center",
	},
	resultTable: {
		borderWidth: 2,
		borderColor: "#C2AC2D",
		margin: 10,
		padding: 10,
	},
	backBtn: {
		alignItems: "center",
		marginBottom: 20,
		textAlignVertical: "center",
		alignSelf: "center",
	},
});
