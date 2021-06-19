import React, { Component } from 'react';
import ReactDOM from "react-dom";

class About extends Component{
    render() {
        return (
            <h1>This is About</h1>
        );
    }
}

export default About;

if (document.getElementById('about')) {
    ReactDOM.render(<About />, document.getElementById('about'));
}
