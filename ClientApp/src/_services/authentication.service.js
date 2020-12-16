import { BehaviorSubject } from 'rxjs';
import { handleResponse } from '../_helpers/handle-response';
import { token } from '../_helpers/auth-header';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    editUser,
    deleteUser,
    registration,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`api/user/authenticate`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}
function registration(username, password, firstName, lastName, phoneNumber, personalNumber) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, firstName, lastName, phoneNumber, personalNumber })
    };

    return fetch(`api/user/registration`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}
function editUser(id, username, password, firstName, lastName, phoneNumber, personalNumber) {
    const auth = token()
    const requestOptions = {
        method: 'put',
        headers: { Authorization: `Bearer ${auth}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({id, username, password, firstName, lastName, phoneNumber, personalNumber })
    };

    return fetch(`api/user`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);

            return user;
        });
}

function deleteUser() {
    let confirmDelete = window.confirm('Delete item forever?')
    const requestOptions = { 
        method: 'delete',
         headers: { Authorization: `Bearer ${authenticationService.currentUserValue.token}`, 'Content-Type': 'application/json'}, 
         body: JSON.stringify({
            username: authenticationService.currentUserValue.username
        })
      };
    if(confirmDelete){
      fetch('api/user/'+ authenticationService.currentUserValue.id, requestOptions)
      .then(handleResponse)
      .then(item => {
        localStorage.removeItem('currentUser');
        currentUserSubject.next(null);
      })
      .catch(err => console.log(err))
    }


}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
