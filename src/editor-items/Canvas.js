import React from "react";
import { ContextMenu } from "../components/ContextMenu";
import { Icon } from "../components/Icon";

/*- Constants -*/
const BACKEND_URL = "http://localhost:8080/";

/*- Components -*/
export class Canvas extends React.PureComponent {
	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {
			dragging: false,
			pos: {
				x: this.props.data.position.x,
				y: this.props.data.position.y,
			},
			contextMenu: {
				x: 0,
				y: 0,
				actions: [],
				active: false
			},

			/*- Data -*/
			canvas: {
				drawing: false,
				ctx: null,
				color: "#000000",
				content: "",
			}
		};
		this.data = this.props.data;

		/*- Refs -*/
		this.drag = React.createRef();
		this.canvas = React.createRef();
		this.canvasRef = React.createRef();
		this.canvasHoverRef = React.createRef();

		/*- Statics -*/
		this.onDelete = this.props.onDelete;

		/*- Bindings -*/
		this.changeCanvasColor = this.changeCanvasColor.bind(this);
	}

	/*- Methods -*/
	componentDidMount() {
		this.drag.current.addEventListener("mousedown", this.dragStart);
		document.addEventListener("mouseup", this.dragEnd);
		document.addEventListener("mousemove", this.dragMove);
		document.addEventListener("mousedown", (e) => {
			const CLICKABLE = ["context-menu-item", "context-menu-item noborder", "contextmenu", "icon", "context-button"];

			/*- Remove contextmenu if not click on it -*/
			if (!CLICKABLE.includes(e.target.className.split(" ")[0])) {
				this.setState({ contextMenu: { active: false } });
			}
		});
		console.log(this.data.id);

		/*- Set canvas position / previous image -*/
		this.canvasRef.current.style.left = this.data.position.x + "px";
		this.canvasRef.current.style.top = this.data.position.y + "px";

		/*- Set canvas content / previous image -*/
		const canvas = this.canvasRef.current.getContext("2d");
		
		/*- Grab image content -*/
		console.log(BACKEND_URL + this.props.id + "-" + this.data.id);
		try {
			fetch(BACKEND_URL + this.props.id + "-" + this.data.id).then(e => e.blob()).then(async e => {
				var image = new Image();
				image.src = await e.text();
				image.onload = function() {
					canvas.drawImage(image, 0, 0);
				};
			}).catch(e => {});
		} catch { };

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
		this.canvas.current.style.outline = "3px solid rgb(97, 195, 84)";
	};
	dragEnd = (_) => {
		/*- Update pos -*/
		this.setState({ dragging: false });
		this.onChange(false, this.state.pos, false);

		// Remove border
		this.canvas.current.style.outline = "none";
	};
	dragMove = (e) => {
		if (this.state.dragging) {
			this.setState({
				pos: {
					x: Math.round((e.clientX - this.canvas.current.offsetWidth / 2) / this.props.gridSnap) * this.props.gridSnap,

					// Minus half the height of the canvas to center it - margin
					y: Math.round((e.clientY - this.canvas.current.offsetHeight / 2 + this.canvas.current.offsetHeight / 2 - 20) / this.props.gridSnap) * this.props.gridSnap,
				}
			});
		}
	};

	/*- On change -*/
	onChange = (content, position, size) => {
		this.props.onChange(content, position, size);
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
					{ color:true, name: "Black", value: "#000000", action: () => this.changeCanvasColor("#000000") },
					{ color:true, name: "White", value: "#ffffff", action: () => this.changeCanvasColor("#ffffff") },
					{ color:true, name: "Aqua", value: "#00ffff", action: () => this.changeCanvasColor("#00ffff") },
					{ color:true, name: "Purple", value: "#462446", action: () => this.changeCanvasColor("#462446") },
					{ color:true, name: "Yellow", value: "#ffc153", action: () => this.changeCanvasColor("#ffc153") },
					
					{ separator: true },
					{ name: "Clear", action: this.clearCanvas, icon: "document-clear", tintColor: "red" },
					{ name: "Delete", action: this.onDelete, icon: "delete", tintColor: "red" },
				],
			}
		});
	};

	/*- Canvas methods -*/
	onMouseDown = (e) => {
		/*- Draw a small circle to make the line round -*/
		this.drawRound(e);

		let ctx = this.state.canvas.ctx ?? this.canvasRef.current.getContext("2d");

		/*- Start drawing -*/
		ctx.beginPath();
		ctx.moveTo(
			e.clientX - this.canvasRef.current.offsetLeft - this.state.pos.x,
			e.clientY - this.canvasRef.current.offsetTop - this.state.pos.y
		);
		ctx.strokeStyle = this.state.canvas.color;
		ctx.lineWidth = 5;

		this.setState({
			canvas: {
				drawing: true,
				ctx,
			}
		});
	};
	onMouseUp = (e) => {
		let ctx = this.state.canvas.ctx ?? this.canvasRef.current.getContext("2d");

		/*- Stop drawing -*/
		ctx.closePath();

		/*- Draw a small circle to make the line round -*/
		if (this.state.canvas.drawing) this.drawRound(e);

		/*- Reset state -*/
		this.setState({
			canvas: {
				drawing: false,
				ctx,
			}
		});
		this.saveCanvasContent();
	};
	onMouseMove = (e) => {
		if (this.state.canvas.drawing) {
			let ctx = this.state.canvas.ctx;
			ctx.strokeStyle = this.state.canvas.color;
			ctx.lineTo(
				e.clientX - this.canvasRef.current.offsetLeft - this.state.pos.x,
				e.clientY - this.canvasRef.current.offsetTop - this.state.pos.y
			);
			ctx.stroke();

			this.setState({
				canvas: {
					drawing: true,
					ctx,
				}
			});
		}
		this.renderHoverCursor(e);
	};
	stopMouse = (e) => {
		/*- Clear hover cursor -*/
		this.canvasHoverRef.current.getContext("2d").clearRect(0, 0, this.canvasHoverRef.current.width, this.canvasHoverRef.current.height);

		/*- Reset state -*/
		this.setState({
			canvas: {
				drawing: false,
			}
		});
		this.saveCanvasContent();
	};
	drawRound = (e) => {
		let ctx = this.state.canvas.ctx ?? this.canvasRef.current.getContext("2d");
		ctx.beginPath();
		ctx.arc(
			e.clientX - this.canvasRef.current.offsetLeft - this.state.pos.x,
			e.clientY - this.canvasRef.current.offsetTop - this.state.pos.y,
			3,
			0,
			2 * Math.PI
		);
		ctx.fillStyle = this.state.canvas.color;
		ctx.fill();
		ctx.closePath();
	}
	clearCanvas = () => {
		let ctx = this.state.canvas.ctx || this.canvasRef.current.getContext("2d");
		ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);

		this.setState({
			canvas: {
				drawing: false,
				ctx,
			},
			contextMenu: {
				active: false,
			}
		});
		this.saveCanvasContent();
	};
	changeCanvasColor(color) {
		this.setState({
			canvas: { color },
			contextMenu: {
				active: false,
			}
		});
	};
	renderHoverCursor = (e) => {
		/*- Render a small circle on the canvas that follows the cursor -*/
		let ctx = this.canvasHoverRef.current.getContext("2d");
		ctx.clearRect(0, 0, this.canvasHoverRef.current.width, this.canvasHoverRef.current.height);
		ctx.beginPath();
		ctx.arc(
			e.clientX - this.canvasHoverRef.current.offsetLeft - this.state.pos.x,
			e.clientY - this.canvasHoverRef.current.offsetTop - this.state.pos.y,
			3,
			0,
			2 * Math.PI
		);
		ctx.fillStyle = this.state.canvas.color;
		ctx.fill();
		ctx.closePath();
	};
	removeHoverCursor = () => {
		let ctx = this.state.canvas.ctx ?? this.canvasRef.current.getContext("2d");
		ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
	};
	saveCanvasContent = () => {
		const content = this.canvasRef.current.toDataURL("image/jpg");
		this.onChange(content, false, false);
	}


	/*- Render -*/
	render() {
		return (
			<div
				key={this.props.index}
				className="item"
				ref={this.canvas}
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

				{/*- Header -*/}
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

				{/*- Body -*/}
				<canvas
					width={this.props.width}
					height={this.props.height}
					style={{
						width: this.props.width,
						height: this.props.height,
						cursor: "none"
					}}
					ref={this.canvasRef}

					/*- Canvas Drawing -*/
  					onMouseDown={this.onMouseDown}
					onMouseUp={this.onMouseUp}
					onMouseMove={this.onMouseMove}
					onMouseLeave={this.stopMouse}
					onMouseOut={this.stopMouse}
				/>
				<canvas
					width={this.props.width}
					height={this.props.height}
					style={{
						width: this.props.width,
						height: this.props.height,
						cursor: "none",
						position: "absolute",
						pointerEvents: "none"
					}}
					ref={this.canvasHoverRef}
				/>
			</div>
		);
	}
}
