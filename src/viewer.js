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
import {schema as schemaBasic} from "prosemirror-schema-basic"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "prosemirror-example-setup"

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
      dontUpdateComponent: true,
    };
    window.gcexports.dispatcher.dispatch(state);
  }
  function schemaPrep(schema) {
    if (typeof schema !== "object" || schema === null) {
      return schema;
    }
    let newSchema = Object.assign({}, schema);
    Object.keys(schema).forEach(key => {
      if (key === "toDOM") {
        newSchema[key] = (node) => { return schema[key] };
      } else if (key === "parseDOM") {
        newSchema[key] = schema[key];
      } else {
        newSchema[key] = schemaPrep(schema[key]);
      }
    });
    return newSchema;
  }
  let view, schema;
  const noteSchema = new Schema({
    nodes: {
      text: {},
      note: {
        content: "text*",
        toDOM() { return ["note", 0] },
        parseDOM: [{tag: "note"}]
      },
      notegroup: {
        content: "note+",
        toDOM() { return ["notegroup", 0] },
        parseDOM: [{tag: "notegroup"}]
      },
      doc: {
        content: "(note | notegroup)+"
      }
    }
  });
  let Viewer = React.createClass({
    componentDidMount() {
      let props = this.props;
      schema = props.obj && props.obj.schema && new Schema(schemaPrep(props.obj.schema)) || schemaBasic;
      let doc = props.obj && props.obj.state && props.obj.state.doc;
      let state;
      if (props.obj && props.obj.state) {
        state =
          EditorState.fromJSON({
            schema,
            plugins: [
//              history(),
//              keymap({"Mod-z": undo, "Mod-y": redo}),
              keymap(baseKeymap),
            ]
          }, props.obj.state);
      } else {
        state =
          EditorState.create({
            schema,
            plugins: [
//              history(),
//              keymap({"Mod-z": undo, "Mod-y": redo}),
              keymap(baseKeymap),
            ]
          });
      }
      view = new EditorView(document.querySelector("#editor"), {
        state,
        dispatchTransaction(transaction) {
          console.log("Document size went from", transaction.before.content.size,
                      "to", transaction.doc.content.size)
          let newState = view.state.apply(transaction)
          view.updateState(newState);
          update(newState.toJSON(), true);
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
