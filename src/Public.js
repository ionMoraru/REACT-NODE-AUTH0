import React, { Component } from "react";

export default class Public extends Component {
  state = {
    message: ""
  };

  componentDidMount = () => {
    fetch("/public")
      .then(response => {
        if (response.ok) return response.json();
        throw new Error("Network response was not ok");
      })
      .then(response => this.setState({ message: response.message }))
      .catch(err => this.setState({ message: err.message }));
  };

  render() {
    return <p>{this.state.message}</p>;
  }
}
