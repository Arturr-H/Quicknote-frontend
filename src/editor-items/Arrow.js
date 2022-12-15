/*- Imports -*/
import React from 'react';

/*- Main -*/
export class Arrow extends React.Component {
	constructor(props) {
		super(props);

		/*- Create a state variable to track the points that have been clicked on -*/
		this.state = {
			points: {},
			editingIndex: 0,
			preview: {
				x1: 0,
				y1: 0,
				x2: 0,
				y2: 0
			},
			renderLines: true,
		};

		/*- Bind the `this`keyword to the handleClick function -*/
		this.handleClick = this.handleClick.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	/*- This function will be called when the user clicks on the page -*/
	handleClick(event) {
		console.log("a");
		if (!this.state.renderLines) return;
		console.log("2");

		/*- Get the coordinates of the click event -*/
		const x = event.clientX;
		const y = event.clientY;
		const key = "line" + this.state.editingIndex;

		/*- Add a new point to the points array -*/
		this.setState({
			points: {

				/*- Copy the current points -*/
				...this.state.points,

				/*- Add a new point -*/
				[key]: [
					{ x: x, y: y },
					...this.state.points[key] || []
				]
			}
		}, () => {
			console.log(this.state.points);
		});
	}

	/*- Render the arrows on the page -*/
	renderArrows() {
		let final = [];
		Object.keys(this.state.points).forEach((key, i) => {
			let lines = [];
			const points = this.state.points[key];

			lines.push(points.map((point, i) => {
				if (i === 0) return null;
				return <line
					x1={points[i - 1].x}
					y1={points[i - 1].y}
					x2={point.x}
					y2={point.y}
					stroke="black"
					strokeWidth="2"
					key={key + i}
				/>
			}));

			/*- Add the lines to the final array -*/
			final = [...final, ...lines];
		});

		/*- Return the lines -*/
		return final;
	}
	renderPreview = (event) => {
		if (!this.state.renderLines) return;
		
		/*- Get the last point -*/
		const lastPoint = this.state.points["line" + this.state.editingIndex][0];

		/*- If there is no last point, return null -*/
		if (!lastPoint) return null;

		/*- Get the coordinates of the mouse -*/
		const x = event.clientX;
		const y = event.clientY;

		/*- Update the preview state variable -*/
		this.setState({
			preview: {
				x1: lastPoint.x,
				y1: lastPoint.y,
				x2: x,
				y2: y
			}
		});
	}

	componentDidMount() {
		/*- Add an event listener for the keydown event -*/
		document.addEventListener('keydown', this.handleKeyDown);
	}

	componentWillUnmount() {
		/*- Remove the event listener when the component is unmounted -*/
		document.removeEventListener('keydown', this.handleKeyDown);
	}

	handleKeyDown(event) {
		/*- If the user presses the space key -*/
		if (event.key === ' ') {
			/*- Toggle the renderLines state variable -*/
			this.setState({
				renderLines: !this.state.renderLines,
				editingIndex: this.state.editingIndex + 1
			});
		}
	}

	render() {
		return (
			<div style={{ width: 500, height: 500, background: "white" }} onClick={this.handleClick}>
				<svg width={500} height={500} onMouseMove={this.renderPreview}>
					{this.renderArrows()}
					{this.state.renderLines ? <line
						x1={this.state.preview.x1}
						y1={this.state.preview.y1}
						x2={this.state.preview.x2}
						y2={this.state.preview.y2}
						stroke="black"
						strokeWidth="2"
					/>:null}
				</svg>
			</div>
		);
	}
}
