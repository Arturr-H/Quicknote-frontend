import React from "react";
import { ContextMenu } from "../components/ContextMenu";
import { Icon } from "../components/Icon";
import { TextArea } from "../Editor";

/*- Components -*/
export class Calculator extends React.PureComponent {
	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {
			dragging: false,
			pos: {
				x: "100px",
				y: "0px",
			},
			contextMenu: {
				actions: [],
				active: false
			},
		};

		/*- Refs -*/
		this.drag = React.createRef();
		this.calculator = React.createRef();

		/*- Statics -*/
		this.onDelete = this.props.onDelete;
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
	dragStart = (_) => {
		this.setState({ dragging: true });
	
		// Add border to show that it's being dragged
		this.calculator.current.style.outline = "3px solid rgb(97, 195, 84)";
	};
	dragEnd = (_) => {
		this.setState({ dragging: false });

		// Remove border
		this.calculator.current.style.outline = "none";
	};
	dragMove = (e) => {
		if (this.state.dragging) {
			this.setState({
				pos: {
					x: Math.round((e.clientX - this.calculator.current.offsetWidth / 2) / this.props.gridSnap) * this.props.gridSnap,

					// Minus half the height of the calculator to center it - margin
					y: Math.round((e.clientY - this.calculator.current.offsetHeight / 2 + this.calculator.current.offsetHeight / 2 - 20) / this.props.gridSnap) * this.props.gridSnap,
				}
			});
		}
	};

	/*- Show context menu -*/
	showContextMenu = (e) => {
		let { clientX, clientY } = e;

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
					{ name: "Add list", action: () => {}, icon: "edit" },
					{ separator: true },
					{ name: "Delete", action: this.onDelete, icon: "delete", tintColor: "red" },
					{ name: "Clear", action: () => {}, icon: "document-clear", tintColor: "red" },
				],
			}
		});
	};

	/*- Render -*/
	render() {
		return (
			<div
				key={this.props.index}
				className="item"
				ref={this.calculator}
				style={{
					left: this.state.pos.x,
					top: this.state.pos.y
				}}
				onContextMenu={this.showContextMenu}
			>

				{/*- Context menu -*/}
				{
					this.state.contextMenu.active && 
					<ContextMenu actions={this.state.contextMenu.actions} />
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
                <div className="calculator-container">
                    <div className="display">
                        <p>Hejsan</p>
                    </div>
                    <div className="buttons">
                        <div className="row">
                            <button>CE</button>
                            <button><Icon name="sqrt" size={32} darkMode={this.props.darkMode} /></button>
                            <button><Icon name="remove" size={32} darkMode={this.props.darkMode} /></button>
                            <button><Icon name="remove" size={32} darkMode={this.props.darkMode} /></button>
                        </div>
                        <div className="row">
                            <button className="number"><Icon name="one" size={32} darkMode={this.props.darkMode} /></button>
                            <button className="number"><Icon name="two" size={32} darkMode={this.props.darkMode} /></button>
                            <button className="number"><Icon name="three" size={32} darkMode={this.props.darkMode} /></button>
                            <button className="operator"><Icon name="multiplication" size={32} darkMode={this.props.darkMode} /></button>
                        </div>
                        <div className="row">
                            <button className="number"><Icon name="four" size={32} darkMode={this.props.darkMode} /></button>
                            <button className="number"><Icon name="five" size={32} darkMode={this.props.darkMode} /></button>
                            <button className="number"><Icon name="six" size={32} darkMode={this.props.darkMode} /></button>
                            <button className="operator"><Icon name="subtraction" size={32} darkMode={this.props.darkMode} /></button>
                        </div>
                        <div className="row">
                            <button className="number"><Icon name="seven" size={32} darkMode={this.props.darkMode} /></button>
                            <button className="number"><Icon name="eight" size={32} darkMode={this.props.darkMode} /></button>
                            <button className="number"><Icon name="nine" size={32} darkMode={this.props.darkMode} /></button>
                            <button className="operator"><Icon name="addition" size={32} darkMode={this.props.darkMode} /></button>
                        </div>
                        <div className="row">
                            <button className="wide number"><Icon name="zero" size={32} darkMode={this.props.darkMode} /></button>
                            <button className="number">•</button>
                            <button className="operator"><Icon name="equals" size={32} darkMode={this.props.darkMode} /></button>
                        </div>
                    </div>
                </div>
			</div>
		);
	}
}
