import React, { Component } from 'react'
import { Table, Button } from 'reactstrap';
import { token } from '../_helpers/auth-header';
import { handleResponse } from '../_helpers/handle-response'
import { authenticationService } from '../_services/authentication.service';

export class DoctorScheduleByDateDataTable extends Component {
  state = {
    item: {},
    times: []
  }

  generateHeaders(method, startTime, item, userId) {
    const auth = token()
    const requestOptions = {
      method: method,
      headers: { Authorization: `Bearer ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: item.date,
        startTime: startTime,
        interval: item.interval,
        doctorId: item.doctorId,
        userId: userId
      })
    };

    return requestOptions
  }
  async addTicket(startTime, item) {
    const currentUser = authenticationService.currentUserValue;
    const req = this.generateHeaders('post', startTime, item, currentUser.id)
    fetch('api/ticket', req)
      .then(handleResponse)
      .catch(err => console.log(err))
    window.location.replace('/UserTicketsCards')
  }

  render() {
    const items = this.props.times.map((item, i) => {
      return (
        <tr key={i}>
          <th scope="row">{item}</th>
          <td><Button color="success" onClick={() => this.addTicket(item, this.props.item)}>Get ticket</Button></td>
        </tr>
      )
    })

    return (
      <div>
        <Table responsive hover>
          <thead>
            <tr>
              <th>Time</th>
              <th></th>
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

export default DoctorScheduleByDateDataTable