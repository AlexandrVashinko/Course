import React, { Component } from 'react'
import { Card, CardBody, CardTitle, CardSubtitle, CardLink } from 'reactstrap';
import { token } from '../_helpers/auth-header';
import { handleResponse } from '../_helpers/handle-response'

const divStyle = {
  display: 'flex'
};

export class DoctorTicketsDataCards extends Component {
  state = {
    user: {}
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
      fetch('api/schedule/' + id, req)
        .then(handleResponse)
        .then(item => {
          this.props.deleteItemFromState(id)
        })
        .catch(err => console.log(err))
    }
  }

  render() {
    const items = this.props.cards.map((item, i) => {
      return (
        <Card key={i} style={{ width: '18rem' }}>
          <CardBody>
            <CardTitle>{item.date}</CardTitle>
            <CardSubtitle className="mb-2 text-muted">{item.startTime} - {item.endTime}</CardSubtitle>
            <CardLink href="#">Card Link</CardLink>
          </CardBody>
        </Card>
      )
    })

    return (
      <div style={divStyle}>
        {items}
      </div>
    )
  }
}

export default DoctorTicketsDataCards