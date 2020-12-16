import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import ScheduleModalForm from './ScheduleModalForm'
import ScheduleDataTable from './ScheduleDataTable'
import { CSVLink } from "react-csv"
import { authHeader } from '../_helpers/auth-header';
import { handleResponse } from '../_helpers/handle-response'
import { authenticationService } from '../_services/authentication.service';

export class ScheduleTable extends Component {
  state = {
    items: []
  }

  getItems() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    fetch('api/schedule', requestOptions)
      .then(handleResponse)
      .then(items => this.setState({ items }))
      .catch(err => console.log(err))
  }

  addItemToState = (item) => {
    this.setState(prevState => ({
      items: [...prevState.items, item]
    }))
  }

  updateState = (item) => {
    const itemIndex = this.state.items.findIndex(data => data.id === item.id)
    const newArray = [
      // destructure all items from beginning to the indexed item
      ...this.state.items.slice(0, itemIndex),
      // add the updated item to the array
      item,
      // add the rest of the items to the array from the index after the replaced item
      ...this.state.items.slice(itemIndex + 1)
    ]
    this.setState({ items: newArray })
  }

  deleteItemFromState = (id) => {
    const updatedItems = this.state.items.filter(item => item.id !== id)
    this.setState({ items: updatedItems })
  }

  componentDidMount() {
    this.getItems()
  }

  render() {
    const currentUser = authenticationService.currentUserValue;
    const isAdmin = currentUser.role === 'Admin'
    return (
      <Container className="App">
        <Row>
          <Col>
            <h1 style={{ margin: "20px 0" }}>Schedule</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <ScheduleDataTable items={this.state.items} updateState={this.updateState} deleteItemFromState={this.deleteItemFromState} />
          </Col>
        </Row>
        <Row>
          {isAdmin &&
            <Col>
              <CSVLink
                filename={"db.csv"}
                color="primary"
                style={{ float: "left", marginRight: "10px" }}
                className="btn btn-primary"
                data={this.state.items}>
                Download CSV
            </CSVLink>
              <ScheduleModalForm buttonLabel="Add Item" addItemToState={this.addItemToState} />
            </Col>
          }
        </Row>
      </Container>
    )
  }
}

export default ScheduleTable