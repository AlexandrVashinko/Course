import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import DoctorScheduleDataTable from './DoctorScheduleDataTable'
import { CSVLink } from "react-csv"
import { handleResponse } from '../_helpers/handle-response'
import { authHeader } from '../_helpers/auth-header';
import { authenticationService } from '../_services/authentication.service';

export class DoctorScheduleTable extends Component {
  state = {
    items: []
  }

  getItems() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    fetch('api/schedule/getSchedulesByDoctorId/' + this.props.match.params.doctorId, requestOptions)
      .then(handleResponse)
      .then(items => this.setState({ items }))
      .catch(err => console.log(err))
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
            <h1 style={{ margin: "20px 0" }}>Schedules</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <DoctorScheduleDataTable items={this.state.items} updateState={this.updateState} deleteItemFromState={this.deleteItemFromState} />
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
            </Col>
          }
        </Row>
      </Container>
    )
  }
}

export default DoctorScheduleTable