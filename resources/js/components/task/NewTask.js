import React, { Component } from 'react'
import ReactDOM from "react-dom";
import API from './Api';
import { Link } from 'react-router-dom'
export default class NewTask extends Component {
    constructor () {
        super()
        this.state = {
            projects: []
        }
    }

    componentDidMount () {
        axios.get('/api/projects').then(response => {
            this.setState({
                projects: response.data
            })
        })
    }
}
