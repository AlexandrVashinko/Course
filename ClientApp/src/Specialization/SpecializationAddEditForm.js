import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { token } from '../_helpers/auth-header';
import { handleResponse } from '../_helpers/handle-response'

export class SpecializationAddEditForm extends React.Component {
  state = {
    id: 0,
    name: ''
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  generateHeaders(method) {
    const auth = token()
    const requestOptions = {
      method: method,
      headers: { Authorization: `Bearer ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: this.state.id,
        name: this.state.name,
      })
    };

    return requestOptions
  }

  submitFormAdd = e => {
    const req = this.generateHeaders('post')
    e.preventDefault()
    fetch('api/specialization', req)
      .then(handleResponse)
      .then(item => {
        if (Array.isArray(item)) {
          this.props.addItemToState(item[item.length - 1])
          this.props.toggle()
        } else {
          console.log('failure')
        }
      })
      .catch(err => console.log(err))
  }

  submitFormEdit = e => {
    e.preventDefault()
    const req = this.generateHeaders('put')
    fetch('api/specialization/' + this.state.id, req)
      .then(handleResponse)
      .then(item => {
        if (Array.isArray(item)) {
          // console.log(item[0])
          this.props.updateState(item[0])
          this.props.toggle()
        } else {
          console.log('failure')
        }
      })
      .catch(err => console.log(err))
  }

  componentDidMount() {
    // if item exists, populate the state with proper data
    if (this.props.item) {
      const { id, name } = this.props.item
      this.setState({ id, name })
    }
  }

  render() {
    return (
      <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input type="text" name="name" id="name" onChange={this.onChange} value={this.state.name === null ? '' : this.state.name} />
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    );
  }
}

export default SpecializationAddEditForm