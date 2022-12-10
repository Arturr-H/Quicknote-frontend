/*- Imports -*/
import "./App.css";
import React from "react";

/*- Constants -*/
const BACKEND_URL = "http://localhost:8080/";

/*- Main -*/
class App extends React.PureComponent {
	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {
			docs: [],
			modal: false
		};

		/*- Static -*/
	}

	/*- Default methods -*/
	componentDidMount() {
		/*- Fetch data -*/
		fetch(BACKEND_URL + "get-documents", {
			method: "GET",
			headers: {
				"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFydHVyIiwidWlkIjoiOTc2OWUyNjYtNzY1Ny00YzM4LTkxNTYtMjEyMzhkODc3ZDIyIiwic3VpZCI6IjRiM2ZkNDczZjU0YzQyY2ViNmVjNTEyNTk2MzgyNWM2IiwiZXhwIjoxNjcxNDAzMTU4fQ.7zYufEzb1eiXVyM9GMtlfSU-YBHOJ_Jo7jLWvYhsGW4"
			}
		}).then(async res => {
			this.setState({ docs: await res.json() });
		});
	}

	/*- Methods -*/
	createDocument = (title, description) => {
		fetch(BACKEND_URL + "add-doc", {
			method: "GET",
			headers: {
				"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFydHVyIiwidWlkIjoiOTc2OWUyNjYtNzY1Ny00YzM4LTkxNTYtMjEyMzhkODc3ZDIyIiwic3VpZCI6IjRiM2ZkNDczZjU0YzQyY2ViNmVjNTEyNTk2MzgyNWM2IiwiZXhwIjoxNjcxNDAzMTU4fQ.7zYufEzb1eiXVyM9GMtlfSU-YBHOJ_Jo7jLWvYhsGW4",
				"title": title,
				"description": description
			}
		}).then(async res => {
			const { id } = await res.json();

			window.location.href = "/editor/" + id;
		});
	}

	/*- If click item doesn't have modal-target-selector id, close modal -*/
	onClick = (e) => {
		if (!e.target.closest(".modal-target-selector") && this.state.modal === true) {
			this.setState({ modal: false });
		}
	}
	showModal = () => {
		this.setState({ modal: true }, () => {
			console.log(this.state.modal);
		});
	}

	render() {
		return (
			<main onClick={this.onClick}>
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
					{
						this.state.docs.map((data, index) => 
							<Card
								key={index}
								title={data.title}
								description={data.description}
								date={data.date}
								author={data.author}
								href={data.id}
							/>
						)
					}
					{this.state.modal === true ? <CreateDocument create={this.createDocument} /> : null}

					{/*- Add new note -*/}
					<div className="card" onClick={this.showModal}>
						<div className="add-icon-container">
							<Icon name="edit" size={90} />
							<p>Create document</p>
						</div>
					</div>
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
		this.href        = this.props.href || "unknown";

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
			<a href={"/editor/" + this.href} target="blank">
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
		this.size = this.props.size || 24;
		this.icons = {
			"document-clear": require("./icons/document-clear.svg").default,
			"more-circle"   : require("./icons/more-circle.svg").default,
			"edit-square"   : require("./icons/edit-square.svg").default,
			"time-square"   : require("./icons_/time-square.svg").default,
			"arrow-down"    : require("./icons/arrow-down.svg").default,
			"arrow-up"      : require("./icons/arrow-up.svg").default,
			"category"      : require("./icons/category.svg").default,
			"profile"       : require("./icons_/profile.svg").default,
			"document"      : require("./icons_/note.svg").default,
			"canvas"        : require("./icons_/canvas.svg").default,
			"search"        : require("./icons/search.svg").default,
			"delete"        : require("./icons/delete.svg").default,
			"filter"        : require("./icons/filter.svg").default,
			"folder"        : require("./icons/folder.svg").default,
			"edit"          : require("./icons_/edit.svg").default,
			"home"          : require("./icons/home.svg").default,
			"show"          : require("./icons/show.svg").default,
			"plus"          : require("./icons_/plus.svg").default,
			"note"          : require("./icons_/note.svg").default,
			"text"          : require("./icons_/text.svg").default,
			"32x32"			: require("./icons_/32x32.svg").default,
			"16x16"			: require("./icons_/16x16.svg").default,
			"8x8"  			: require("./icons_/8x8.svg").default,
			"4x4"  			: require("./icons_/4x4.svg").default,
			"2x2"  			: require("./icons_/2x2.svg").default,
			"1x1"  			: require("./icons_/1x1.svg").default,
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
						<img className="icon" src={this.icons[this.props.name || "question-circle"]} alt={this.props.name || "Nope :("} style={{ width: this.size, height: this.size }} />
					</a>
				): (
					<img className="icon" src={this.icons[this.props.name || "question-circle"]} alt={this.props.name || "Nonexistent image :("} style={{ width: this.size, height: this.size }} />
				)}
				{this.right && <div className="icon-margin"></div>}
			</React.Fragment>
		)
	}
}

/*- Create document modal, with document name and description -*/
class CreateDocument extends React.PureComponent {
	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {
			title: "",
			description: "",
		};

		/*- Bindings -*/
		this._change_description = this._change_description.bind(this);
		this._change_title = this._change_title.bind(this);
		this._create = this._create.bind(this);
	}

	/*- Change -*/
	_change_description(e) {
		this.setState({ description: e.target.value });
	}
	_change_title(e) {
		this.setState({ title: e.target.value });
	}

	/*- Create -*/
	_create() {
		if (this.state.title.length > 0) {
			this.props.create(this.state.title, this.state.description);
		}
	}

	/*- Render -*/
	render() {
		return (
			<React.Fragment>
				<div className="modal modal-target-selector">
					<div className="modal-content modal-target-selector">
						{/*- Title -*/}
						<h2 className="modal-target-selector">Create document</h2>

						{/*- Container -*/}
						<div className="modal-target-selector">
							{/*- Title -*/}
							<input className="modal-target-selector" placeholder="Title..." type="text" name="name" value={this.state.name} onChange={this._change_title} />

							{/*- Description -*/}
							<input className="modal-target-selector" placeholder="Description..." type="text" name="description" value={this.state.description} onChange={this._change_description} />

							{/*- Submit -*/}
							<button className="modal-target-selector" onClick={this._create}>Create</button>
						</div>
					</div>
				</div>
				<div className="modal-blur"></div>
			</React.Fragment>
		)
	}
}

/*- Exports -*/
export { App, Icon };
