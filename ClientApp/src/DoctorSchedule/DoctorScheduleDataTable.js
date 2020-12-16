import React, { Component } from 'react'
import { Table, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { handleResponse } from '../_helpers/handle-response';
import { token } from '../_helpers/auth-header';
import { authenticationService } from '../_services/authentication.service';

const divStyle = {
  display: 'flex'
};
export class DoctorScheduleDataTable extends Component {

  generateHeaders(method, id) {
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
    const req = this.generateHeaders('delete', id)
    let confirmDelete = window.confirm('Delete item forever?')
    if (confirmDelete) {
      fetch('api/schedule/' + id, req)
        .then(handleResponse)
        .then(item => {
          this.props.deleteItemFromState(id)
        })
        .catch(err => console.log(err))
    }

  }

  render() {
    const currentUser = authenticationService.currentUserValue;
    const isAdmin = currentUser.role === 'Admin'
    const items = this.props.items.map(item => {
      return (
        <tr key={item.id}>
          <th scope="row">{item.id}</th>
          <td><Link to={"/DoctorScheduleByDateTable/" + item.id} >{item.date}</Link></td>
          <td>{item.startTime}</td>
          <td>{item.endTime}</td>
          <td>{item.interval}</td>
          <td>
            {isAdmin &&
              <div style={divStyle}>
                {' '}
                <Button color="danger" onClick={() => this.deleteItem(item.id)}>Del</Button>
              </div>
            }
          </td>
        </tr>
      )
    })

    return (
      <Table responsive hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Interval</th>
          </tr>
        </thead>
        <tbody>
          {items}
        </tbody>
      </Table>
    )
  }
}

export default DoctorScheduleDataTable