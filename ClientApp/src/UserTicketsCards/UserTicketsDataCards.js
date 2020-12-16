import React, { Component } from 'react'
import { Button, Card, CardBody, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas'
import { format } from 'date-fns'

const divStyle = {
  display: 'flex',
  width: '80%',
  flexWrap: 'wrap'
};

export class UserTicketsDataCards extends Component {
  state = {
    user: {}
  }

  deleteItem = id => {
    let confirmDelete = window.confirm('Delete item forever?')
    if (confirmDelete) {
      fetch('api/schedule/' + id, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id
        })
      })
        .then(response => response.json())
        .then(item => {
          this.props.deleteItemFromState(id)
        })
        .catch(err => console.log(err))
    }
  }

  printDocument(i) {
    const input = document.getElementById('cardToPrint' + i);
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        // pdf.output('dataurlnewwindow');
        pdf.save("download.pdf");
      })
      ;
  }

  render() {
    const items = this.props.cards.map((item, i) => {
      return (
        <div key={i}>
          <Card id={"cardToPrint" + i} style={{ width: '18rem' }}>
            <CardBody>
              <CardTitle>{format(new Date(item.date), 'yyyy-MM-dd')}</CardTitle>
              <CardSubtitle className="mb-2 text-muted">{item.startTime} - {item.endTime}</CardSubtitle>
              <CardText>
                Hello. You have made an appointment with a doctor, the appointment starts at {item.startTime}.
              Your doctor is {item.doctor.lastName} {item.doctor.firstName} {item.doctor.middleName}.
              We ask you not to be late or to warn in advance.
            </CardText>
            </CardBody>
          </Card>
          <Button color="success" onClick={() => this.printDocument(i)}>Download PDF</Button>
        </div>
      )
    })

    return (
      <div style={divStyle}>
        {items}
      </div>
    )
  }
}

export default UserTicketsDataCards