/*- Imports -*/
import "./App.css";
import React from "react";
import { Icon } from "./App";
import { Note } from "./editor-items/Note";
import { Text } from "./editor-items/Text";

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
			},
		};
		this.notes = [];
		this.texts = [];

		/*- Static -*/
		this.gridSnap = 25;

		/*- Refs -*/
		this.drag = React.createRef();

		/*- Bindings -*/
		this.activateTextBoxAreaTool = this.activateTextBoxAreaTool.bind(this);
		this.moveSelectionCursor = this.moveSelectionCursor.bind(this);
		this.addActiveDocument   = this.addActiveDocument.bind(this);
		this.noteFollowCursor    = this.noteFollowCursor.bind(this);
		this.placeNote           = this.placeNote.bind(this);
		this.createText          = this.createText.bind(this);

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
		});

		/*- Add Event Listeners -*/
		document.addEventListener("mousemove", this.noteFollowCursor);
		document.addEventListener("mousedown", this.placeNote);
	}
	noteFollowCursor(event) {
		this.drag.current.style.left = Math.round((event.clientX - 108) / this.gridSnap) * this.gridSnap + "px";
		this.drag.current.style.top = Math.round((event.clientY - 84) / this.gridSnap) * this.gridSnap + "px";
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

		/*- Add Note -*/
		setTimeout(() => {
			this.notes.push({
				position: {
					x: parseInt(this.drag.current.style.left), 
					y: parseInt(this.drag.current.style.top)
				},
			});
			this.setState({
				placeNote: {
					active: false,
					position: { x: 0, y: 0 },
				},
			});
		}, 50);
	}

	/*- Default methods -*/
	componentDidMount() {
		document.addEventListener("mousemove", this.moveSelectionCursor);
	}
	componentWillUnmount() {
	}

	/*- Methods for selection tool -*/
	moveSelectionCursor(event) {
		/*- If mouse button is clicked -*/
		if (this.state.placeText.active && event.buttons === 1) {
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
							width: event.clientX - this.state.selection.position.x,
							height: event.clientY - this.state.selection.position.y,
						},
					},
				});
			}
		}else {
			this.createText(this.state.selection);
			console.log("Created text");
			/*- Deactivate selection cursor -*/
			this.setState({
				selection: {
					active: false,
					position: { x: 0, y: 0 },
					size: { width: 0, height: 0 },
				},

			});
		}
	}

	/*- Create text -*/
	createText(selection) {
		if (selection.size.width > 0 && selection.size.height > 0) {
			this.texts.push({
				position: {
					x: selection.position.x,
					y: selection.position.y,
				},
				size: {
					width: selection.size.width,
					height: selection.size.height,
				},
			});
		}
	}

	/*- Add title with selection tool -*/
	activateTextBoxAreaTool() {
		this.setState({
			selection: {
				active: true,
				position: {
					x: this.state.selection.position.x,
					y: this.state.selection.position.y,
				},
				size: {
					width: this.state.selection.size.width,
					height: this.state.selection.size.height,
				},
			},
		}, () => {
			document.addEventListener("mousedown", 	() => {
				this.setState({ placeText: { active: true }});
				document.addEventListener("mouseup", () => {
					this.setState({ placeText: { active: false }})
				});
			});
		});
	}

	/*- Render -*/
	render() {
		return (
			<main>
				<div className="main-wrapper">
					<div className="toolbar">

						{/*- Create note -*/}
						<button className="toolbar-btn" onClick={this.addActiveDocument}>
							<Icon name="document" size={32} />
						</button>

						{/*-  -*/}
						<button className="toolbar-btn" onClick={this.activateTextBoxAreaTool}>
							<Icon name="edit" size={32} />
						</button>

						{/*-  -*/}
						<button className="toolbar-btn">
							<Icon name="delete" size={32} />
						</button>

						{this.state.placeText.active && <p>aa</p>}
					</div>
					<div className="editor-content">
						<h1 className="watermark">Quicknotes</h1>

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
						{this.notes.map((data, index) => <Note gridSnap={this.gridSnap} data={data} key={index} index={index} />)}

						{/*- Texts -*/}
						{this.texts.map((data, index) => <Text gridSnap={this.gridSnap} data={data} key={index} index={index} />)}
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
		return <textarea onResize={this.props.onResize} {...this.props} onKeyUp={this.handleKeyDown} onKeyDown={this.handleKeyDown} />;
	}
}


/*- Exports -*/
export default Editor;
