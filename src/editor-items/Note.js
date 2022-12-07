import React from "react";
import { Icon } from "../App";
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

			contextMenu: {
				x: 0,
				y: 0,
				actions: [],
				active: false
			},

			/*- Data -*/
			value: "",
		};
		this.data = this.props.data;

		/*- Refs -*/
		this.drag = React.createRef();
		this.note = React.createRef();
		this.body = React.createRef();

		/*- Statics -*/
		this.onDelete = this.props.onDelete;

		/*- Bindings -*/
		this.addList = this.addList.bind(this);
	}

	/*- Methods -*/
	componentDidMount() {
		this.drag.current.addEventListener("mousedown", () => {
			this.dragStart();
		});
		document.addEventListener("mouseup", this.dragEnd);
		document.addEventListener("mousemove", this.dragMove);
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
					{ name: "Add list", action: this.addList, icon: "edit" },
					{ separator: true },
					{ name: "Delete", action: this.onDelete, icon: "delete", tintColor: "red" },
				],
			}
		});
	};

	/*- Context menu actions -*/
	addList() {
		/*- Add " • " to textarea body -*/
		this.setState({ value: this.state.value + " • ", contextMenu: { active: false } });

		/*- Focus textarea -*/
		this.body.current.focus();
		
	}

	/*- Body changes -*/
	onChange = (e) => {
		this.setState({ value: e.target.value });
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
				onContextMenu={this.showContextMenu}
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
				<TextArea
					autoFocus
					_ref={this.body}
					onResize={this.onResize}
					className="note-body"
					placeholder="Write something..."
					onFocus={() => this.setState({ focused: true })}
					onBlur={() => this.setState({ focused: false })}
					spellCheck={this.state.focused}
					value={this.state.value}
					onChange={this.onChange}
				/>
			</div>
		);
	}
}
