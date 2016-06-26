import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import replaceEmoticons from './emotes';

import styles from './styles/base.css';

const initialState = {
    messages: [],
    userName: null
}

function getCurrentTime() {
    let date = new Date;
    let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return '[' + hours + ':' + minutes + ':' + seconds + ']';
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CREATE_USER':
            return {
                ...state,
                userName: action.userName
            };
        case 'NEW_MESSAGE':
            if (state.userName === null) return state;
            let messages = state.messages;
            messages.push(action.message);
            return {
                ...state,
                messages: messages
            };
        default:
            return state;
    }
};

const store = createStore(reducer);

class IMChat extends Component {
    constructor(props) {
        super(props);
    }
    handleLoginChange(e) {
        this.setState({
            login: e.target.value
        });
    }
    setLogin(e) {
        e.preventDefault();
        if (!this.refs.login.value || !/^[\w]+$/i.test(this.refs.login.value)) {
            alert('Incorrect login');
            this.refs.login.value = '';
            return false;
        }
        store.dispatch({
            type: 'CREATE_USER',
            userName: this.refs.login.value
        });
        this.refs.login.value = '';
    }
    sendMessage(e) {
        e.preventDefault();
        let messageValue = this.refs.message.value;
        let date = new Date();
        let time = getCurrentTime();
        let message = {
            name: this.props.userName,
            date: time,
            text: messageValue,
        };
        let rootWindow = window.parent;
        rootWindow.postMessage({
            type: 'NEW_MESSAGE',
            message: message
        }, '*');
        this.refs.message.value = '';
    }
    render() {
        return (
            <div id={styles.page}>
                <div className={this.props.userName ? styles.hide : styles.loginForm}>
                    <form onSubmit={(e) => this.setLogin(e)}>
                        <input ref="login" type="text" placeholder="Your nickname" />
                        <button>Login</button>
                    </form>
                </div>
                <div className={this.props.userName ? styles.chatWrapper : styles.hide}>
                    <ul className={styles.chat}>
                        {this.props.messages.map((message, i) => {
                            let userNameReg = new RegExp(this.props.userName, 'g');
                            let text = message.text;
                            if (this.props.userName !== message.name) {
                                text = message.text.replace(userNameReg, `<b>${this.props.userName}</b>`, 'ig');
                            }
                            text = replaceEmoticons(text);
                            return <li className={styles.message} key={i}>
                                <span className={styles.messageDate}>{message.date.toString()}</span>
                                <span className={message.name === this.props.userName ? styles.messageOwner : styles.messageUsername}>{message.name}:</span>
                                <span className={styles.messageText} dangerouslySetInnerHTML={{__html: text}}></span>
                            </li>
                        })}
                    </ul>
                    <div className={styles.chatInput}>
                        <form onSubmit={(e) => this.sendMessage(e)}>
                            <input ref="message" type="text" placeholder="Enter the message" />
                            <button>Send</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const render = () => {
    ReactDOM.render(
        <IMChat 
            {...store.getState()}
        />,
        document.getElementById('main')
    );
}

store.subscribe(render);
render();

window.addEventListener('message', function(event) {
    switch (event.data.type) {
        case 'NEW_MESSAGE':
            store.dispatch({
                ...event.data
            });
            break;
        default:
            break;
    }
});