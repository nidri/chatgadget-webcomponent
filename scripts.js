(function() {
  'use strict';

  // TODO: Create the ChatWidget class here 
  class ChatWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      const title = this.title;

      const template = document.createElement('template');
      template.innerHTML = `
    <style>
    :host(chat-widget) *,
    :host(chat-widget) *::after,
    :host(chat-widget) *::before {
      box-sizing: border-box;
    }

    :host(chat-widget) {
      --bg-color: rgb(201, 209, 217);
      --text-color: rgb(13, 17, 23);
      --chat-widget-width: 40ch;
    }

    :host(chat-widget) {
      margin: 0;
      font-family: system-ui, sans-serif;
      color: var(--text-color);
      position: fixed;
      bottom: 1em;
      right: 3em;
      z-index: 10;
    }

    :host h1 {
      font-weight: bold;
      font-size: 1.5rem;
    }

    .chat-widget-launcher {
      width: 3em;
      height: 3em;
      border-radius: 2px;
      display: flex;
      justify-content: center;
      box-shadow: 0px 0px 3px 0px var(--text-color);
      border: solid var(--text-color);
      background-color: var(--bg-color);
    }

    :host .chat-widget-launcher::after {
      content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="36" viewBox="0 -960 960 960" width="36"><path d="M280-240q-17 0-28.5-11.5T240-280v-80h520v-360h80q17 0 28.5 11.5T880-680v600L720-240H280ZM80-280v-560q0-17 11.5-28.5T120-880h520q17 0 28.5 11.5T680-840v360q0 17-11.5 28.5T640-440H240L80-280Zm520-240v-280H160v280h440Zm-440 0v-280 280Z"/></svg>');
      display: flex;
      align-items: center;
    }

    :host .chat-widget-launcher:hover::after {
      cursor: pointer;
    }

    .chat-wrapper {
      min-height: 60ch;
      max-height: 75ch;
      max-width: 45ch;
      border: 1px solid;
      width: var(--chat-widget-width);
      border-radius: 5px 5px 0 0;
      box-shadow: 0px 0px 3px 0px var(--text-color);
      background-color: var(--bg-color);
      opacity: 0;
      display: none;
      transition: opacity 0.5s, display 0.5s;
      @starting-style {
        opacity: 0;
      }
    }

    .active {
      display: block;
      opacity: 1;
    }

    .inactive {
      display: none;
      opacity: 0;
    }

    .chat-wrapper .chat-box-contents {
      display: flex;
      flex-direction: column;
    }

    .chat-box-contents .chat-box-header {
      height: 3.5em;
      background: var(--text-color);
      color: var(--bg-color);
      padding: 1em;
      display: flex;
    }

    .chat-widget-close-icon {
      fill: currentColor;
      padding-left: 3px;
      margin-left: auto;
    }

    #msg-list-box {
      height: inherit;
      width: 100%;
      position: absolute;
    }

    #msg-list {
      overflow-y: auto;
      scrollbar-width: thin;
      overscroll-behavior: contain;
      padding: 0;
      margin-block-start: 0;
      margin-block-end: 0;
      position: absolute;
      bottom: 0;
    }

    #msg-list li {
      list-style: none;
    }

    #msg-list li.msg-item {
      background-color: var(--text-color);
      color: var(--bg-color);
      min-height: 2em;
      min-width: 0;
      width: fit-content;
      line-height: 2em;
      margin: 0.5em;
      padding: 0 0.5em;
      border-radius: 9px;
      overflow: hidden;
    }

    .chips-box {
      width: calc(var(--chat-widget-width) - 15px);
      background-color: var(--bg-color);
      border-bottom: 1px solid var(--text-color);
    }

    :host(chat-widget) .chip-item {
      display: inline-block;
      border: 1px solid var(--text-color);
      margin: 0.25em 0.5em;
      padding: 0.25em 0.5em;
      border-radius: 5px;
    }

    :host(chat-widget) .chip-item:hover {
      text-decoration: underline;
      cursor: pointer;
    }

    .chat-box-contents .chat-box-footer {
      min-height: 5em;
      max-height: 8em;
      border-top: 1px solid;
      width: 100%;
      max-width: 100%;
      overflow-y: auto;
      display: block;
      position: absolute;
      bottom: 0;
      right: 0;
    }

    .chat-box-contents .chat-box-footer .msg-input-box .msg-input {
      outline: none;
      display: block;
      width: 100%;
      overflow: auto;
      background: var(--text-color);
      resize: none;
      height: 9ch;
      border: 1px solid var(--text-color);
      color: var(--bg-color);
      scrollbar-width: thin;
      padding: 0.5em;
    }

    .chat-box-contents .chat-box-footer .msg-input[contenteditable]:empty::before {
      content: 'Type your message here';
      opacity: 0.3;
    }

    .chat-box-contents .chat-box-footer .msg-input-box {
      display: block;
    }

    .send-icon {
      padding: 0.25em;
      fill: currentColor;
      text-align: right;
    }

    .send-icon, .chat-widget-close-icon svg:hover {
      cursor: pointer;
    }

    </style>
    <div class="chat-widget-launcher">

    </div>
    <div class="chat-wrapper">
      <div class="chat-box-contents">
        <div class="chat-box-header">
          <strong>${title}</strong>
          <span class="chat-widget-close-icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/></svg>
          </span>
        </div>
        <div class="chat-box-body">
          <div id="msg-list-box">
            <ul id="msg-list"></ul>
          </div>
        </div>
        <div class="chat-box-footer">
          <div class="msg-input-box">
            <textarea
              name="msg-input"
              id="msg-input"
              class="msg-input"
              placeholder="Type your message here"
            ></textarea>
          </div>
          <div class="send-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path
                d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  `;
      // Binding methods
      // this._addToMessagesList = this._addToMessagesList.bind(this);
      // this._handleCurrentMessage = this._handleCurrentMessage.bind(this);
      this._handleSendButtonClick = this._handleSendButtonClick.bind(this);
      this._handleReceivedMessage = this._handleReceivedMessage.bind(this);
      this._chipClick = this._chipClick.bind(this);
      this.shadowRoot.appendChild(template.content.cloneNode(true));

    }

    connectedCallback() {
      const msgInput = this.shadowRoot.getElementById('msg-input');
      const sendButton = this.shadowRoot.querySelector('.send-icon');
      const chatLauncher = this.shadowRoot.querySelector('.chat-widget-launcher');
      const chatCloseIcon = this.shadowRoot.querySelector('.chat-widget-close-icon');

      sendButton.addEventListener('click', this._handleSendButtonClick);

      msgInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          this._handleCurrentMessage();
        }
      });

      chatLauncher.addEventListener('click', (event) => {
        this._toggleChatWidget();
      });

      chatCloseIcon.addEventListener('click', (event) => {
        this._toggleChatWidget();
      });

      // Insert prompt chips into the message list
      this._insertPromptChips();
      // Set element heights
      this._setElementHeights();

      // Event listeners
      this.addEventListener('chat-message-receive', this._handleReceivedMessage, false);
      this.addEventListener('chat-widget-activate', this._activateChatWidget, false);
      this.addEventListener('chat-widget-expand', this._expandChatWidget, false);
      this.addEventListener('chat-widget-collapse', this._collapseChatWidget, false);
    }

    disconnectedCallback() {
      // Remove listeners
    }

    // Funcitons
    _handleCurrentMessage() {
      const msgInput = this.shadowRoot.getElementById('msg-input');
      // console.log(msgInput.value);
      if (msgInput.value.length <= 0) return;
      this._addToMessagesList(msgInput.value);
      // Dispatch a custom event
      this.dispatchEvent(new CustomEvent('chat-message-send',
        { bubbles: true, detail: { message: msgInput.value } }));
      msgInput.value = '';
    }

    _handleSendButtonClick(event) {
      this._handleCurrentMessage();
    }

    _toggleChatWidget(event) {
      // Toggle display classes
      this.shadowRoot.querySelector('.chat-wrapper').classList.toggle('active');
      this.shadowRoot.querySelector('.chat-widget-launcher').classList.toggle('inactive');

      // Set element heights
      if (this.shadowRoot.querySelector('.chat-wrapper').classList.contains('active')) {
        this._setElementHeights();
      }
    }

    _addToMessagesList(value) {
      const msgList = this.shadowRoot.getElementById('msg-list');
      const li = document.createElement('li');
      const div = document.createElement('div');
      const span = document.createElement('span');
      const newMessage = document.createTextNode(value);
      span.appendChild(newMessage);
      div.appendChild(span);
      li.appendChild(div);
      li.classList.add('msg-item');
      msgList.appendChild(li);
      li.scrollIntoView(false);
      // this.parentNode.scrollTop = this.offsetTop;
    }

    _handleReceivedMessage(event) {
      const value = event.detail.message;
      console.log(value);
      this._addToMessagesList(value);
    }

    _activateChatWidget(event) {
      // Activate after auth
    }

    _expandChatWidget(event) {
      // Expand after activation
      this._toggleChatWidget(event);
    }

    _collapseChatWidget(event) {
      // Collapse event
    }

    _setElementHeights() {
      const wrapper = this.shadowRoot.querySelector('.chat-wrapper');
      const contents = this.shadowRoot.querySelector('.chat-box-contents');
      const header = this.shadowRoot.querySelector('.chat-box-header');
      const body = this.shadowRoot.querySelector('.chat-box-body');
      const footer = this.shadowRoot.querySelector('.chat-box-footer');
      const msgList = this.shadowRoot.querySelector('#msg-list')
      const wrapperHeight = wrapper.offsetHeight;
      const contentsHeigth = contents.offsetHeight;
      const headerHeight = header.offsetHeight;
      const bodyHeight = body.offsetHeight;
      const footerHeight = footer.offsetHeight;
      const maxBodyHeight = wrapperHeight - headerHeight - footerHeight;
      contents.style.height = `${wrapperHeight}px`;
      body.style.height = `${maxBodyHeight}px`;
      msgList.style.maxHeight = `${maxBodyHeight}px`;
    }

    _insertPromptChips() {
      // Build list of prompt chips
      const chips = this.chips;
      if (chips.length <= 0) return;
      const chipsBox = document.createElement('div');
      const greeting = document.createElement('h3');
      greeting.textContent = 'Hello there! Use quick prompts';
      greeting.style.textAlign = 'center';
      chipsBox.appendChild(greeting);
      chipsBox.classList.add('chips-box');
      chips.forEach((chip) => {
        const chipItem = document.createElement('div');
        chipItem.classList.add('chip-item');
        chipItem.dataset.code = chip.split('!')[0];
        chipItem.textContent = chip.split('!')[1];
        chipItem.addEventListener('click', this._chipClick);
        chipsBox.appendChild(chipItem);
      });
      const msgList = this.shadowRoot.querySelector('#msg-list');
      const li = document.createElement('li');
      li.appendChild(chipsBox);
      msgList.appendChild(li);
      // const chatBoxBody = this.shadowRoot.querySelector('.chat-box-body');
      // const msgListBox = this.shadowRoot.querySelector('#msg-list-box');
      // chatBoxBody.insertBefore(chipsBox, msgListBox);
    }

    _chipClick(e) {
      const chip = e.target;
      const chipValue = `Requesting ${chip.textContent}`;
      const chipCode = e.target.dataset.code;
      this._addToMessagesList(chipValue);
      this.dispatchEvent(new CustomEvent('chat-message-send',
        { bubbles: true, detail: { message: chipCode } }));
    }

    // Getters and Setters

    get title() {
      return this.getAttribute('title') || 'Chat Widget';
    }

    get chips() {
      const chips = [];
      for (const [key, value] of Object.entries(this.dataset)) {
        if (key.startsWith('chip-')) {
          chips.push(value);
        }
      };
      // console.log(chips);
      return chips;
    }

  }

  if (window.customElements.get('chat-widget') === undefined) {
    window.customElements.define('chat-widget', ChatWidget);
  }

})();
