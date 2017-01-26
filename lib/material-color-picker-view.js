'use babel';

import {
    CompositeDisposable
} from 'atom';
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

        const list = document.createElement('ul');
        list.classList.add('main-list');

        this.download("http://alnn.myftp.org:8080/color-palette.json").then((text) => {

            colors = JSON.parse(text);

            Object.keys(colors).forEach(key => {

                const li = document.createElement('li');
                li.textContent = key;

                let color = colors[key]["shade_500"];
                li.style.backgroundColor = color;

                if (key != "white" && key != "black") {
                    color = color.substring(1);
                    let colorarray = color.match(/.{2}/g).map(hex => Number.parseInt(hex, 16));
                    let isDark = colorarray.reduce((a, c) => a + c, 0) / 3 < 128;

                    if (isDark) {
                        li.style.color = "black";
                    } else {
                        li.style.color = "white";
                    }

                    li.addEventListener("click", function() {

                        list.innerHTML = "";

                        Object.keys(colors[key]).forEach(shade => {

                            const li = document.createElement('li');
                            li.style.backgroundColor = colors[key][shade]
                            li.textContent = shade;

                            list.appendChild(li);
                        });

                        const back = document.createElement('li');
                        back.textContent = "Back";

                        list.appendChild(back);
                    });
                }

                list.appendChild(li);

            });

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
