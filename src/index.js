import { createStore } from 'redux';

require('./styles/main.css');

const initialState = {
    messages: [],
    clients: Array.prototype.slice.call(document.querySelectorAll('iframe'))
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'NEW_MESSAGE':
            let messages = state.messages;
            messages.push(action.message);
            let clients = state.clients;
            clients.map((client) => {
                client.contentWindow.postMessage({
                    type: 'NEW_MESSAGE',
                    message: action.message
                }, '*');
            });
            sessionStorage.setItem('messageHistory', JSON.stringify(messages));
            return {
                ...state,
                messages: messages
            };
        default:
            return state;
    }
};

const store = createStore(reducer);

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