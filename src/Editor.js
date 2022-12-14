/*- Imports -*/
import "./App.css";
import React from "react";
import { Icon } from "./components/Icon";
import { Note } from "./editor-items/Note";
import { Text } from "./editor-items/Text";
import { Canvas } from "./editor-items/Canvas";
import { Toast } from "./components/Toast";
import { Ptable } from "./editor-items/Ptable";
// import { Ptable } from "./editor-items/Ptable";
import Globals from "./Globals";

/*- Main -*/
class Editor extends React.PureComponent {
	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {
			placeItem: {
				active: false,
				position: { x: 0, y: 0 },
				size: { width: 9.1, height: 7.1 },
			},
			selection: {
				active: false,
				position: { x: 0, y: 0 },
				size: { width: 0, height: 0 },
			},
			placeText: {
				active: false,
				hasMoved: false,
			},
			toast: {
				active: true,
				message: "Welcome back!",
			},
			ptable: {
				active: false,
			},

			snappingIndex: 0,
			gridSnap: 1,

			texts: {},
			notes: {},
			canvases: {},

			saving: false,
			saved: true,

			darkMode: this.getCookie("darkMode") === "true" ? true : false,
		};
		this.notes = {};
		this.nextNoteIndex = 0;
		this.texts = {};
		this.nextTextIndex = 0;
		this.canvases = {};
		this.nextCanvasIndex = 0;

		/*- Static -*/
		this.gridSnaps = [1, 2, 4, 8, 16, 32];
		this.maxTextWidth = 800;
		this.maxTextHeight = 300;
		this.title = "Untitled";
		this.description = "No description";

		/*- Get id from url -*/
		this.id = window.location.pathname.split("/")[2];

		/*- Refs -*/
		this.drag = React.createRef();

