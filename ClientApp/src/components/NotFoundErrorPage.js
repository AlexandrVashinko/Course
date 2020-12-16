import React, { Component } from 'react';
import './ErrorPage.css';

export class NotFoundErrorPage extends Component {
    static displayName = NotFoundErrorPage.name;

    render() {
        return (
            <div id="notfound">
            <div class="notfound">
                <div class="notfound-404">
                    <h1>Oops!</h1>
                    <h2>404 - The Page can't be found</h2>
                </div>
                <a href="/">Go TO Homepage</a>
            </div>
        </div>
        );
    }
}
