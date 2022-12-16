import React from "react";

/*- Icon -*/
export class Icon extends React.PureComponent {
	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {};

		/*- Static -*/
		this.left = this.props.left || false;
		this.href = this.props.href || null;
		this.right = this.props.right || false;
		this.size = this.props.size || 24;
		this.blackIcons = {
			"document-clear": require("../icons/black/document-clear.svg").default,
			"time-square"   : require("../icons/black/time-square.svg").default,
			"document"      : require("../icons/black/note.svg").default,
			"warning"       : require("../icons/black/warning.svg").default,
			"profile"       : require("../icons/black/profile.svg").default,
			"canvas"        : require("../icons/black/canvas.svg").default,
			"check"         : require("../icons/black/check.svg").default,
			"cross"         : require("../icons/black/cross.svg").default,
			"delete"        : require("../icons/black/delete.svg").default,
			"edit"          : require("../icons/black/edit.svg").default,
			"moon"          : require("../icons/black/moon.svg").default,
			"home"          : require("../icons/black/home.svg").default,
			"plus"          : require("../icons/black/plus.svg").default,
			"note"          : require("../icons/black/note.svg").default,
			"text"          : require("../icons/black/text.svg").default,
			"sun"           : require("../icons/black/sun.svg").default,
			"32x32"         : require("../icons/black/32x32.svg").default,
			"16x16"         : require("../icons/black/16x16.svg").default,
			"8x8"           : require("../icons/black/8x8.svg").default,
			"4x4"           : require("../icons/black/4x4.svg").default,
			"2x2"           : require("../icons/black/2x2.svg").default,
			"1x1"           : require("../icons/black/1x1.svg").default,
			"calculator-horizontal": require("../icons/black/calculator-horizontal.svg").default,
			"calculator-vertical"  : require("../icons/black/calculator-vertical.svg").default,
			"equals"               : require("../icons/black/equals.svg").default,
			"subtraction"          : require("../icons/black/subtraction.svg").default,
			"addition"             : require("../icons/black/addition.svg").default,
			"multiplication"       : require("../icons/black/multiplication.svg").default,
			"remove"               : require("../icons/black/remove.svg").default,
			"sqrt"                 : require("../icons/black/sqrt.svg").default,
			"one"  : require("../icons/black/numbers/one.svg").default,
			"two"  : require("../icons/black/numbers/two.svg").default,
			"three": require("../icons/black/numbers/three.svg").default,
			"four" : require("../icons/black/numbers/four.svg").default,
			"five" : require("../icons/black/numbers/five.svg").default,
			"six"  : require("../icons/black/numbers/six.svg").default,
			"seven": require("../icons/black/numbers/seven.svg").default,
			"eight": require("../icons/black/numbers/eight.svg").default,
			"nine" : require("../icons/black/numbers/nine.svg").default,
			"zero" : require("../icons/black/numbers/zero.svg").default,
		};
		this.whiteIcons = {
			"document-clear": require("../icons/white/document-clear.svg").default,
			"time-square"   : require("../icons/white/time-square.svg").default,
			"document"      : require("../icons/white/note.svg").default,
			"warning"       : require("../icons/white/warning.svg").default,
			"profile"       : require("../icons/white/profile.svg").default,
			"canvas"        : require("../icons/white/canvas.svg").default,
			"check"         : require("../icons/white/check.svg").default,
			"cross"         : require("../icons/white/cross.svg").default,
			"delete"        : require("../icons/white/delete.svg").default,
			"edit"          : require("../icons/white/edit.svg").default,
			"moon"          : require("../icons/white/moon.svg").default,
			"home"          : require("../icons/white/home.svg").default,
			"plus"          : require("../icons/white/plus.svg").default,
			"note"          : require("../icons/white/note.svg").default,
			"text"          : require("../icons/white/text.svg").default,
			"sun"           : require("../icons/white/sun.svg").default,
			"32x32"         : require("../icons/white/32x32.svg").default,
			"16x16"         : require("../icons/white/16x16.svg").default,
			"8x8"           : require("../icons/white/8x8.svg").default,
			"4x4"           : require("../icons/white/4x4.svg").default,
			"2x2"           : require("../icons/white/2x2.svg").default,
			"1x1"           : require("../icons/white/1x1.svg").default,
		};

		/*- Bindings -*/
	}

	getIcon = () => {
		return this.props.light ? (
			<img className="icon" src={this.whiteIcons[this.props.name || "question-circle"]} alt={this.props.name || "Nonexistent image :("} style={{ width: this.size, height: this.size }} />
		) : (
			<img className="icon" src={this.blackIcons[this.props.name || "question-circle"]} alt={this.props.name || "Nonexistent image :("} style={{ width: this.size, height: this.size }} />
		)
	}

	/*- Render -*/
	render() {
		return (
			<React.Fragment>
				{this.left && <div className="icon-margin"></div>}
				{this.href ? (
					<a href={this.href}>
						{this.getIcon()}
					</a>
				) : (
					this.getIcon()
				)}
				{this.right && <div className="icon-margin"></div>}
			</React.Fragment>
		);
	}
}
