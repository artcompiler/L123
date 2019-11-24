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
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "prosemirror-example-setup"

import {undo, redo, history} from "prosemirror-history"
import {keymap} from "prosemirror-keymap"
import {baseKeymap} from "prosemirror-commands"

const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks
});

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
  let Viewer = React.createClass({
    view: undefined,
    componentDidMount() {
      let state = EditorState.create({schema})
      let view = this.view = new EditorView(document.querySelector("#editor"), {
        state,
        dispatchTransaction(transaction) {
          // console.log("Document size went from", transaction.before.content.size,
          //             "to", transaction.doc.content.size)
          let newState = view.state.apply(transaction)
          view.updateState(newState)
//          update(newState);
        }
      });
    },
    componentDidUpdate() {
      // let props = this.props;
      // this.view.updateState(props.data.proseMirrorState || props.obj.proseMirrorState);
    },
    render() {
      return (
        <div>
          <link rel="stylesheet" href="/L123/style.css" />
          <div className="L123">
            <div id="editor" style={{"marginBottom": "23px"}}></div>
          </div>
        </div>
    )},
  });
  return {
    Viewer: Viewer
  };
})();
