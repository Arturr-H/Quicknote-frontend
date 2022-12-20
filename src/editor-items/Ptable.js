import React from "react";
import { ContextMenu } from "../components/ContextMenu";

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

		this.periodicTableData = [
			/*Type 1: Non-metals Type 2: Noble gases Type 3: Alkali metal Type 4: Alkaline earth metal Type 5: Semi-metal Type 6: Other metal Type 7: Transition metal, 8: Unknown, 9: lanthanoid, 10: Actinoid */
			{ element: "Hydrogen", symbol: "H", atomicNumber: 1, atomicMass: 1.008, type: 1 },
			{ element: "Helium", symbol: "He", atomicNumber: 2, atomicMass: 4.003, type: 2},
			{ element: "Lithium", symbol: "Li", atomicNumber: 3, atomicMass: 6.941, type: 3 },
			{ element: "Beryllium", symbol: "Be", atomicNumber: 4, atomicMass: 9.012, type: 4},
			{ element: "Boron", symbol: "B", atomicNumber: 5, atomicMass: 10.81, type: 5},
			{ element: "Carbon", symbol: "C", atomicNumber: 6, atomicMass: 12.011, type: 1 },
			{ element: "Nitrogen", symbol: "N", atomicNumber: 7, atomicMass: 14.007, type: 1 },
			{ element: "Oxygen", symbol: "O", atomicNumber: 8, atomicMass: 15.999, type: 1 },
			{ element: "Fluorine", symbol: "F", atomicNumber: 9, atomicMass: 18.998, type: 1 },
			{ element: "Neon", symbol: "Ne", atomicNumber: 10, atomicMass: 20.18, type: 2 },
			{ element: "Sodium", symbol: "Na", atomicNumber: 11, atomicMass: 22.99, type: 3 },
			{ element: "Magnesium", symbol: "Mg", atomicNumber: 12, atomicMass: 24.305, type: 4 },
			{ element: "Aluminum", symbol: "Al", atomicNumber: 13, atomicMass: 26.982, type: 6 },
			{ element: "Silicon", symbol: "Si", atomicNumber: 14, atomicMass: 28.085, type: 5 },
			{ element: "Phosphorus", symbol: "P", atomicNumber: 15, atomicMass: 30.974, type: 1 },
			{ element: "Sulfur", symbol: "S", atomicNumber: 16, atomicMass: 32.06, type: 1 },
			{ element: "Chlorine", symbol: "Cl", atomicNumber: 17, atomicMass: 35.45, type: 1 },
			{ element: "Argon", symbol: "Ar", atomicNumber: 18, atomicMass: 39.948, type: 2 },
			{ element: "Potassium", symbol: "K", atomicNumber: 19, atomicMass: 39.098, type: 3 },
			{ element: "Calcium", symbol: "Ca", atomicNumber: 20, atomicMass: 40.078, type: 4 },
			{ element: "Scandium", symbol: "Sc", atomicNumber: 21, atomicMass: 44.956, type: 7 },
			{ element: "Titanium", symbol: "Ti", atomicNumber: 22, atomicMass: 47.867, type: 7 },
			{ element: "Vanadium", symbol: "V", atomicNumber: 23, atomicMass: 50.942, type: 7 },
			{ element: "Chromium", symbol: "Cr", atomicNumber: 24, atomicMass: 51.996, type: 7 },
			{ element: "Manganese", symbol: "Mn", atomicNumber: 25, atomicMass: 54.938, type: 7 },
			{ element: "Iron", symbol: "Fe", atomicNumber: 26, atomicMass: 55.845, type: 7 },
			{ element: "Cobalt", symbol: "Co", atomicNumber: 27, atomicMass: 58.933, type: 7 },
			{ element: "Nickel", symbol: "Ni", atomicNumber: 28, atomicMass: 58.693, type: 7 },
			{ element: "Copper", symbol: "Cu", atomicNumber: 29, atomicMass: 63.546, type: 7 },
			{ element: "Zinc", symbol: "Zn", atomicNumber: 30, atomicMass: 65.38, type: 7 },
			{ element: "Gallium", symbol: "Ga", atomicNumber: 31, atomicMass: 69.723, type: 6 },
			{ element: "Germanium", symbol: "Ge", atomicNumber: 32, atomicMass: 72.63, type: 5 },
			{ element: "Arsenic", symbol: "As", atomicNumber: 33, atomicMass: 74.922, type: 5 },
			{ element: "Selenium", symbol: "Se", atomicNumber: 34, atomicMass: 78.971, type: 1 },
			{ element: "Bromine", symbol: "Br", atomicNumber: 35, atomicMass: 79.904, type: 1 },
			{ element: "Krypton", symbol: "Kr", atomicNumber: 36, atomicMass: 8, type: 2 },
			{ element: "Rubidium", symbol: "Rb", atomicNumber: 37, atomicMass: 85.468, type: 3 },
			{ element: "Strontium", symbol: "Sr", atomicNumber: 38, atomicMass: 87.62, type: 4 },
			{ element: "Yttrium", symbol: "Y", atomicNumber: 39, atomicMass: 88.906, type: 7 },
			{ element: "Zirconium", symbol: "Zr", atomicNumber: 40, atomicMass: 91.224, type: 7 },
			{ element: "Niobium", symbol: "Nb", atomicNumber: 41, atomicMass: 92.906, type: 7 },
			{ element: "Molybdenum", symbol: "Mo", atomicNumber: 42, atomicMass: 95.95, type: 7 },
			{ element: "Technetium", symbol: "Tc", atomicNumber: 43, atomicMass: 98, type: 7 },
			{ element: "Ruthenium", symbol: "Ru", atomicNumber: 44, atomicMass: 101.07, type: 7 },
			{ element: "Rhodium", symbol: "Rh", atomicNumber: 45, atomicMass: 102.91, type: 7 },
			{ element: "Palladium", symbol: "Pd", atomicNumber: 46, atomicMass: 106.42, type: 7 },
			{ element: "Silver", symbol: "Ag", atomicNumber: 47, atomicMass: 107.87, type: 7 },
			{ element: "Cadmium", symbol: "Cd", atomicNumber: 48, atomicMass: 112.41, type: 7 },
			{ element: "Indium", symbol: "In", atomicNumber: 49, atomicMass: 114.82, type: 6 },
			{ element: "Tin", symbol: "Sn", atomicNumber: 50, atomicMass: 118.71, type: 6 },
			{ element: "Antimony", symbol: "Sb", atomicNumber: 51, atomicMass: 121.76, type: 5 },
			{ element: "Tellurium", symbol: "Te", atomicNumber: 52, atomicMass: 127.6, type: 5 },
			{ element: "Iodine", symbol: "I", atomicNumber: 53, atomicMass: 126.9, type: 1 },
			{ element: "Xenon", symbol: "Xe", atomicNumber: 54, atomicMass: 131.29, type: 2 },
			{ element: "Cesium", symbol: "Cs", atomicNumber: 55, atomicMass: 132.91, type: 3 },
			{ element: "Barium", symbol: "Ba", atomicNumber: 56, atomicMass: 137.33, type: 4 },
			{ element: "Lanthanum", symbol: "La", atomicNumber: 57, atomicMass: 138.91, type: 9 },
			{ element: "Cerium", symbol: "Ce", atomicNumber: 58, atomicMass: 140.12, type: 9 },
			{ element: "Praseodymium", symbol: "Pr", atomicNumber: 59, atomicMass: 140.91, type: 9 },
			{ element: "Neodymium", symbol: "Nd", atomicNumber: 60, atomicMass: 144.24, type: 9 },
			{ element: "Promethium", symbol: "Pm", atomicNumber: 61, atomicMass: 145, type: 9 },
			{ element: "Samarium", symbol: "Sm", atomicNumber: 62, atomicMass: 150.36, type: 9 },
			{ element: "Europium", symbol: "Eu", atomicNumber: 63, atomicMass: 151.96, type: 9 },
			{ element: "Gadolinium", symbol: "Gd", atomicNumber: 64, atomicMass: 157.25, type: 9 },
			{ element: "Terbium", symbol: "Tb", atomicNumber: 65, atomicMass: 158.93, type: 9 },
			{ element: "Dysprosium", symbol: "Dy", atomicNumber: 66, atomicMass: 162.5, type: 9 },
			{ element: "Holmium", symbol: "Ho", atomicNumber: 67, atomicMass: 164.93, type: 9 },
			{ element: "Erbium", symbol: "Er", atomicNumber: 68, atomicMass: 167.26, type: 9 },
			{ element: "Thulium", symbol: "Tm", atomicNumber: 69, atomicMass: 168.93, type: 9 },
			{ element: "Ytterbium", symbol: "Yb", atomicNumber: 70, atomicMass: 173.05, type: 9 },
			{ element: "Lutetium", symbol: "Lu", atomicNumber: 71, atomicMass: 174.97, type: 9 },
			{ element: "Hafnium", symbol: "Hf", atomicNumber: 72, atomicMass: 178.49, type: 7 },
			{ element: "Tantalum", symbol: "Ta", atomicNumber: 73, atomicMass: 180.95, type: 7 },
			{ element: "Tungsten", symbol: "W", atomicNumber: 74, atomicMass: 183.84, type: 7 },
			{ element: "Rhenium", symbol: "Re", atomicNumber: 75, atomicMass: 186.21, type: 7 },
			{ element: "Osmium", symbol: "Os", atomicNumber: 76, atomicMass: 190.23, type: 7 },
			{ element: "Iridium", symbol: "Ir", atomicNumber: 77, atomicMass: 192.22, type: 7 },
			{ element: "Platinum", symbol: "Pt", atomicNumber: 78, atomicMass: 195.08, type: 7 },
			{ element: "Gold", symbol: "Au", atomicNumber: 79, atomicMass: 196.97, type: 7 },
			{ element: "Mercury", symbol: "Hg", atomicNumber: 80, atomicMass: 200.59, type: 7 },
			{ element: "Thallium", symbol: "Tl", atomicNumber: 81, atomicMass: 204.38, type: 6 },
			{ element: "Lead", symbol: "Pb", atomicNumber: 82, atomicMass: 207.2, type: 6 },
			{ element: "Bismuth", symbol: "Bi", atomicNumber: 83, atomicMass: 208.98, type: 6 },
			{ element: "Polonium", symbol: "Po", atomicNumber: 84, atomicMass: 209, type: 5 },
			{ element: "Astatine", symbol: "At", atomicNumber: 85, atomicMass: 210,	type: 1 },
			{ element: "Radon", symbol: "Rn", atomicNumber: 86, atomicMass: 222, type: 2 },
			{ element: "Francium", symbol: "Fr", atomicNumber: 87, atomicMass: 223, type: 3 },
			{ element: "Radium", symbol: "Ra", atomicNumber: 88, atomicMass: 226, type: 4 },
			{ element: "Actinium", symbol: "Ac", atomicNumber: 89, atomicMass: 227, type: 10 },
			{ element: "Thorium", symbol: "Th", atomicNumber: 90, atomicMass: 232.04, type: 10 },
			{ element: "Protactinium", symbol: "Pa", atomicNumber: 91, atomicMass: 231.04, type: 10 },
			{ element: "Uranium", symbol: "U", atomicNumber: 92, atomicMass: 238.03, type: 10 },
			{ element: "Neptunium", symbol: "Np", atomicNumber: 93, atomicMass: 237, type: 10 },
			{ element: "Plutonium", symbol: "Pu", atomicNumber: 94, atomicMass: 244, type: 10 },
			{ element: "Americium", symbol: "Am", atomicNumber: 95, atomicMass: 243, type: 10 },
			{ element: "Curium", symbol: "Cm", atomicNumber: 96, atomicMass: 247, type: 10 },
			{ element: "Berkelium", symbol: "Bk", atomicNumber: 97, atomicMass: 247, type: 10 },
			{ element: "Californium", symbol: "Cf", atomicNumber: 98, atomicMass: 251, type: 10 },
			{ element: "Einsteinium", symbol: "Es", atomicNumber: 99, atomicMass: 252, type: 10 },
			{ element: "Fermium", symbol: "Fm", atomicNumber: 100, atomicMass: 257, type: 10 },
			{ element: "Mendelevium", symbol: "Md", atomicNumber: 101, atomicMass: 258, type: 10 },
			{ element: "Nobelium", symbol: "No", atomicNumber: 102, atomicMass: 259, type: 10 },
			{ element: "Lawrencium", symbol: "Lr", atomicNumber: 103, atomicMass: 262, type: 10 },
			{ element: "Rutherfordium", symbol: "Rf", atomicNumber: 104, atomicMass: 261, type: 7 },
			{ element: "Dubnium", symbol: "Db", atomicNumber: 105, atomicMass: 262, type: 7 },
			{ element: "Seaborgium", symbol: "Sg", atomicNumber: 106, atomicMass: 266, type: 7 },
			{ element: "Bohrium", symbol: "Bh", atomicNumber: 107, atomicMass: 264, type: 7 },
			{ element: "Hassium", symbol: "Hs", atomicNumber: 108, atomicMass: 277, type: 7 },
			{ element: "Meitnerium", symbol: "Mt", atomicNumber: 109, atomicMass: 268, type: 8 },
			{ element: "Darmstadtium", symbol: "Ds", atomicNumber: 110, atomicMass: 271, type: 8 },
			{ element: "Roentgenium", symbol: "Rg", atomicNumber: 111, atomicMass: 272, type: 8 },
			{ element: "Copernicium", symbol: "Cn", atomicNumber: 112, atomicMass: 285, type: 8 },
			{ element: "Nihonium", symbol: "Nh", atomicNumber: 113, atomicMass: 284, type: 8 },
			{ element: "Flerovium", symbol: "Fl", atomicNumber: 114, atomicMass: 289, type: 8 },
			{ element: "Moscovium", symbol: "Mc", atomicNumber: 115, atomicMass: 288, type: 8 },
			{ element: "Livermorium", symbol: "Lv", atomicNumber: 116, atomicMass: 293, type: 8 },
			{ element: "Tennessine", symbol: "Ts", atomicNumber: 117, atomicMass: 294, type: 8 },
			{ element: "Oganesson", symbol: "Og", atomicNumber: 118, atomicMass: 294, type: 8 },
		];
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
		if (!this.ptable.current) return;
		this.setState({ dragging: true });
	
		// Add border to show that it's being dragged
		this.ptable.current.style.outline = "3px solid rgb(97, 195, 84)";
	};
	dragEnd = (_) => {
		if (!this.ptable.current) return;
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
                <div className="ptable-container" ref={this.ptable}>
<<<<<<< HEAD
                    {
						this.periodicTableData.map((element, index) => {
							return (
								<PtableElement
									key={index}
									element={element.symbol}
									name={element.element}
									type={element.type}
								/>
							);
						})
					}
                </div>
=======
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
>>>>>>> 183e2ab09396e37d2ae71bba0d5ab1933635b2f2
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
			<div className={`ptable-element t${this.props.type}`} id={this.props.element} element={this.props.element}>
				{
					this.props.name ?
					<p className="ptable-element-name" style={
						{letterSpacing: `-${this.props.name.length >= 7 ? .2 + this.props.name.length/15 : this.props.name.length/20}px`}
						// {letterSpacing: `-${this.props.name.length/20 + 0.2}px`}
					}>{this.props.name}</p>
					: null
				}
			</div>
		)
	}
}