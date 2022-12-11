/*- Imports -*/
import "../App.css";
import React from "react";

/*- Main -*/
class Login extends React.PureComponent {
	render() {
		return (
			<main>
				<div className="account-modal">
					<h1>Quicknote - Login</h1>
					<div className="input-container">
						<input type="email" placeholder="Email..." />
						<input type="password" placeholder="Password..." />
						<button>Login</button>
					</div>
				</div>
			</main>
		)
	}
}

/*- Exports -*/
export default Login;