		/*- Bindings -*/
		this.activateTextBoxAreaTool = this.activateTextBoxAreaTool.bind(this);
		this.incrementGridSnap 		 = this.incrementGridSnap.bind(this);
		this.addActiveDocument       = this.addActiveDocument.bind(this);
		this.noteFollowCursor        = this.noteFollowCursor.bind(this);
		this.addCanvas     		     = this.addCanvas.bind(this);
		this.createText              = this.createText.bind(this);
		this.mouseMove               = this.mouseMove.bind(this);
		this.placeNote               = this.placeNote.bind(this);
		this.mouseUp                 = this.mouseUp.bind(this);
	}

	/*- Increment Grid Snap -*/
	incrementGridSnap() {
		if (this.state.snappingIndex < this.gridSnaps.length - 1) {
			this.setState({
				snappingIndex: this.state.snappingIndex + 1,
				gridSnap: this.gridSnaps[this.state.snappingIndex + 1],
			});
		}else {
			this.setState({
				snappingIndex: 0,
				gridSnap: this.gridSnaps[0],
			});
		}
	}

	/*- Methods -*/
	addActiveDocument(callback, width, height) {
		this.setState({
			placeItem: {
				active: true,
				position: { x: 0, y: 0 },
				size: { width, height },
			},
		}, () => {
			this.drag.current.classList.remove("active");
			this.drag.current.style.left = 0 + "px";
			this.drag.current.style.top = 0 + "px";

			/*- Add Event Listeners -*/
			document.addEventListener("mousemove", this.noteFollowCursor);
			const f = () => {
				if (!this.state.placeItem.active) return;
				this.drag.current.classList.add("active");
				
				callback();

				/*- Remove Event Listeners -*/
				document.removeEventListener("mousemove", this.noteFollowCursor);
				document.removeEventListener("mousedown", f);
			};
			document.addEventListener("mousedown", f);
		});

	}
	noteFollowCursor(event) {
		if (!this.drag.current) return;
		let gridSnap = this.gridSnaps[this.state.snappingIndex];

		/*- Set position of note -*/
		this.drag.current.style.left = Math.round((event.clientX - 108) / gridSnap) * gridSnap + "px";
		this.drag.current.style.top = Math.round((event.clientY - 84) / gridSnap) * gridSnap + "px";
		this.setState({
			placeItem: {
				position: {
					x: event.clientX,
					y: event.clientY,
				},
				...this.state.placeItem,
			}
		});
	}
	placeNote() {
		const id = this.generateItemId();

		/*- Create Note -*/
		let newNote = {
			position: {
				x: parseInt(this.drag.current.style.left),
				y: parseInt(this.drag.current.style.top)
			},
			size: {
				width: 200,
				height: 110,
			},
			_real_content: [],
			content: "",
			id: id,
		};
		this.notes[id] = newNote;
		this.makeUnsaved();

		/*- Add Note -*/
		this.setState({
			placeItem: {
				active: false,
				position: { x: 0, y: 0 },
			},
			notes: {
				...this.state.notes,
				[id]: newNote
			}
		});

		/*- Increment Note Index -*/
		this.nextNoteIndex++;
	}

	/*- Default methods -*/
	componentDidMount() {
		document.addEventListener("mousemove", this.mouseMove);
		document.addEventListener("mouseup", this.mouseUp);
		this.changeDarkMode(this.state.darkMode);

		/*- Fetch docs -*/
		fetch(Globals.BACKEND_URL + "get-doc", {
			method: "GET",
			headers: {
				"token": this.getCookie("token"),
				"id": this.id
			},
		}).then(async res => await res.json()).then(data => {
			/*- Convert notes to utf8 -*/
			let notes = this.convertToRealContent(data.notes);
			let texts = this.convertToRealContent(data.texts);

			this.notes = notes;
			this.texts = texts;
			this.canvases = data.canvases;
			this.title = data.title;
			this.description = data.description;

			this.nextTextIndex = Object.keys(data.texts).length;
			this.nextNoteIndex = Object.keys(data.notes).length;
			this.nextCanvasIndex = Object.keys(data.canvases).length;

			this.setState({
				canvases: data.canvases,
				notes,
				texts,
			})
		});
	}
	componentWillUnmount() {
		document.removeEventListener("mousemove", this.mouseMove);
		document.removeEventListener("mouseup", this.mouseUp);
	}

	/*- Convert bytes into real text strings -*/
	convertToRealContent = (content) => {
		let items = {};
		const keys = Object.keys(content);
		const decoder = new TextDecoder();

		keys.forEach(key => {
			let array = content[key]._real_content; // Array([])

			items[key] = {
				...content[key],
				content: decoder.decode(new Uint8Array(array)),
			};
		});

		return items;
	};

	/*- Methods for selection tool -*/
	mouseMove(event) {
		/*- If mouse button is clicked -*/
		if (event.buttons === 1 && this.state.placeText.active) {

			/*- If selection cursor is not active -*/
			if (!this.state.selection.active) {

				/*- Activate selection cursor -*/
				this.setState({
					selection: {
						active: true,
						position: {
							x: event.clientX,
							y: event.clientY,
						},
						size: {
							width: 0,
							height: 0,
						},
					},
					placeText: {
						hasMoved: true,
						active: true,
					},
				});
			}
			/*- If selection cursor is active -*/
			else {
				/*- Update selection cursor size -*/
				this.setState({
					selection: {
						active: true,
						position: this.state.selection.position,
						size: {
							width: Math.min(event.clientX - this.state.selection.position.x, this.maxTextWidth),
							height: Math.min(event.clientY - this.state.selection.position.y, this.maxTextHeight),
						},
					},
					placeText: {
						hasMoved: true,
						active: true,
					},
				});
			}
		}
	}
	mouseUp(_) {
		/*- If selection cursor is active -*/
		if (this.state.selection.active) {
			this.createText(this.state.selection);

			/*- Deactivate selection cursor -*/
			this.setState({
				selection: {
					active: false,
					position: { x: 0, y: 0 },
					size: { width: 0, height: 0 },
				},
				
				placeText: {
					active: false,
				}
			});
		}
	}

	/*- Methods for canvas tool -*/
	addCanvas() {
		this.addActiveDocument(() => {
			const id = this.generateItemId();
			let newCanvas = {
				position: {
					x: parseInt(this.drag.current.style.left),
					y: parseInt(this.drag.current.style.top)
				},
				size: {
					width: 0,
					height: 0,
				},
				content: "",
				id
			};
			this.canvases[id] = newCanvas;
					
			/*- Add Canvas -*/
			this.setState({
				canvases: {
					...this.state.canvases,
					[id]: newCanvas
				},
				placeItem: {
					active: false,
					position: { x: 0, y: 0 },
				},
			});
								
			/*- Increment Canvas Index -*/
			this.nextCanvasIndex++;
			this.makeUnsaved();
		}, 14.8, 9);		
	}
	generateItemId = () => {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}
							
	/*- Create text -*/
	createText(selection) {
		if (selection.size.width > 0 && selection.size.height > 0) {
			let newText = {
				content: "",
				_real_content: [],
				position: {
					x: selection.position.x,
					y: selection.position.y,
				},
				size: {
					width: selection.size.width,
					height: selection.size.height,
					font_size: 20,
				},
			};

			/*- Add Text -*/
			this.setState({
				texts: {
					...this.state.texts,
					["text" + this.nextTextIndex]: newText
				}
			});

			this.texts["text" + this.nextTextIndex] = newText;

			/*- Increment Text Index -*/
			this.nextTextIndex++;
			this.makeUnsaved();
		}
	}

	/*- Add title with selection tool -*/
	activateTextBoxAreaTool() {
		let commonChange = {
			active: false,
			position: {
				x: this.state.selection.position.x,
				y: this.state.selection.position.y,
			},
			size: {
				width: this.state.selection.size.width,
				height: this.state.selection.size.height,
			},
		};
		if (this.state.placeText.active) {
			this.setState({
				selection: commonChange,
				placeText: {
					hasMoved: false,
					active: false,
				}
			});
		}else {
			this.setState({
				selection: commonChange,
				placeText: {
					hasMoved: false,
					active: true,
				}
			});
		}
	}

	/*- Toggle periodic table -*/
	togglePeriodicTable = () => {
		this.setState({
			ptable: {
				active: !this.state.ptable.active,
			}
		});
	}

	/*- Save document -*/
	saveDocument = (possibleCallback) => {
		let encodedNotes = this.encodeItems(this.state.notes);
		let texts = this.encodeItems(this.state.texts);

		/*- Save canvases -*/
		Object.keys(this.state.canvases).forEach((key) => {
			/*- Save canvas -*/
			fetch(Globals.BACKEND_URL + "save-canvas", {
				method: "POST",
				headers: {
					"token": this.getCookie("token"),
					"doc-id": this.id,
					"canvas-id": this.state.canvases[key].id,
				},
				body: this.state.canvases[key].content,
			})
		});

		/*- Save notes -*/
		Object.keys(encodedNotes).forEach((key) => {
			/*- Save note -*/
			fetch(Globals.BACKEND_URL + "save-note", {
				method: "POST",
				headers: {
					"token": this.getCookie("token"),
					"doc-id": this.id,
					"note-id": key,
				},
				body: JSON.stringify(encodedNotes[key]._real_content),
			})
		});

		/*- Remove content from canvases & notes -*/
		let canvases = {};
		let notes = {};
		Object.keys(this.state.canvases).forEach((key) => {
			let canvas = this.state.canvases[key];
			canvases[key] = {
				position: canvas.position,
				id: canvas.id,
			};
		});
		Object.keys(encodedNotes).forEach((key) => {
			let note = encodedNotes[key];
			notes[key] = {
				position: note.position,
				size: note.size,
				id: key,
			};
		});

		let data = {
			"title": this.title,
			"description": this.description,
			"date": new Date().getTime(),
		
			/*- The document's content -*/
			"texts": texts,

			/*- Remove the content prop, but keep _real_content -*/
			"notes": notes,
			"canvases": canvases,
		
			/*- This will be set in backend -*/
			"owner": "",
			"id": this.id,
		};

		/*- Send data to backend -*/
		fetch(Globals.BACKEND_URL + "set-doc", {
			method: "GET",
			headers: {
				"token": this.getCookie("token"),
				"document": JSON.stringify(data),
			},
		}).then(() => {
			this.showToast("Document saved!");
			try {
				possibleCallback && possibleCallback();
			}catch {};
		});
		this.setState({
			saved: true,
		});
	}
	
	/*- Encode items -*/
	encodeItems = (items) => {
		let _items = {};
		const keys = Object.keys(items);
		let utf8Encode = new TextEncoder();
		keys.forEach((key) => {
			_items[key] = {
				_real_content: Array.from(utf8Encode.encode(items[key].content)),
				position: items[key].position,
				size: items[key].size,
				font_size: items[key].size.font_size,
				id: items[key].id,
			};
		});
		return _items;
	}

	/*- Save handling -*/
	makeUnsaved = () => {
		this.setState({
			saved: false,
		});
	};

	/*- Toast -*/
	showToast = (message) => {
		this.setState({
			toast: {
				active: true,
				message,
			}
		});
	};

	/*- Dark mode toggle -*/
	toggleNightMode = () => {
		this.setState({
			darkMode: !this.state.darkMode,
		}, () => {
			this.changeDarkMode(this.state.darkMode);

			/*- Save cookie -*/
			this.setCookie("darkMode", this.state.darkMode, 365);

		});
	}
	changeDarkMode = (to) => {
		/*- Css variables -*/
		if (to) {
			document.documentElement.style.setProperty("--main", "#111");
			document.documentElement.style.setProperty("--main-1", "#222");
			document.documentElement.style.setProperty("--main-2", "#333");
			document.documentElement.style.setProperty("--main-3", "#444");
			document.documentElement.style.setProperty("--main-4", "#555");
			document.documentElement.style.setProperty("--main-5", "#666");
			document.documentElement.style.setProperty("--text", "#fff");
			document.documentElement.style.setProperty("--toolbar-btn", "rgb(107, 216, 213)");
		}else {
			document.documentElement.style.setProperty("--main", "#fff");
			document.documentElement.style.setProperty("--main-1", "#eee");
			document.documentElement.style.setProperty("--main-2", "#ddd");
			document.documentElement.style.setProperty("--main-3", "#aaa");
			document.documentElement.style.setProperty("--main-4", "#888");
			document.documentElement.style.setProperty("--main-5", "#333");
			document.documentElement.style.setProperty("--text", "#000");
			document.documentElement.style.setProperty("--toolbar-btn", "#fff");
		};
	};

	/*- Change cookie -*/
	setCookie = (name, value, days) => {
		let expires = "";
		if (days) {
			let date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString() + "; SameSite=None; Secure";
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	};

	/*- Get cookie -*/
	getCookie = (name) => {
		let nameEQ = name + "=";
		let ca = document.cookie.split(';');
		for(let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	};

	/*- Render -*/
	render() {
		return (
			<main>
				<div className="main-wrapper">
					<div className="toolbar-positioner">
						<div className="toolbar">
							<div className="row">
								{/*- Go home -*/}
								<button title="Home" className="toolbar-btn" onClick={() => {
									this.saveDocument(() => {
										window.open("/", "_self");
									});
								}}>
									<Icon light={this.state.darkMode} name="home" size={32} />
								</button>

								<p>Home</p>
							</div>

							<Hr />

							{/*- Create note -*/}
							<div className="row">
								<button title="Create a note element" className="toolbar-btn" onClick={() => this.addActiveDocument(() => this.placeNote(), 10.1, 7.1)}>
									<Icon light={this.state.darkMode} name="note" size={32} />
								</button>

								<p>Note</p>
							</div>

							{/*- Create text -*/}
							<div className="row">
								<button
									title="Create a text element"
									className={"toolbar-btn" + (this.state.placeText.active ? " active" : "")}
									onClick={this.activateTextBoxAreaTool}
								>
									<Icon light={this.state.darkMode} name="text" size={32} />
								</button>

								<p>Text</p>
							</div>

							{/*- Create canvas -*/}
							<div className="row">
								<button title="Create a canvas" className="toolbar-btn" onClick={this.addCanvas}>
									<Icon light={this.state.darkMode} name="canvas" size={32} />
								</button>

								<p>Canvas</p>
							</div>

							<Hr />

							{/*- Show ptable -*/}
							<div className="row">
								<button title="Show periodic table" className="toolbar-btn" onClick={this.togglePeriodicTable}>
									<Icon light={this.state.darkMode} name="ptable" size={32} />
								</button>
								<p>Periodic table</p>
							</div>

							{/*- Add calculator -*/}
							<div className="row">
								<button title="Add calculator" className="toolbar-btn" onClick={this.addCanvas}>
									<Icon light={this.state.darkMode} name="calculator-horizontal" size={32} />
								</button>

								<p>Calculator</p>
							</div>
							<Hr />

							{/*- Grid snap size -*/}
							<div className="row">
								<button title="Change grid snap size" className="toolbar-btn" onClick={this.incrementGridSnap}>
									<Icon light={this.state.darkMode} name={
										this.state.gridSnap === 1 ? "1x1" :
										this.state.gridSnap === 2 ? "2x2" :
										this.state.gridSnap === 4 ? "4x4" :
										this.state.gridSnap === 8 ? "8x8" :
										this.state.gridSnap === 16 ? "16x16" :
										this.state.gridSnap === 32 ? "32x32" :
										"1x1"
									} size={32} />
								</button>
								
								<p>Snap</p>
							</div>

							<Hr />

							{/*- Change dark / light mode -*/}
							<div className="row">
								<button title="Change light / dark mode" className="toolbar-btn" onClick={this.toggleNightMode}>
									<Icon light={this.state.darkMode} name={
										this.state.darkMode === true ? "moon" : "sun"
									} size={32} />
								</button>
								<p>Theme</p>
							</div>

							<Hr />

							{/*- Save document -*/}
							<div className="row">
								<button title="Save" className="toolbar-btn" onClick={this.saveDocument}>
									<Icon light={this.state.darkMode} name="check" size={32} />
								</button>
								<p>Save</p>
							</div>
						</div>
					</div>
					<div className="editor-content">
						<h1 className="watermark"><img alt="logo" src={require("./icons/logo.svg").default} /></h1>

						{/*- Notes cursor -*/}
						{this.state.placeItem.active && <div className="note-place" style={{
							width: this.state.placeItem.size.width + "rem",
							height: this.state.placeItem.size.height + "rem",
						}} ref={this.drag}></div>}

						{/*- Selection cursor -*/}
						{this.state.selection.active && <div className="selection" style={{
							left: this.state.selection.position.x,
							top: this.state.selection.position.y,

							/*- If selection cursor is too small, flip by rotating and doing abs(width) -*/
							width: Math.abs(this.state.selection.size.width),
							height: Math.abs(this.state.selection.size.height),
							transform:
								/*- Bottom right -*/
								this.state.selection.size.width === Math.abs(this.state.selection.size.width)
								&& this.state.selection.size.height === Math.abs(this.state.selection.size.height) ? "rotate(0deg)" :

								/*- Bottom left -*/
								this.state.selection.size.width < Math.abs(this.state.selection.size.width)
								&& this.state.selection.size.height === Math.abs(this.state.selection.size.height) ? "rotate(90deg)" :

								/*- Top left -*/
								this.state.selection.size.width < Math.abs(this.state.selection.size.width)
								&& this.state.selection.size.height < Math.abs(this.state.selection.size.height) ? "rotate(180deg)" :

								/*- Top right -*/
								this.state.selection.size.width === Math.abs(this.state.selection.size.width)
								&& this.state.selection.size.height < Math.abs(this.state.selection.size.height) ? "rotate(270deg)" : "rotate(0deg)"
								
						}}></div>}
						
						{/*- Notes -*/}
						{Object.keys(this.state.notes).map(key => {
							return (
								<Note
									gridSnap={this.gridSnaps[this.state.snappingIndex]}
									data={this.state.notes[key]}
									key={key}
									index={key}
									id={this.id}
									darkMode={this.state.darkMode}
									onChange={(content, position, size) => {
										/*- Only update what's changed -*/
										if (position !== false) this.notes[key].position = position;
										if (size !== false)	    this.notes[key].size = size;
										if (content !== false)  {
											/*- Replace self content with byte array -*/
											let utf8Encode = new TextEncoder(); 
											let byteArr = utf8Encode.encode(content);

											this.notes[key]._real_content = byteArr;
											this.notes[key].content = content;
										};

										this.setState({
											notes: {
												...this.state.notes,
												[key]: {
													content: this.notes[key].content,
													_real_content: this.notes[key]._real_content,
													position: this.notes[key].position,
													size: this.notes[key].size
												}
											}
										});
										this.makeUnsaved();
									}}
									onDelete={() => {
										delete this.notes[key];

										/*- If no notes, force update because it won't re-render -*/
										if (Object.keys(this.notes).length === 0) {
											this.forceUpdate();
										}

										/*- Cause re-render -*/
										this.setState({ notes: this.notes });
										this.makeUnsaved();
									}}
								/>
							)
						})}

						{/*- Texts -*/}
						{Object.keys(this.state.texts).map(key => {
							return (
								<Text
									gridSnap={this.gridSnaps[this.state.snappingIndex]}
									darkMode={this.state.darkMode}
									data={this.state.texts[key]}
									key={key}
									index={key}
									onChange={(content, position, size) => {
										/*- Only update what's changed -*/
										if (content !== false)  this.texts[key].content = content;
										if (position !== false) this.texts[key].position = position;
										if (size !== false)	    this.texts[key].size = size;

										/*- Change state -*/
										this.setState({
											texts: {
												...this.state.texts,
												[key]: {
													content: this.texts[key].content,
													position: this.texts[key].position,
													size: this.texts[key].size
												}
											}
										});
										this.makeUnsaved();
									}}
									onDelete={() => {
										delete this.texts[key];

										/*- If no texts, force update because it won't re-render -*/
										if (Object.keys(this.texts).length === 0) {
											this.forceUpdate();
										}

										/*- Cause re-render -*/
										this.setState({ texts: this.texts });
										this.makeUnsaved();
									}}
								/>
							)
						})}

						{/*- Canvases -*/}
						{Object.keys(this.state.canvases).map(key => {
							const data = this.state.canvases[key];
							return (
								<Canvas
									gridSnap={this.gridSnaps[this.state.snappingIndex]}
									data={data}
									key={key}
									index={key}
									darkMode={this.state.darkMode}
									id={this.id} // Document ID
									onChange={(content, position, size) => {
										/*- Only update what's changed -*/
										if (content !== false)  this.canvases[key].content = content;
										if (position !== false) this.canvases[key].position = position;
										if (size !== false)	    this.canvases[key].size = size;

										this.setState({
											canvases: {
												...this.state.canvases,
												[key]: {
													content: 	this.canvases[key].content,
													position: 	this.canvases[key].position,
													size: 		this.canvases[key].sizes,
													id: 		key
												}
											}
										});
										this.makeUnsaved();
									}}
									onDelete={() => {
										delete this.canvases[key];

										/*- If no canvases, force update because it won't re-render -*/
										if (Object.keys(this.canvases).length === 0) {
											this.forceUpdate();
										}

										/*- Cause re-render -*/
										this.setState({ canvases: this.canvases });
										this.makeUnsaved();
									}}
								/>
							)
						})}

						{this.state.ptable.active ? <Ptable
							gridSnap={this.gridSnaps[this.state.snappingIndex]}
							darkMode={this.state.darkMode}
						/>:null}
					</div>
				</div>

				{/*- Save -*/}
				<SaveButton
					onClick={this.saveDocument}
					saved={this.state.saved}
				/>

				{/*- Toast -*/}
				{this.state.toast.active ? <Toast
					message={this.state.toast.message}
					onClose={() => this.setState({ toast: { show: false, message: '' } })}
				/> : null}
			</main>
		)
	}
}

function Hr() {
	return (
		<div className="hr">
		</div>
	)
}

class SaveButton extends React.PureComponent {
	render() {
		return (
			<button
				className={this.props.saved ? "save-button" : "save-button warning"}
				onClick={this.props.onClick}
			>
				{this.props.loading ? <Icon size={40} name="" /> : this.props.saved ? <Icon name="check" /> : <Icon size={40} name="warning" />}
			</button>
		)
	}
}

/*- Exports -*/
export default Editor;
