import React, { Component } from 'react'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import DoctorScheduleEditForm from './DoctorScheduleEditForm'

export class DoctorScheduleModalForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false
    }
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }))
  }

  render() {
    const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>

    const label = this.props.buttonLabel

    let button = ''
    let title = ''

    if (label === 'Edit') {
      button = <Button
        color="warning"
        onClick={this.toggle}
        style={{ float: "left", marginRight: "10px" }}>{label}
      </Button>
      title = 'Edit Item'
    }

    return (
      <div>
        {button}
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle} close={closeBtn}>{title}</ModalHeader>
          <ModalBody>
            <DoctorScheduleEditForm
              updateState={this.props.updateState}
              toggle={this.toggle}
              item={this.props.item} />
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default DoctorScheduleModalForm