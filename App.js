import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Vision from "./components/vision";
import Speech from "./components/speech";

const App = () => {
	const [moduleType, setModuleType] = useState("");

	const onModuleChange = (type) => {
		setModuleType(type);
	};
	let module = null;
	if (moduleType === "vision") module = <Vision />;
	else if (moduleType === "speech") module = <Speech />;
	else {
		module = (
			<View style={styles.row}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						setModuleType("vision");
					}}
				>
					<Text style={styles.buttonTxt}>Vision</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => {
						setModuleType("speech");
					}}
				>
					<Text style={styles.buttonTxt}>Speach</Text>
				</TouchableOpacity>
			</View>
		);
	}
	return <View style={styles.container}>{module}</View>;
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	row: {
		flex: 1,
		backgroundColor: "transparent",
		flexDirection: "column",
		justifyContent: "center",
		bottom: 0,
		width: "100%",
		height: "auto",
		alignItems: "center",
		padding: 20,
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
		width: 250,
		padding: 7,
		fontWeight: "bold",
	},
});
export default App;
