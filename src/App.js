/*- Imports -*/
import "./App.css";
import React from "react";

/*- Main -*/
class App extends React.PureComponent {
	render() {
		return (
			<main>
				<nav>
					<div>
						<h1>Quicknote</h1>
					</div>
					<div>
						<a className="text-link" href="/signup">Sign Up</a>
						<a className="text-link" href="/login">Log In</a>
					</div>
				</nav>
				<div className="main">
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
					<Card />
				</div>
			</main>
		)
	}
}

/*- Components -*/
class Card extends React.PureComponent {
	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {};

		/*- Static -*/
		this.title       = this.props.title || "Unnamed note";
		this.description = this.props.description || "No description provided";
		this.date        = this.props.date || Date.now();
		this.author      = this.props.author || "Unknown author";
		this.href        = this.props.href || "/unknown";

		/*- Bindings -*/
		this._date = this._date.bind(this);
	}

	/*- Convert unix time to yyyy-mm-dd -*/
	_date(unix) {
		let date = new Date(unix);

		let year  = date.getFullYear();
		let month = ("0" + date.getMonth() + 1).slice(-2);
		let day   = ("0" + date.getDate()).slice(-2);

		return `${year}-${month}-${day}`;
	}

	/*- Render -*/
	render() {
		return (
			<a href={"/editor" + this.href} target="blank">
				<div className="card">
					<div className="text">
						<h2>{this.title}</h2>
						<p>{this.description}</p>
					</div>

					{/*- Extra data -*/}
					<footer>
						{/*- Created at -*/}
						<div>
							<Icon right name="time-square" />
							<p>{this._date(this.date)}</p>
						</div>

						<Vr />

						{/*- Author -*/}
						<div>
							<Icon right name="profile" />
							<p>{this.author}</p>
						</div>
					</footer>
				</div>
			</a>
		)
	}
}

/*- Vertical rule -*/
function Vr() {
	return (
		<div className="vertical-rule"></div>
	)
}

/*- Icon -*/
class Icon extends React.PureComponent {
	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {};

		/*- Static -*/
		this.left = this.props.left || false;
		this.href = this.props.href || null;
		this.right = this.props.right || false;
		this.name = this.props.name || "question-circle";
		this.size = this.props.size || 24;
		this.icons = {
			"document-clear": require("./icons/document-clear.svg").default,
			"more-circle"   : require("./icons/more-circle.svg").default,
			"edit-square"   : require("./icons/edit-square.svg").default,
			"time-square"   : require("./icons/time-square.svg").default,
			"arrow-down"    : require("./icons/arrow-down.svg").default,
			"arrow-up"      : require("./icons/arrow-up.svg").default,
			"category"      : require("./icons/category.svg").default,
			"profile"       : require("./icons/profile.svg").default,
			"document"      : require("./icons/document.svg").default,
			"search"        : require("./icons/search.svg").default,
			"delete"        : require("./icons/delete.svg").default,
			"filter"        : require("./icons/filter.svg").default,
			"folder"        : require("./icons/folder.svg").default,
			"edit"          : require("./icons/edit.svg").default,
			"home"          : require("./icons/home.svg").default,
			"show"          : require("./icons/show.svg").default,
		};

		/*- Bindings -*/
	}

	/*- Render -*/
	render() {
		return (
			<React.Fragment>
				{this.left && <div className="icon-margin"></div>}
				{this.href ? (
					<a href={this.href}>
						<img className="icon" src={this.icons[this.name]} alt={this.name} style={{ width: this.size, height: this.size }} />
					</a>
				): (
					<img className="icon" src={this.icons[this.name]} alt={this.name} style={{ width: this.size, height: this.size }} />
				)}
				{this.right && <div className="icon-margin"></div>}
			</React.Fragment>
		)
	}
}

/*- Exports -*/
export { App, Icon };
