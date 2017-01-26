'use babel';

import MaterialColorPickerView from './material-color-picker-view';
import { CompositeDisposable } from 'atom';
import request from 'request';

export default {

  materialColorPickerView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.materialColorPickerView = new MaterialColorPickerView(state.materialColorPickerViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.materialColorPickerView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'material-color-picker:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.materialColorPickerView.destroy();
  },

  serialize() {
    return {
      materialColorPickerViewState: this.materialColorPickerView.serialize()
    };
  },

  toggle() {
    console.log('MaterialColorPicker was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
