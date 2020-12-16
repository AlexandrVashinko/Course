import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import UserTicketsDataCards from './UserTicketsDataCards'
import { authenticationService } from '../_services/authentication.service';
import { handleResponse } from '../_helpers/handle-response';
import { authHeader } from '../_helpers/auth-header';
export class UserTicketsCards extends Component {
  state = {
    cards: []
  }

  async getCards() {
    const currentUser = authenticationService.currentUserValue;
    const requestOptions = { method: 'GET', headers: authHeader() };
    fetch('/api/ticket/userTickets/' + currentUser.id, requestOptions)
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
            <UserTicketsDataCards cards={this.state.cards} />
          </Col>
        </Row>
      </Container>
    )
  }
}

export default UserTicketsCards