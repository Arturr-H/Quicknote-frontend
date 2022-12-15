/*- Imports -*/
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App as Index } from "./App";
import Editor from "./Editor";
import { Arrow } from "./editor-items/Arrow";

/*- Main -*/
export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/">
					<Route index element={<Index />} />
					<Route path="arrow" element={<Arrow />} />
					<Route path="editor/:docid" element={<Editor />} />
					<Route path="*" element={<h1>404!!!</h1>} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

/*- Render -*/
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.Fragment>
		<App />
	</React.Fragment>
);