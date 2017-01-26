'use babel';

import {
    CompositeDisposable
} from 'atom';
import request from 'request';

export default class MaterialColorPickerView {

    showMenu() {

        console.log("showMenu");

        this.list.innerHTML = "";

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

                            let temp = this.list;
                            let that = this;

                            li.addEventListener("click", function() {

                                    temp.innerHTML = "";

                                    Object.keys(colors[key]).forEach(shade => {

                                            const li = document.createElement('li');
                                            li.style.backgroundColor = colors[key][shade];
                                            li.textContent = shade;
                                            let colorarray = colors[key][shade].substring(1).match(/.{2}/g).map(hex => Number.parseInt(hex, 16));
                                            let isDark = colorarray.reduce((a, c) => a + c, 0) / 3 < 128;

                                            if (isDark) {
                                                li.style.color = "white";
                                            } else {
                                                li.style.color = "black";
                                            }

                                            let that2 = that;

                                            li.addEventListener("click", function() {

                                                    let editor
                                                    if (editor = atom.workspace.getActiveTextEditor()) {
                                                        editor.insertText(colors[key][shade]);
                                                        that2.god.toggle();
                                                    }

                                                    });

                                                temp.appendChild(li);
                                            });

                                        temp2 = that;

                                        const back = document.createElement('li'); back.textContent = "Back"; back.addEventListener("click", function() {
                                            temp2.showMenu();
                                        });

                                        temp.appendChild(back);
                                    });
                            }

                            this.list.appendChild(li);
                        });

                    const back = document.createElement('li'); back.textContent = "Exit";
                    let that = this; back.addEventListener("click", function() {
                        that.god.toggle();
                    }); this.list.appendChild(back);

                    this.element.appendChild(this.list);
                });
        }

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

            this.list = document.createElement('ul');
            this.list.classList.add('main-list');

            this.showMenu();
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
