import React from "react";
import { Icon } from "../App";

/*- Toast -*/
export class Toast extends React.PureComponent {
	render() {
		return (
			<div className="toast">
				<div className="content-container">
					<p>{this.props.message}awdawdawawga</p>
					<button onClick={this.props.onClose}>
						<Icon name="arrow-down" size={32} />
					</button>
				</div>
				<div className="progress-bar"></div>
			</div>
		);
	}
}
