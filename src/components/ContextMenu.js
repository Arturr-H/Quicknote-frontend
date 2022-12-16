/*- Imports -*/
import React from "react";
import { Icon } from "./Icon";

/*- Components -*/
export class ContextMenu extends React.PureComponent {
    constructor(props) {
        super(props);

        /*- Statics -*/
        this.actions = this.props.actions;
    }

    /*- Render -*/
    render() {
        return (
            <div className="contextmenu">
                {this.actions.map((action, index) => {

                    /*- Render either Separator or context menu -*/
                    return (action.separator === true) ? (
                        <div className="context-menu-separator" key={index} />
                    ) :
                    
                    /*- If is color -*/
                    (action.color === true) ? (
                        <div
                            className="context-menu-item"
                            key={index}
                        >
                            <div className="color-dot" style={{ background: action.value }} />
                            <button
                                className="context-button"
                                key={index}
                                onClick={action.action}
                            >{action.name}</button>
                        </div>
                    ) :
							
                    /*- If is button -*/
                    (
                        <div
                            className="context-menu-item"
                            key={index}
                        >
                            <Icon light={this.props.darkMode} className="icon" name={action.icon} />
                            <button
                                className={"context-button" + (action.tintColor ? " colored-" + action.tintColor : "")}
                                key={index}
                                onClick={action.action}
                            >{action.name}</button>
                        </div>
                    )
                })}
            </div>
        );
    }
}