import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import DoctorScheduleByDateDataTable from './DoctorScheduleByDateDataTable'
import { authHeader } from '../_helpers/auth-header';
import { handleResponse } from '../_helpers/handle-response'

export class DoctorScheduleByDateTable extends Component {
  state = {
    schedule: {},
    times: []
  }

  getItem() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    fetch('/api/schedule/' + this.props.match.params.scheduleId, requestOptions)
      .then(handleResponse)
      .then(schedule => {
        this.setState({ schedule: schedule, times: schedule.times })
      })
      .catch(err => console.log(err))
  }

  componentDidMount() {
    this.getItem()
  }

  render() {
    return (
      <Container className="App">
        <Row>
          <Col>
            <h1 style={{ margin: "20px 0" }}>Schedules</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <DoctorScheduleByDateDataTable item={this.state.schedule} times={this.state.times} />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default DoctorScheduleByDateTable