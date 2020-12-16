import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { handleResponse } from '../_helpers/handle-response';
import { token } from '../_helpers/auth-header';

export class DoctorScheduleEditForm extends React.Component {
  state = {
    id: 0,
    date: '',
    startTime: '',
    endTime: '', 
    interval: '', 
    doctorId: 0
  }

  onChange = e => {
    this.setState({[e.target.name]: e.target.value})
  }
  generateHeaders (method) {
    const auth = token()
    const requestOptions = { 
      method: method,
       headers: { Authorization: `Bearer ${auth}`, 'Content-Type': 'application/json'}, 
      body: JSON.stringify({
        id: this.state.id,
        date: this.state.date,
        startTime: this.state.startTime,
        endTime: this.state.endTime, 
        interval: this.state.interval, 
        doctorId: this.state.doctorId
      }) 
    };

    return requestOptions
  }
  submitFormEdit = e => {
    e.preventDefault()
    const req = this.generateHeaders('put')
    fetch('api/schedule/' + this.state.id, req)
      .then(handleResponse)
      .then(item => {
        if(Array.isArray(item)) {
          // console.log(item[0])
          this.props.updateState(item[0])
          this.props.toggle()
        } else {
          console.log('failure')
        }
      })
      .catch(err => console.log(err))
  }

  componentDidMount(){
    // if item exists, populate the state with proper data
    if(this.props.item){
      const { id, date, startTime, endTime, interval, doctorId} = this.props.item
        this.setState({ id, date, startTime, endTime, interval, doctorId })
    }
  }

  render() {
    return (
      <Form onSubmit={this.submitFormEdit}>
        <FormGroup>
          <Label for="date">Date</Label>
          <Input type="text" name="date" id="date" onChange={this.onChange} value={this.state.date === null ? '' : this.state.date} />
        </FormGroup>
        <FormGroup>
          <Label for="startTime">Start Time</Label>
          <Input type="text" name="startTime" id="startTime" onChange={this.onChange} value={this.state.startTime === null ? '' : this.state.startTime}  />
        </FormGroup>
        <FormGroup>
          <Label for="endTime">End Time</Label>
          <Input type="text" name="endTime" id="endTime" onChange={this.onChange} value={this.state.endTime === null ? '' : this.state.endTime}  />
        </FormGroup>
        <FormGroup>
          <Label for="interval">Interval</Label>
          <Input type="text" name="interval" id="interval" onChange={this.onChange} value={this.state.interval === null ? '' : this.state.interval} />
        </FormGroup>
        <Button>Submit</Button>
      </Form>
    );
  }
}

export default DoctorScheduleEditForm