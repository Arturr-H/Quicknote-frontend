/*- Imports -*/
import "./App.css";
import React from "react";
import { Icon } from "./components/Icon";

/*- Constants -*/
const BACKEND_URL = "http://localhost:8080/";
const ACCOUNT_URL = "http://localhost:8081/";

/*- Main -*/
class App extends React.PureComponent {
	constructor(props) {
		super(props);

		/*- Changeable -*/
		this.state = {
			docs: [],
			modal: false,
			modalType: null,
			darkMode: this.getCookie("darkMode") === "true" ? true : false,
		};

		/*- Static -*/
	}

	/*- Default methods -*/
	componentDidMount() {
		/*- Fetch data -*/
		fetch(BACKEND_URL + "get-documents", {
			method: "GET",
			headers: {
				"token": this.getCookie("token")
			}
		}).then(async res => {
			// console.log(await res.json());
			this.setState({ docs: await res.json() });
		});

		this.changeDarkMode(this.state.darkMode);
	}

	/*- Methods -*/
	createDocument = (title, description) => {
		fetch(BACKEND_URL + "add-doc", {
			method: "GET",
			headers: {
				"token": this.getCookie("token"),
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
	showModal = (type) => {
		this.setState({ modal: true, modalType: type });
	}

	/*- Dark mode toggle -*/
	changeDarkMode = (to) => {
		/*- Css variables -*/
		if (to) {
			document.documentElement.style.setProperty("--main", "#111");
			document.documentElement.style.setProperty("--main-1", "#222");
			document.documentElement.style.setProperty("--main-2", "#333");
			document.documentElement.style.setProperty("--main-3", "#444");
			document.documentElement.style.setProperty("--main-4", "#555");
			document.documentElement.style.setProperty("--main-5", "#666");
			document.documentElement.style.setProperty("--text", "#fff");
			document.documentElement.style.setProperty("--toolbar-btn", "rgb(107, 216, 213)");
		}else {
			document.documentElement.style.setProperty("--main", "#fff");
			document.documentElement.style.setProperty("--main-1", "#eee");
			document.documentElement.style.setProperty("--main-2", "#ddd");
			document.documentElement.style.setProperty("--main-3", "#aaa");
			document.documentElement.style.setProperty("--main-4", "#888");
			document.documentElement.style.setProperty("--main-5", "#333");
			document.documentElement.style.setProperty("--text", "#000");
			document.documentElement.style.setProperty("--toolbar-btn", "#fff");
		};
	};
	/*- Get cookie -*/
	getCookie = (name) => {
		let nameEQ = name + "=";
		let ca = document.cookie.split(';');
		for(let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	};
	/*- Set cookie -*/
	setCookie = (name, value, days) => {
		let expires = "";
		if (days) {
			let date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/;SameSite=None; Secure";
	};

	login = (token, suid) => {
		this.setCookie("token", token, 60);
		this.setCookie("suid", suid, 60);
	}


	render() {
		return (
			<main onClick={this.onClick}>
				<nav>
					<div>
						<img alt="logo" src={require("./icons/logo.svg").default} width={100} />
					</div>
					<div>
						<button onClick={() => this.showModal("register")} className="text-link">Sign Up</button>
						<button onClick={() => this.showModal("login")} className="text-link">Log In</button>
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
								owner={data.owner}
								href={data.id}
							/>
						)
					}

					{/*- Add new note -*/}
					<div className="card" onClick={() => {
						if (this.getCookie("token") === null) {
							this.showModal("login");
						}else {
							this.showModal("create");
						};
					}}>
						<div className="add-icon-container">
							<Icon name="edit" size={90} />
							<p>Create document</p>
						</div>
					</div>
				</div>
				{this.state.modal === true ? <Modal
					create={this.createDocument}
					modalType={this.state.modalType}
					close={() => this.setState({ modal: false })}
					login={this.login}
				/> : null}
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
		this.date        = this.props.date || null;
		this.owner      = this.props.owner || "Unknown author";
		this.href        = this.props.href || "unknown";

		/*- Bindings -*/
		this._date = this._date.bind(this);
	}

	/*- Convert unix time to yyyy-mm-dd -*/
	_date(unix) {
		if (unix == null) return "Unknown date";
		let date = new Date(unix);

		let year  = date.getFullYear();
		let month = ("0" + date.getMonth() + 1).slice(-2);
		let day   = ("0" + date.getDate()).slice(-2);

		return `${year}-${month}-${day}`;
	}

	/*- Get user -*/
	componentDidMount() {
		fetch(ACCOUNT_URL + "profile/data/by_suid/" + this.owner).then(res => res.json()).then(data => {
			this.setState({ userData: data })
		});
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
							<p>{this.state.userData && this.state.userData.displayname}</p>
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

/*- Modal -*/
class Modal extends React.PureComponent {
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

		/*- Refs -*/
		this.emailInput = React.createRef();
		this.passwordInput = React.createRef();
		this.confirmPasswordInput = React.createRef();
		this.usernameInput = React.createRef();
		this.displaynameInput = React.createRef();
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

	/*- Account -*/
	register = () => {
		if (this.passwordInput.current.value === this.confirmPasswordInput.current.value) {
			fetch(ACCOUNT_URL + "create-account", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"password": this.passwordInput.current.value,
					"username": this.usernameInput.current.value,
					"displayname": this.displaynameInput.current.value,
					"email": this.emailInput.current.value,
				}
			}).then(res => res.json()).then(res => {
				if (res.status !== 200) {
					alert(res.message);
				}else {
					alert("Account created! Please login.");

					this.props.close();
				}
			});
		}else {
			alert("Passwords do not match!");
		}
	}
	login = () => {
		fetch(ACCOUNT_URL + "login", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"password": this.passwordInput.current.value,
				"email": this.emailInput.current.value,
			}
		}).then(res => res.json()).then(res => {
			if (res.status !== 200) {
				alert(res.message);
			}else {
				alert("Logged in!");
				this.props.login(res.token, res.suid);
				this.props.close();
			}
		})
	}

	/*- Render -*/
	render() {
		return (
			<React.Fragment>
				{this.props.modalType === "create" ?
					<div className="account-modal modal-target-selector">
						{/*- Title -*/}
						<h1 className="modal-target-selector">Create document</h1>

						{/*- Container -*/}
						<div className="input-container modal-target-selector">
							{/*- Title -*/}
							<input className="modal-target-selector" placeholder="Title..." type="sun" name="name" value={this.state.name} onChange={this._change_title} />

							{/*- Description -*/}
							<input className="modal-target-selector" placeholder="Description..." type="text" name="description" value={this.state.description} onChange={this._change_description} />

							{/*- Submit -*/}
							<button className="modal-target-selector" onClick={this._create}>Create</button>
						</div>
					</div>
				: this.props.modalType === "login" ?
					<div className="account-modal modal-target-selector">
						<h1>Quicknote - Login</h1>
						<div className="input-container modal-target-selector">
							<input className="modal-target-selector" type="email" placeholder="Email..." ref={this.emailInput} />
							<input className="modal-target-selector" type="password" placeholder="Password..." ref={this.passwordInput} />
							<button onClick={this.login} className="modal-target-selector">Login</button>
						</div>
					</div>
				: this.props.modalType === "register" ?
					<div className="account-modal modal-target-selector">
						<h1>Quicknote - Register</h1>
						<div className="input-container modal-target-selector">
							<input className="modal-target-selector" type="email" placeholder="Email..." ref={this.emailInput} />
							<input className="modal-target-selector" type="text" placeholder="Username..." ref={this.usernameInput} />
							<input className="modal-target-selector" type="text" placeholder="Displayname..." ref={this.displaynameInput} />
							<input className="modal-target-selector" type="password" placeholder="Password..." ref={this.passwordInput} />
							<input className="modal-target-selector" type="password" placeholder="Repeat password..." ref={this.confirmPasswordInput} />
							<button onClick={this.register} className="modal-target-selector">Register</button>
						</div>
					</div>
				: null
				}
				<div className="modal-blur"></div>
			</React.Fragment>
		)
	}
}

/*- Exports -*/
export { App, Icon };
