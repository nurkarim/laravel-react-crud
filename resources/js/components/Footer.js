import React, { Component } from 'react';
import ReactDOM from "react-dom";
class Footer extends Component{
    render() {
        return (
            <p>This is footer</p>
        );
    }
}


export default Footer;

// DOM element
if (document.getElementById('footer')) {
    ReactDOM.render(<Footer />, document.getElementById('footer'));
}
