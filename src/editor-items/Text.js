import React from "react";
import { Icon } from "../App";

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

			contextMenu: {
				x: 0,
				y: 0,
				actions: [],
				active: false
			},
			font_size: this.props.data.size.font_size,

			/*- Data -*/
			value: "",
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
		document.addEventListener("mousedown", (e) => {
			const CLICKABLE = ["context-menu-item", "context-menu-item noborder", "contextmenu", "icon", "context-button"];

			/*- Remove contextmenu if not click on it -*/
			if (!CLICKABLE.includes(e.target.className.split(" ")[0])) {
				this.setState({ contextMenu: { active: false } });
			}
		});
	}

	componentWillUnmount() {
		this.drag.current.removeEventListener("mousedown", this.dragStart);
		window.removeEventListener("mouseup", this.dragEnd);
		window.removeEventListener("mousemove", this.dragMove);
	}

	/*- Event Handlers -*/
	dragStart = (e) => {
		this.setState({ dragging: true });

		// Add border to show that it's being dragged
		this.text.current.style.outline = "3px solid rgb(97, 195, 84)";
	};
	dragEnd = (e) => {
		this.setState({ dragging: false });
		this.onChange(false, {
			x: this.state.pos.x,
			y: this.state.pos.y
		}, false);

		// Remove border
		this.text.current.style.outline = "none";
	};
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
	onChange = (content, position, size) => {
		this.props.onChange(
			content, position, size
		);
	};

	/*- Show context menu -*/
	showContextMenu = (e) => {
		let { clientX, clientY } = e;
		console.log(clientX, clientY);

		/*- E will be null sometimes because contextmenu can be
			triggered from pressing the second action button -*/
		if (e != null) e.preventDefault();
		else {}
		
		/*- Show context menu -*/
		this.setState({
			contextMenu: {
				active: true,
				x: clientX,
				y: clientY,
				actions: [
					{ name: "32px", icon: "text", action: () => this.changeFontSize(32) },
					{ name: "64px", icon: "text", action: () => this.changeFontSize(64) },
					{ name: "82px", icon: "text", action: () => this.changeFontSize(82) },
					{ name: "128px", icon: "text", action: () => this.changeFontSize(128) },
					{ separator: true },
					{ name: "Delete", action: this.onDelete, icon: "delete", tintColor: "red" },
				],
			}
		});
	};
	changeFontSize = (size) => {
		this.setState({
			contextMenu: {
				active: false
			},
			font_size: size
		});
		
		this.onChange(false, false, {
			width: this.props.data.size.width,
			height: this.props.data.size.height,
			font_size: size
		});
	};

	/*- Render -*/
	render() {
		return (
			<div
				key={this.props.index}
				className="item text"
				ref={this.text}
				onContextMenu={this.showContextMenu}
				style={{
					left: this.state.pos.x,
					top: this.state.pos.y,

					width: this.state.isResizing ? "auto" : this.width + 24,
					height: this.props.data.size.height,
				}}
			>
				{/*- Context menu -*/}
				{
					this.state.contextMenu.active && 
					<div className="contextmenu">
						{this.state.contextMenu.actions.map((action, index) => {

							/*- Render either Separator or context menu -*/
							return (action.separator === true) ? (
								<div className="context-menu-separator" key={index} />
							) : (
								<div
									className="context-menu-item"
									style={{
										left: this.state.contextMenu.x,
										top: this.state.contextMenu.y + (index * 40)
									}}
									key={index}
								>
									<Icon className="icon" name={action.icon} />
									<button
										className={"context-button" + (action.tintColor ? " colored-" + action.tintColor : "")}
										key={index}
										onClick={action.action}
									>{action.name}</button>
								</div>
							)
						})}
					</div>
				}
				<header>
					<div className="actions">
						<button className="_1" onClick={this.props.onDelete}></button>
						<button className="_2" onClick={this.showContextMenu}></button>
						<button className="_3"></button>
					</div>
					<div className="stack" ref={this.drag}>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</header>
					<input
						style={{
							fontSize: this.state.font_size + "px"
						}}
						autoFocus
						ref={this.body}
						className="text-body"
						placeholder="Write something..."
						value={this.props.data.content}
						onChange={(e) => this.onChange(e.target.value, false, false)}
					/>
			</div>
		);
	}
}
