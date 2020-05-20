import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";

export default function App() {
	const [hasPermission, setHasPermission] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.back);
	const [camera, setCamera] = useState(null);

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
		console.log(photo);
	};
	return (
		<View style={styles.container}>
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
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	main: {
		flex: 1,
	},
	row: {
		display: "flex",
		backgroundColor: "red",
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 20,
	},
	button: {
		alignItems: "center",
	},
	buttonTxt: {
		fontSize: 18,
		marginBottom: 10,
		color: "white",
	},
});
