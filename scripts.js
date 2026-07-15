(function () {
    'use strict';

    // TODO: Create the ChatWidget class here 
    class ChatWidget extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.loadStyles();

            const title = this.title;

            const template = document.createElement('template');
            template.innerHTML = `
    
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

        // Load css
        async loadStyles() {
            const response = await fetch('chat-widget.css');
            const cssText = await response.text();

            const sheet = new CSSStyleSheet();
            await sheet.replace(cssText);

            // Apply the loaded styles to the shadow root
            this.shadowRoot.adoptedStyleSheets = [sheet];
        }

        // Handle message
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
            this._insertPromptChips();
        }

        _collapseChatWidget(event) {
            // Collapse event
            this._toggleChatWidget(event);
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
            greeting.textContent = this.greeting;
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

        get greeting() {
            return this.dataset.greeting;
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