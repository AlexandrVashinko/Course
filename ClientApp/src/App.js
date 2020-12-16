import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { NotFoundErrorPage } from './components/NotFoundErrorPage';
import { ServerErrorPage } from './components/ServerErrorPage';
import { LoginPage } from './LoginPage/LoginPage';
import { Role } from './_helpers/role';
import './custom.css'
import { SpecializationTable } from './Specialization/SpecializationTable';
import { RegisterPage } from './RegisterPage/RegisterPage';
import { UserTicketsCards } from './UserTicketsCards/UserTicketsCards';
import { DoctorTable } from './Doctor/DoctorTable';
import { UserPage } from './UserPage/UserPage';
import { DoctorScheduleByDateTable } from './DoctorScheduleByDate/DoctorScheduleByDateTable';
import { DoctorTicketsCards } from './DoctorTicketsCards/DoctorTicketsCards';
import { DoctorScheduleTable } from './DoctorSchedule/DoctorScheduleTable';
import { ScheduleTable } from './Schedule/ScheduleTable';
import { PrivateRoute } from './_components/PrivateRoute'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />

        <Route path='/NotFoundError' component={NotFoundErrorPage} />
        <Route path='/ServerErrorPage' component={ServerErrorPage} />
        
        <Route path="/login" component={LoginPage} />
        <Route path="/registration" component={RegisterPage} />
        
        <PrivateRoute path="/DoctorTable"  component={DoctorTable} />
        <PrivateRoute path="/DoctorScheduleTable/:doctorId"  component={DoctorScheduleTable} />
        <PrivateRoute path="/DoctorScheduleByDateTable/:scheduleId"  component={DoctorScheduleByDateTable} />
        <PrivateRoute path="/DoctorTicketsCards/:doctorId" roles={[Role.Admin]} component={DoctorTicketsCards} />

        <PrivateRoute path="/ScheduleTable" roles={[Role.Admin]} component={ScheduleTable} />
        <PrivateRoute path="/SpecializationTable" roles={[Role.Admin]} component={SpecializationTable} />
        <PrivateRoute path="/UserPage"  component={UserPage} />
        <PrivateRoute path="/UserTicketsCards" component={UserTicketsCards} />
      </Layout>
    );
  }
}
