import * as React from "react";
import * as ace from "brace";

import "brace/mode/javascript";
import "brace/theme/monokai";

export interface EditorProps {
  text: string;
  onChange: (editorValue: string) => void;
}

export default class Editor extends React.Component<EditorProps, {}> {

  private editor: ace.Editor;

  componentDidMount() {
    this.editor = ace.edit("editor");
    this.editor.setTheme("ace/theme/monokai");
    this.editor.getSession().setMode("ace/mode/javascript");

    if (typeof this.props.onChange === "function") {
      this.editor.on("change", () => this.props.onChange(this.editor.getValue()));
    }
  }

  componentWillReceiveProps(nextProps: EditorProps) {
    if (nextProps.text !== this.props.text) {
      this.editor.setValue(nextProps.text);
    }
  }

  render() {
    return (
      <div id="editor" />
    );
  }
}
