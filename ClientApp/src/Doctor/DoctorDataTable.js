import React, { Component } from 'react'
import { Table, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import DoctorModalForm from './DoctorModalForm'
import ScheduleModalForm from '../Schedule/ScheduleModalForm'
import { Link } from 'react-router-dom';
import { handleResponse } from '../_helpers/handle-response';
import { token } from '../_helpers/auth-header';
import { authenticationService } from '../_services/authentication.service';

const divStyle = {
  display: 'flex'
};

export class DoctorDataTable extends Component {
  state = {
    firstName: '',
    lastName: '',
    middleName: '',
    specializationId: 0,
    doctors: []
  }

  createSelectItems() {
    const specializations = this.props.specializations
    const i = specializations.map(s => {
      return <option key={s.id} value={s.id}>{s.name}</option>
    })
    return i
  }

  generateDeleteHeaders(method, id) {
    const auth = token()
    const requestOptions = {
      method: method,
      headers: { Authorization: `Bearer ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id
      })
    };

    return requestOptions
  }

  deleteItem = id => {
    let confirmDelete = window.confirm('Delete item forever?')
    const req = this.generateDeleteHeaders('delete', id)
    if (confirmDelete) {
      fetch('api/doctor/' + id, req)
        .then(handleResponse)
        .then(item => {
          this.props.deleteItemFromState(id)
        })
        .catch(err => console.log(err))
    }

  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  generateHeaders(method) {
    const requestOptions = {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        middleName: this.state.middleName,
        specializationId: this.state.specializationId
      })
    };

    return requestOptions
  }

  searchDoctors = e => {
    e.preventDefault()
    const req = this.generateHeaders('post')
    fetch('api/doctor/search', req)
      .then(handleResponse)
      .then(item => {
        this.setState({doctors: item})
        this.forceUpdate()
      })
      .catch(err => console.log(err))
  }

  render() {
    const currentUser = authenticationService.currentUserValue;
    const isAdmin = currentUser.role === 'Admin'
    const doctors = this.state.doctors.length > 0 ? this.state.doctors : this.props.items
    const items = doctors.map(item => {
      return (
        <tr key={item.id}>
          <th scope="row"><Link to={"/DoctorScheduleTable/" + item.id} >{item.firstName} {item.lastName} {item.middleName}</Link></th>
          <td>{item.specialization.name}</td>
          <td>{item.phoneNumber}</td>
          <td>{item.personalNumber}</td>
          <td>
            {isAdmin &&
              <div style={divStyle}>
                <DoctorModalForm buttonLabel="Edit" item={item} updateState={this.props.updateState} />
                <ScheduleModalForm buttonLabel="Create Schedule" doctorId={item.id} />
                {' '}
                <Button color="danger" onClick={() => this.deleteItem(item.id)}>Del</Button>
              </div>
            }
          </td>
        </tr>
      )
    })

    return (
      <div>
        <Form onSubmit={this.searchDoctors} inline>
          <FormGroup>
            <Label for="lastName" hidden>Last Name</Label>
            <Input type="text" name="lastName" id="lastName" onChange={this.onChange} value={this.state.lastName === null ? '' : this.state.lastName}  placeholder='Last Name'/>
          </FormGroup>
          {' '}
          <FormGroup>
            <Label for="firstName" hidden>First Name</Label>
            <Input type="text" name="firstName" id="firstName" onChange={this.onChange} value={this.state.firstName === null ? '' : this.state.firstName}  placeholder='First Name'/>
          </FormGroup>
          {' '}
          <FormGroup>
            <Label for="middleName" hidden>Middle Name</Label>
            <Input type="text" name="middleName" id="middleName" onChange={this.onChange} value={this.state.middleName === null ? '' : this.state.middleName} placeholder='Middle Name' />
          </FormGroup>
          {' '}
          <FormGroup>
          <Input type="select" name='specializationId' onChange={this.onChange}>
            {this.createSelectItems()}
          </Input>
          </FormGroup>
          {' '}
          <Button type='submit'>Search</Button>
        </Form>
        <Table responsive hover>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Specialization</th>
              <th>Phone Number</th>
              <th>Personal Number</th>
            </tr>
          </thead>
          <tbody>
            {items}
          </tbody>
        </Table>
      </div>
    )
  }
}

export default DoctorDataTable