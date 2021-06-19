import React, { Component } from "react";

import ReactDOM from "react-dom";
import API from './Api';

export default class User extends Component {
    constructor(props) {
        super(props)
        this.state = { users: [] }
    }
    componentDidMount() {
        API.get(`http://localhost:8000/api/users`)
            .then(res => {
                const users = res.data.data;
                this.setState({ users });
            })
    }
    renderUsers() {
        const { users } = this.state
        return users.map( user => (
            <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            </tr>
        ))
    }
    render() {
        return (
            <table  className="table table-bordered mt-5">
                <thead>
               <tr>
                   <th>ID</th>
                   <th>Name</th>
                   <th>Email</th>
               </tr>
                </thead>
                <tbody>
                { this.renderUsers() }
                </tbody>
            </table>
        )
    }
}

// DOM element
if (document.getElementById('user')) {
    ReactDOM.render(<User />, document.getElementById('user'));
}
