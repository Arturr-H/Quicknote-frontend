import React from "react";
import { TextArea } from "../Editor";

/*- Components -*/
export class Note extends React.PureComponent {
	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {
			dragging: false,
			pos: {
				x: this.props.data.position.x,
				y: this.props.data.position.y,
			},
			focused: false,
		};
		this.data = this.props.data;

		/*- Refs -*/
		this.drag = React.createRef();
		this.note = React.createRef();
		this.body = React.createRef();

		/*- Statics -*/
		this.onDelete = this.props.onDelete;

		/*- Bindings -*/
	}

	/*- Methods -*/
	componentDidMount() {
		console.log("a", this.props.data);
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
	dragStart = (e) => { this.setState({ dragging: true }); };
	dragEnd = (e) => { this.setState({ dragging: false }); };
	dragMove = (e) => {
		if (this.state.dragging) {
			this.setState({
				pos: {
					x: Math.round((e.clientX - this.note.current.offsetWidth / 2) / this.props.gridSnap) * this.props.gridSnap,

					// Minus half the height of the note to center it - margin
					y: Math.round((e.clientY - this.note.current.offsetHeight / 2 + this.note.current.offsetHeight / 2 - 20) / this.props.gridSnap) * this.props.gridSnap,
				}
			});
		}
	};

	/*- Render -*/
	render() {
		return (
			<div
				key={this.props.index}
				className="item"
				ref={this.note}
				style={{
					left: this.state.pos.x,
					top: this.state.pos.y
				}}
			>
				<header>
					<div className="actions">
						<button className="_1" onClick={this.props.onDelete}></button>
						<button className="_2"></button>
						<button className="_3"></button>
					</div>
					<div className="stack" ref={this.drag}>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</header>
				<TextArea
					autoFocus
					ref={this.body}
					onResize={this.onResize}
					className="note-body"
					placeholder="Write something..."
					onFocus={() => this.setState({ focused: true })}
					onBlur={() => this.setState({ focused: false })}
					spellCheck={this.state.focused}
				/>
			</div>
		);
	}
}
