import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { token, authHeader } from '../_helpers/auth-header';
import { handleResponse } from '../_helpers/handle-response';

export class DoctorAddEditForm extends React.Component {
  state = {
    id: 0,
    firstName: '',
    lastName: '',
    middleName: '',
    phoneNumber: '',
    personalNumber: '',
    specializationId: 0,
    specializations: []
  }
  getSpecializationItems = () => {
    const requestOptions = { method: 'GET', headers: authHeader() };
    fetch('api/specialization', requestOptions)
      .then(handleResponse)
      .then(items => this.setState({ specializations: items }))
      .catch(err => console.log(err))
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
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        middleName: this.state.middleName,
        phoneNumber: this.state.phoneNumber,
        personalNumber: this.state.personalNumber,
        specializationId: this.state.specializationId
      })
    };

    return requestOptions
  }

  submitFormAdd = e => {
    e.preventDefault()
    const req = this.generateHeaders('post')
    fetch('api/doctor', req)
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
    fetch('api/doctor/' + this.state.id, req)
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
    this.getSpecializationItems()
    if (this.props.item) {
      const { id, firstName, lastName, middleName, phoneNumber, personalNumber } = this.props.item
      this.setState({ id, firstName, lastName, middleName, phoneNumber, personalNumber })
    }
  }

  createSelectItems() {
    const specializations = this.state.specializations
    const i = specializations.map(s => {
      return <option key={s.id} value={s.id}>{s.name}</option>
    })
    return i
  }

  onDropdownSelected = e => {
    console.log("THE VAL", e.target.value);
    this.setState({ specializationId: e.target.value })
    console.log(this.state.specializationId);
    //here you will see the current selected value of the select input
  }

  render() {
    return (
      <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
        <FormGroup>
          <Label for="firstName">First Name</Label>
          <Input type="text" name="firstName" id="firstName" onChange={this.onChange} value={this.state.firstName === null ? '' : this.state.firstName} />
        </FormGroup>
        <FormGroup>
          <Label for="lastName">Last Name</Label>
          <Input type="text" name="lastName" id="lastName" onChange={this.onChange} value={this.state.lastName === null ? '' : this.state.lastName} />
        </FormGroup>
        <FormGroup>
          <Label for="middleName">Middle Name</Label>
          <Input type="text" name="middleName" id="middleName" onChange={this.onChange} value={this.state.middleName === null ? '' : this.state.middleName} />
        </FormGroup>
        <FormGroup>
          <Label for="phoneNumber">Phone</Label>
          <Input type="text" name="phoneNumber" id="phoneNumber" onChange={this.onChange} value={this.state.phoneNumber === null ? '' : this.state.phoneNumber} placeholder="+375 11 111 11 11" />
        </FormGroup>
        <FormGroup>
          <Label for="personalNumber">Personal Number</Label>
          <Input type="text" name="personalNumber" id="personalNumber" onChange={this.onChange} value={this.state.personalNumber === null ? '' : this.state.personalNumber} placeholder="1111-11 -11" />
        </FormGroup>
        <FormGroup>
          <Input type="select" name='specializationId' onChange={this.onChange} label="Multiple Select">
            {this.createSelectItems()}
          </Input>
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    );
  }
}

export default DoctorAddEditForm