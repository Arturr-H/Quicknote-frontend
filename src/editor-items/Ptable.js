import React from "react";
import { ContextMenu } from "../components/ContextMenu";
import { Icon } from "../components/Icon";
import { TextArea } from "../Editor";

/*- Components -*/
export class Ptable extends React.PureComponent {
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
		this.ptable = React.createRef();

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
		this.ptable.current.style.outline = "3px solid rgb(97, 195, 84)";
	};
	dragEnd = (_) => {
		this.setState({ dragging: false });

		// Remove border
		this.ptable.current.style.outline = "none";
	};
	dragMove = (e) => {
		if (this.state.dragging) {
			this.setState({
				pos: {
					x: Math.round((e.clientX - this.ptable.current.offsetWidth / 2) / this.props.gridSnap) * this.props.gridSnap,

					// Minus half the height of the ptable to center it - margin
					y: Math.round((e.clientY - this.ptable.current.offsetHeight / 2 + this.ptable.current.offsetHeight / 2 - 20) / this.props.gridSnap) * this.props.gridSnap,
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
				ref={this.ptable}
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
                <div className="ptable-container">
                    <PtableElement element="H" name="Väte"/>
					{/* <PtableBlock width="7" /> */}
                    <PtableElement element="He" name="Helium" type="1"/>
                    <PtableElement element="Li" name="Litium" type="2"/>
                    <PtableElement element="Be" name="Beryllium"/>
                    <PtableElement element="B" name="Bor"/>
                    <PtableElement element="C" name="Kol"/>
                    <PtableElement element="N" name="Kväve"/>
                    <PtableElement element="O" name="Syre"/>
                    <PtableElement element="F"/>
                    <PtableElement element="Ne"/>
                    <PtableElement element="Na"/>
                    <PtableElement element="Mg"/>
                    <PtableElement element="Al"/>
                    <PtableElement element="Si"/>
                    <PtableElement element="P"/>
                    <PtableElement element="S"/>
                    <PtableElement element="Cl"/>
                    <PtableElement element="Ar"/>
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />

                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                    <PtableElement />
                </div>
			</div>
		);
	}
}


class PtableElement extends React.PureComponent{
	render(){	
		return (
			
			/*Types
				Type 1: Icke-metaller
				Type 2: Ädelgaser
				Type 3: Alkalimetall
				Type 4: Alkalisk Jordartsmetall
				Type 5: Halvmetall
				Type 6: Övrig metall
				Type 7: Övergångsmetall
			*/
			<div className="ptable-element" id={this.props.element} element={this.props.element}>
				{
					this.props.name ?
					<p className="ptable-element-name" style={
						// {letterSpacing: `-${this.props.name.length >= 7 ? this.props.name.length / 20 - 3 : this.props.name.length/20}px`}
						{letterSpacing: `-${this.props.name.length/20 + 0.2}px`}
					}>{this.props.name}</p>
					: <></>
				}
			</div>
		)
	}
}