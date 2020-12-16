import React, { Component } from 'react';
import {
  Collapse, Container, Navbar, NavbarBrand, NavbarToggler,
  NavItem, NavLink, DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem
} from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { authenticationService } from '../_services/authentication.service';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  logout() {
    authenticationService.logout();
    window.location.reload()
  }

  render() {
    const currentUser = authenticationService.currentUserValue;
    const isAdmin = currentUser ? currentUser.role === 'Admin' : false
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-5" light>
          <Container>
            <NavbarBrand tag={Link} to="/">Course project</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                {!currentUser &&
                  <div>
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        Login Menu
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem>
                          <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/registration">Registration</NavLink>
                          </NavItem>
                        </DropdownItem>
                        <DropdownItem>
                          <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/login">Login</NavLink>
                          </NavItem>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                }
                {isAdmin &&
                  <div>
                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        Admin Menu
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem>
                          <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/SpecializationTable">Specialization Table</NavLink>
                          </NavItem>
                        </DropdownItem>
                        <DropdownItem>
                          <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/DoctorTable">Doctor Table</NavLink>
                          </NavItem>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                }
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                </NavItem>
                {currentUser &&
                  <div>

                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        User Menu
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem>
                          <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/UserTicketsCards">Tickets</NavLink>
                          </NavItem>
                        </DropdownItem>
                        <DropdownItem>
                          <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/DoctorTable">Doctors</NavLink>
                          </NavItem>
                        </DropdownItem>
                        <DropdownItem>
                          <NavItem>
                            <NavLink tag={Link} className="text-dark" to="/UserPage">User Page</NavLink>
                          </NavItem>
                        </DropdownItem>
                        <DropdownItem>
                          <NavItem>
                            <a onClick={this.logout} className="nav-item nav-link">Logout</a>
                          </NavItem>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                }
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
