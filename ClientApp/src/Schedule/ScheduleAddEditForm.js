import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { token } from '../_helpers/auth-header';
import { handleResponse } from '../_helpers/handle-response'

export class ScheduleAddEditForm extends React.Component {
  state = {
    id: 0,
    date: '',
    startTime: '',
    endTimedate: '',
    interval: '',
    doctorId: '',
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
        date: this.state.date,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        interval: this.state.interval,
        doctorId: this.state.doctorId,
      })
    };

    return requestOptions
  }

  submitFormAdd = e => {
    e.preventDefault()
    const req = this.generateHeaders('post')
    fetch('api/schedule', req)
      .then(handleResponse)
      .then(item => {
          window.location.replace('/DoctorScheduleTable/'+this.state.doctorId)
      })
      .catch(err => console.log(err))
  }

  submitFormEdit = e => {
    e.preventDefault()
    const req = this.generateHeaders('put')
    fetch('api/schedule', req)
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
      const { id, date, startTime, endTime, interval } = this.props.item
      this.setState({ id, date, startTime, endTime, interval })
    }
    if (this.props.doctorId) {
      this.setState({ doctorId: this.props.doctorId })
    }
  }

  render() {
    return (
      <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
        <FormGroup>
          <Label for="date">Date</Label>
          <Input type="date" name="date" id="date" onChange={this.onChange} value={this.state.date === null ? '' : this.state.date} />
          <Label for="startTime">Start Time</Label>
          <Input type="time" name="startTime" id="startTime" onChange={this.onChange} value={this.state.startTime === null ? '' : this.state.startTime} />
          <Label for="endTime">End Time</Label>
          <Input type="time" name="endTime" id="endTime" onChange={this.onChange} value={this.state.endTime === null ? '' : this.state.endTime} />
          <Label for="interval">Interval</Label>
          <Input type="text" name="interval" id="interval" onChange={this.onChange} value={this.state.interval === null ? '' : this.state.interval} />
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    );
  }
}

export default ScheduleAddEditForm