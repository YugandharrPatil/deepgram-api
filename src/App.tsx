import { createClient } from "@deepgram/sdk";
import fs from "fs";
import { useEffect } from "react";

// const PROJECT_ID = "d1f9c8fa-cd27-49d2-9595-b8a00bb663fa";
const API_KEY = "56c861aca7712d4529b739ed8bdd490b818e1f41";

const deepgram = createClient(API_KEY);

const inputText = "hello! what's up!";

const textToSpeech = async (text: string) => {
	const res = await deepgram.speak.request({ text }, { model: "aura-asteria-en", encoding: "linear16", container: "wav" });
	const stream = await res.getStream();
	const headers = await res.getHeaders();
	if (stream) {
		// STEP 4: Convert the stream to an audio buffer
		const buffer = await getAudioBuffer(stream);
		// STEP 5: Write the audio buffer to a file
		fs.writeFile("output.wav", buffer, (err) => {
			if (err) {
				console.error("Error writing audio to file:", err);
			} else {
				console.log("Audio file written to output.wav");
			}
		});
	} else {
		console.error("Error generating audio:", stream);
	}

	if (headers) {
		console.log("Headers:", headers);
	}
};

// helper function to convert stream to audio buffer
const getAudioBuffer = async (response: ReadableStream<Uint8Array>) => {
	const reader = response.getReader();
	const chunks = [];

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;

		chunks.push(value);
	}

	const dataArray = chunks.reduce((acc, chunk) => Uint8Array.from([...acc, ...chunk]), new Uint8Array(0));

	return Buffer.from(dataArray.buffer);
};

textToSpeech(inputText);

export default function App() {
	useEffect(() => {
		textToSpeech("some random text...");
	}, []);
	return (
		<>
			<h1>Hello!</h1>
		</>
	);
}
