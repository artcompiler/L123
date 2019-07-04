/* Copyright (c) 2017, Art Compiler LLC */
/* @flow */
import {
  assert,
  message,
  messages,
  reserveCodeRange,
  decodeID,
  encodeID,
} from "./share.js";
//import * as React from "react";
import * as d3 from "d3";
import React from 'react';
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
import {undo, redo, history} from "prosemirror-history"
import {keymap} from "prosemirror-keymap"
import {baseKeymap} from "prosemirror-commands"

window.gcexports.viewer = (function () {
  function capture(el) {
    return null;
  }
  function update(proseMirrorState, recompileCode) {
    let state = {}
    state[window.gcexports.id] = {
      data: {
        proseMirrorState,
      },
      recompileCode: recompileCode,
    };
    window.gcexports.dispatcher.dispatch(state);
  }
  let Editor = React.createClass({
    view: undefined,
    componentDidMount() {
      let state;
      if (this.props.newState && this.props.newState.doc) {
        state = EditorState.create({
          schema: schema,
          doc: this.props.newState.doc,
          plugins: [
            history(),
            keymap({"Mod-z": undo, "Mod-y": redo}),
            keymap(baseKeymap),
          ]
        });
      } else {
        let doc = schema.node("doc", null, [
          schema.node("paragraph", null, [schema.text("One.")]),
          schema.node("horizontal_rule"),
          schema.node("paragraph", null, [schema.text("Two!")])
        ]);
        state = EditorState.create({
          schema: schema,
          doc: doc,
          plugins: [
            history(),
            keymap({"Mod-z": undo, "Mod-y": redo}),
            keymap(baseKeymap),
          ]
        });
      }
      let view = this.view = new EditorView(document.querySelector("#editor"), {
        state,
        dispatchTransaction(transaction) {
          console.log("Document size went from", transaction.before.content.size,
                      "to", transaction.doc.content.size);
          let newState = view.state.apply(transaction);
          view.updateState(newState);
          update(newState);
        },
      });
    },
    componentDidUpdate() {
      let props = this.props;
      this.view.updateState(props.newState);
    },
    render() {
      return (
        <div>
          <div key="1" id="editor" style={{"marginBottom": "23px"}}></div>
          <div key="2" style={{"display": "none"}} id="content">
            <h3>Hello ProseMirror</h3>
            <p>This is editable text. You can focus it and start typing.</p>
          </div>
        </div>
    )},
  });
  let Viewer = React.createClass({
    render() {
      let props = this.props;
      return (
        <div>
          <link rel="stylesheet" href="/L123/style.css" />
          <div className="L123">
             <Editor newState={props.data.proseMirrorState}/>
          </div>
        </div>
      );
    },
  });
  return {
    capture: capture,
    Viewer: Viewer
  };
})();
