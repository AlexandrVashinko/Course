import React, { Component } from 'react'
import { Table, Button } from 'reactstrap';
import SpecializationModalForm from './SpecializationModalForm'
import { token } from '../_helpers/auth-header';
import { handleResponse } from '../_helpers/handle-response'

const divStyle = {
  display: 'flex'
};
export class SpecializationDataTable extends Component {

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
      fetch('api/specialization/' + id, req)
        .then(handleResponse)
        .then(item => {
          this.props.deleteItemFromState(id)
        })
        .catch(err => console.log(err))
    }

  }

  render() {
    const items = this.props.items.map(item => {
      return (
        <tr key={item.id}>
          <th scope="row">{item.id}</th>
          <td>{item.name}</td>
          <td>
            <div style={divStyle}>
              <SpecializationModalForm buttonLabel="Edit" item={item} updateState={this.props.updateState} />
              {' '}
              <Button color="danger" onClick={() => this.deleteItem(item.id)}>Del</Button>
            </div>
          </td>
        </tr>
      )
    })

    return (
      <Table responsive hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items}
        </tbody>
      </Table>
    )
  }
}

export default SpecializationDataTable