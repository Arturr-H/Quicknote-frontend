/*- Imports -*/
import "./App.css";
import React from "react";
import { Icon } from "./App";
import { Note } from "./editor-items/Note";
import { Text } from "./editor-items/Text";
import { Canvas } from "./editor-items/Canvas";

/*- Constants -*/
const BACKEND_URL = "http://localhost:8080/";

/*- Main -*/
class Editor extends React.PureComponent {
	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {
			placeNote: {
				active: false,
				position: { x: 0, y: 0 },
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

			snappingIndex: 0,

			texts: {},
			notes: {},
			canvases: {},
		};
		this.notes = {};
		this.nextNoteIndex = 0;
		this.texts = {};
		this.nextTextIndex = 0;
		this.canvases = {};
		this.nextCanvasIndex = 0;

		/*- Static -*/
		this.gridSnaps = [1, 4, 8, 15, 25, 35, 50];
		this.maxTextWidth = 800;
		this.maxTextHeight = 300;

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
			this.setState({ snappingIndex: this.state.snappingIndex + 1 });
		}else {
			this.setState({ snappingIndex: 0 });
		}
	}

	/*- Methods -*/
	addActiveDocument() {
		this.setState({
			placeNote: {
				active: true,
				position: { x: 0, y: 0 },
			},
		}, () => {
			this.drag.current.classList.remove("active");
			this.drag.current.style.left = 0 + "px";
			this.drag.current.style.top = 0 + "px";

			/*- Add Event Listeners -*/
			document.addEventListener("mousemove", this.noteFollowCursor);
			document.addEventListener("mousedown", this.placeNote);
		});

	}
	noteFollowCursor(event) {
		let gridSnap = this.gridSnaps[this.state.snappingIndex];

		/*- Set position of note -*/
		this.drag.current.style.left = Math.round((event.clientX - 108) / gridSnap) * gridSnap + "px";
		this.drag.current.style.top = Math.round((event.clientY - 84) / gridSnap) * gridSnap + "px";
		this.setState({
			position: {
				x: event.clientX,
				y: event.clientY,
			},
		});
	}
	placeNote() {
		if (!this.state.placeNote.active) return;
		this.drag.current.classList.add("active");

		/*- Remove Event Listeners -*/
		document.removeEventListener("mousemove", this.noteFollowCursor);
		document.removeEventListener("mosedown", this.placeNote);

		/*- Create Note -*/
		let newNote = {
			position: {
				x: parseInt(this.drag.current.style.left),
				y: parseInt(this.drag.current.style.top)
			},
		};
		this.notes["note" + this.nextNoteIndex] = newNote;

		/*- Add Note -*/
		setTimeout(() => {
			this.setState({
				placeNote: {
					active: false,
					position: { x: 0, y: 0 },
				},
				notes: {
					...this.state.notes,
					["note" + this.nextNoteIndex]: newNote
				}
			});

			/*- Increment Note Index -*/
			this.nextNoteIndex++;
		}, 50);
	}

	/*- Default methods -*/
	componentDidMount() {
		document.addEventListener("mousemove", this.mouseMove);
		document.addEventListener("mouseup", this.mouseUp);

		/*- Fetch docs -*/
		console.log(BACKEND_URL + "get-doc");
		fetch(BACKEND_URL + "get-doc", {
			method: "GET",
			headers: {
				"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFydHVyIiwidWlkIjoiOTc2OWUyNjYtNzY1Ny00YzM4LTkxNTYtMjEyMzhkODc3ZDIyIiwic3VpZCI6IjRiM2ZkNDczZjU0YzQyY2ViNmVjNTEyNTk2MzgyNWM2IiwiZXhwIjoxNjcxNDAzMTU4fQ.7zYufEzb1eiXVyM9GMtlfSU-YBHOJ_Jo7jLWvYhsGW4",
				"title": "My Doc"
			},
		}).then(async res => await res.json()).then(data => {
			this.notes = data.notes;
			this.texts = data.texts;
			this.canvases = data.canvases;
			this.setState({
				canvases: data.canvases,
				notes: data.notes,
				texts: data.texts,
			})
		});
	}
	componentWillUnmount() {
		document.removeEventListener("mousemove", this.mouseMove);
		document.removeEventListener("mouseup", this.mouseUp);
	}

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
		let newCanvas = {
			position: {
				x: 0,
				y: 0,
			},
			size: {
				width: 0,
				height: 0,
			},
		};
		this.canvases["canvas" + this.nextCanvasIndex] = newCanvas;

		/*- Add Canvas -*/
		this.setState({
			canvases: {
				...this.state.canvases,
				["canvas" + this.nextCanvasIndex]: newCanvas
			}
		});

		/*- Increment Canvas Index -*/
		this.nextCanvasIndex++;
	}

	/*- Create text -*/
	createText(selection) {
		if (selection.size.width > 0 && selection.size.height > 0) {
			let newText = {
				content: "",
				position: {
					x: selection.position.x,
					y: selection.position.y,
				},
				size: {
					width: selection.size.width,
					height: selection.size.height,
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

	/*- Render -*/
	render() {
		return (
			<main>
				<div className="main-wrapper">
					<div className="toolbar-positioner">
						<div className="toolbar">
							{/*- Create note -*/}
							<button className="toolbar-btn" onClick={this.addActiveDocument}>
								<Icon name="document" size={32} />
							</button>

							{/*- Create text -*/}
							<button
								className={"toolbar-btn" + (this.state.placeText.active ? " active" : "")}
								onClick={this.activateTextBoxAreaTool}
							>
								<Icon name="edit" size={32} />
							</button>

							{/*- Grid snap size -*/}
							<button className="toolbar-btn" onClick={this.incrementGridSnap}>
								<Icon name="category" size={32} />
							</button>

							{/*- Create canvas -*/}
							<button className="toolbar-btn" onClick={this.addCanvas}>
								<Icon name="profile" size={32} />
							</button>

							{this.state.placeText.active && <p>aa</p>}
						</div>
					</div>
					<div className="editor-content">
						<h1 className="watermark">Quicknote</h1>

						{/*- Notes cursor -*/}
						{this.state.placeNote.active && <div className="note-place" ref={this.drag}></div>}

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
							const data = this.state.notes[key];
							return (
								<Note
									gridSnap={this.gridSnaps[this.state.snappingIndex]}
									data={data}
									key={key}
									index={key}
									onDelete={() => {
										delete this.notes[key];

										/*- If no notes, force update because it won't re-render -*/
										if (Object.keys(this.notes).length === 0) {
											this.forceUpdate();
										}

										/*- Cause re-render -*/
										this.setState({ notes: this.notes });
									}}
								/>
							)
						})}

						{/*- Texts -*/}
						{Object.keys(this.state.texts).map(key => {
							return (
								<Text
									gridSnap={this.gridSnaps[this.state.snappingIndex]}
									data={this.state.texts[key]}
									key={key}
									index={key}
									onChange={(content) => {
										console.log(key);
										this.setState({
											texts: {
												...this.state.texts,
												[key]: {
													...this.state.texts[key],
													content
												}
											}
										});
									}}
									onDelete={() => {
										delete this.texts[key];

										/*- If no texts, force update because it won't re-render -*/
										if (Object.keys(this.texts).length === 0) {
											this.forceUpdate();
										}

										/*- Cause re-render -*/
										this.setState({ texts: this.texts });
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
									onDelete={() => {
										delete this.canvases[key];

										/*- If no canvases, force update because it won't re-render -*/
										if (Object.keys(this.canvases).length === 0) {
											this.forceUpdate();
										}

										/*- Cause re-render -*/
										this.setState({ canvases: this.canvases });
									}}
								/>
							)
						})}

						
					</div>
				</div>
			</main>
		)
	}
}

export class TextArea extends React.PureComponent {
	handleKeyDown(e) {
		e.target.style.height = 'inherit';
		e.target.style.height = `${e.target.scrollHeight}px`;
		// In case you have a limitation
		// e.target.style.height = `${Math.min(e.target.scrollHeight, limit)}px`;
	}

	render() {
		return <textarea ref={this.props._ref} onResize={this.props.onResize} {...this.props} onKeyUp={this.handleKeyDown} onKeyDown={this.handleKeyDown} />;
	}
}


/*- Exports -*/
export default Editor;
