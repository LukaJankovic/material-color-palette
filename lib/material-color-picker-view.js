'use babel';

import { CompositeDisposable } from 'atom';
import request from 'request';

export default class MaterialColorPickerView {

    download(url) {
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    resolve(body)
                } else {
                    reject({
                        reason: 'Unable to download page'
                    })
                }
            })
        })
    }

    constructor(serializedState) {
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('material-color-picker');

        // Create message element
        const message = document.createElement('div');
        message.textContent = 'loading';
        message.classList.add('message');

        const list = document.createElement('ul');

        this.download("http://alnn.myftp.org:8080/color-palette.json").then((text) => {

            colors = JSON.parse(text);

            for (var i = 0; i < Object.keys(colors).length; i++) {

                const li = document.createElement('li');
                li.textContent = Object.keys(colors)[i];

                list.appendChild(li);
            }

            this.element.appendChild(list);
        });
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getElement() {
        return this.element;
    }
}
