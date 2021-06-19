import React, { Component } from 'react';
import ReactDOM from "react-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
    BrowserRouter as Router,
    Route,
    Link
}from 'react-router-dom';
import Home from './Home';
import About from './About';
import Example from './Example';
import Login from './Login';
import User from './User';
import ProjectsList from './Project/ProjectsList';
import NewProject from './Project/NewProject';
import SingleProject from './Project/SingleProject';

class Header extends Component{
    constructor(props) {
        super(props);
        this.state = {isLoggedIn: false};
    }
    render() {
        const isLoggedIn = this.state.isLoggedIn;
        return (
            <Router>
                <header className="App-header">
                    <Navbar bg="success" variant="success" className="navbar navbar-default">
                        <Container>
                            <Navbar.Brand className="navbar-header">
                                <Link to="/" className="nav-link">
                                    Connects
                                </Link>
                            </Navbar.Brand>
                            <Nav>
                                <Nav>
                                    { (localStorage.getItem("isLoggedIn")) ? (<Link to="/home">Home</Link>) : (<Link to="/">Login</Link>) }
                                    <Link to="/about" >About US</Link>
                                    <Link to="/example" >Example</Link>
                                    <Link to="/user" >User</Link>
                                    <Link to="/project_list" >Projects List</Link>
                                </Nav>
                            </Nav>

                        </Container>
                    </Navbar>
                </header>
                <Container>
                    <Row>
                        <Col md={12}>
                            <div className="wrapper">
                                    <Route  path="/home" component={Home}/>
                                    <Route  path="/about" component={About}/>
                                    <Route  path="/example" component={Example}/>
                                    <Route  path="/user" component={User}/>
                                    <Route  path="/project_list" component={ProjectsList}/>
                                    <Route exact path="/" component={Login}/>
                                   <Route path='/project/create' component={NewProject} />
                                  <Route path='/project/:id' component={SingleProject} />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Router>
        );
    }
}

export default Header;

// DOM element
if (document.getElementById('header')) {
    ReactDOM.render(<Header />, document.getElementById('header'));
}
