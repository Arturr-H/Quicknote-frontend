import React from "react";
import { Icon } from "../App";

/*- Toast -*/
export class Toast extends React.PureComponent {
	componentDidMount() {
		setTimeout(() => {
			this.props.onClose();
		}, 5000);
	}
	render() {
		return (
			<div className="toast">
				<div className="content-container">
					<p>{this.props.message}</p>
					<button onClick={this.props.onClose}>
						<Icon name="cross" size={32} />
					</button>
				</div>
				<div className="progress-bar"></div>
			</div>
		);
	}
}
