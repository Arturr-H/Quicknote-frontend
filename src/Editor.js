/*- Imports -*/
import "./App.css";
import React from "react";
import { Icon } from "./App";

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
		};
		this.notes = [];

		/*- Refs -*/
		this.drag = React.createRef();

		/*- Bindings -*/
		this.addActiveDocument = this.addActiveDocument.bind(this);
		this.noteFollowCursor  = this.noteFollowCursor.bind(this);
		this.placeNote         = this.placeNote.bind(this);
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
		this.drag.current.style.left = event.clientX - 108 + "px";
		this.drag.current.style.top = event.clientY - 84 + "px";
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
						<button className="toolbar-btn">
							<Icon name="edit" size={32} />
						</button>

						{/*-  -*/}
						<button className="toolbar-btn">
							<Icon name="delete" size={32} />
						</button>
					</div>
					<div className="editor-content">
						<h1 className="watermark">Quicknotes</h1>

						{/*- Notes cursor -*/}
						{this.state.placeNote.active && <div className="note-place" ref={this.drag}></div>}
						
						{/*- Notes -*/}
						{this.notes.map((data, index) => <Note data={data} key={index} index={index} />)}
					</div>
				</div>
			</main>
		)
	}
}

/*- Components -*/
class Note extends React.PureComponent {
	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {
			dragging: false,
			pos: {
				x: this.props.data.position.x,
				y: this.props.data.position.y,
			}
		};
		this.data = this.props.data;
		
		/*- Refs -*/
		this.drag = React.createRef();
		this.note = React.createRef();

		/*- Bindings -*/
	}

	/*- Methods -*/
	componentDidMount() {
		this.drag.current.addEventListener("mousedown", this.dragStart);
		window.addEventListener("mouseup", this.dragEnd);
		window.addEventListener("mousemove", this.dragMove);
	}

	componentWillUnmount() {
		this.drag.current.removeEventListener("mousedown", this.dragStart);
		window.removeEventListener("mouseup", this.dragEnd);
		window.removeEventListener("mousemove", this.dragMove);
	}

	/*- Event Handlers -*/
	dragStart = (e) => {
		this.setState({ dragging: true });
	}
	dragEnd = (e) => {
		this.setState({ dragging: false });
	}
	dragMove = (e) => {
		if (this.state.dragging) {
			this.setState({
				pos: {
					x: e.clientX - this.note.current.offsetWidth / 2,

					// Minus half the height of the note to center it - margin
					y: e.clientY - this.note.current.offsetHeight / 2 + this.note.current.offsetHeight / 2 - 20,
				}
			});
		}
	}

	/*- Render -*/
	render() {
		return (
			<div
				key={this.props.index}
				className="note"
				ref={this.note}
				style={{
					left: this.state.pos.x,
					top: this.state.pos.y
				}}
			>
				<header>
					<div className="actions">
						<div className="_1"></div>
						<div className="_2"></div>
						<div className="_3"></div>
					</div>
					<div className="stack" ref={this.drag}>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</header>
				<TextArea className="note-body" placeholder="Write something..." />
			</div>
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
		return <textarea {...this.props} onKeyUp={this.handleKeyDown} onKeyDown={this.handleKeyDown} />;
	}
}


/*- Exports -*/
export default Editor;
