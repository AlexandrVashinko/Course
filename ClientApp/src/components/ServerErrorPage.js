import React, { Component } from 'react';
import './ErrorPage.css';

export class ServerErrorPage extends Component {
    static displayName = ServerErrorPage.name;

    render() {
        return (
            <div id="notfound">
            <div class="notfound">
                <div class="notfound-404">
                    <h1>Oops!</h1>
                    <h2>500 - The server seems to be down, check back later</h2>
                </div>
                <a href="/">Go TO Homepage</a>
            </div>
        </div>
        );
    }
}
