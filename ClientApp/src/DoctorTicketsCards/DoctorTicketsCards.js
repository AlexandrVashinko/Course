import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import DoctorTicketsDataCards from './DoctorTicketsDataCards'
import { authHeader } from '../_helpers/auth-header';
import { handleResponse } from '../_helpers/handle-response'

export class DoctorTicketsCards extends Component {
  state = {
    cards: []
  }

  async getCards() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    fetch('/api/ticket/doctorTickets/' + this.props.match.params.doctorId, requestOptions)
      .then(handleResponse)
      .then(cards => {
        this.setState({ cards })
      })
      .catch(err => console.log(err))
  }

  componentDidMount() {
    this.getCards()
  }

  render() {
    return (
      <Container className="App">
        <Row>
          <Col>
            <h1 style={{ margin: "20px 0" }}>Tickets</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <DoctorTicketsDataCards cards={this.state.cards} />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default DoctorTicketsCards