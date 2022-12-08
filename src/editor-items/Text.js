import React from "react";

export class Text extends React.PureComponent {
	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {
			dragging: false,
			pos: {
				x: this.props.data.position.x,
				y: this.props.data.position.y,
			},
			isResizing: false,
		};
		this.data = this.props.data;

		/*- Refs -*/
		this.drag = React.createRef();
		this.text = React.createRef();
		this.body = React.createRef();

		/*- Statics -*/
		this.onDelete = this.props.onDelete;
		this.width = this.props.data.size.width;

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
	dragStart = (e) => { this.setState({ dragging: true }); };
	dragEnd = (e) => { this.setState({ dragging: false }); };
	dragMove = (e) => {
		if (this.state.dragging) {
			this.setState({
				pos: {
					x: Math.round((e.clientX - this.text.current.offsetWidth / 2) / this.props.gridSnap) * this.props.gridSnap,

					// Minus half the height of the note to center it - margin
					y: Math.round((e.clientY - this.text.current.offsetHeight / 2 + this.text.current.offsetHeight / 2 - 20) / this.props.gridSnap) * this.props.gridSnap,
				}
			});
		}
	};
	onChange = (e) => {
		this.props.onChange(
			e.target.value
		);
	};
	onResize = (e) => {
		this.setState({ isResizing: true });
	};
	onResizeEnd = (e) => {
		this.setState({ isResizing: false });

		/*- Set the width of the note to the width of the text -*/
		this.width = this.body.current.offsetWidth;
	};

	/*- Render -*/
	render() {
		return (
			<div
				key={this.props.index}
				className="item text"
				ref={this.text}
				style={{
					left: this.state.pos.x,
					top: this.state.pos.y,

					width: this.state.isResizing ? "auto" : this.width + 24,
					height: this.props.data.size.height,
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
				<div className="resize" onMouseDown={this.onResize} onMouseUp={this.onResizeEnd}>
					<input
						style={{
							fontSize: this.props.data.size.height - 120,
						}}
						autoFocus
						ref={this.body}
						onResize={this.onResize}
						className="text-body"
						placeholder="Write something..."
						value={this.props.data.content}
						onChange={this.onChange}
					/>
				</div>
			</div>
		);
	}
}
