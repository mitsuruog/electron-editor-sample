import * as React from "react";
import { remote } from "electron";
import * as fs from "fs";

import Editor from "./editor";

export interface AppState {
  filePath: string;
  text: string;
  editorValue: string;
}

export class App extends React.Component<{}, AppState> {

  constructor() {
    super();

    this.state = {
      filePath: "",
      text: "",
      editorValue: "",
    };

    this.onLoadFile      = this.onLoadFile.bind(this);
    this.onReadFile      = this.onReadFile.bind(this);
    this.onSaveFile      = this.onSaveFile.bind(this);
    this.onCreateNewFile = this.onCreateNewFile.bind(this);
    this.onEditorChange  = this.onEditorChange.bind(this);
  }

  render() {
    return (
      <div>
        <header>
          <button onClick={this.onLoadFile}>ファイルを開く</button>
          <button onClick={Boolean(this.state.filePath) ? this.onSaveFile : this.onCreateNewFile}>保存する</button>
        </header>
        <main>
          <Editor
            text={this.state.text}
            onChange={this.onEditorChange}
          />
        </main>
        <footer>
          {this.state.filePath}
        </footer>
      </div>
    );
  }

  private onLoadFile() {
    const win = remote.BrowserWindow.getFocusedWindow();
    remote.dialog.showOpenDialog(
      win, {
        properties: ["openFile"],
        filters: [{
          name: "Documents",
          extensions: ["txt", "text", "html", "js"]
        }]
      },
      (fileNames) => {
        if (Array.isArray(fileNames) && fileNames.length > 0) {
          this.onReadFile(fileNames[0])
        }
      }
    )
  }

  private onReadFile(filePath: string) {
    fs.readFile(filePath, (error, text) => {
      if (error != null) {
        alert("error : " + error);
        return;
      }

      this.setState({ filePath, text: text.toString() } as AppState);
    });
  }

  private onSaveFile() {
    const win = remote.BrowserWindow.getFocusedWindow();

    remote.dialog.showMessageBox(
      win, {
        title: "ファイルの上書きを行います。",
        type: "info",
        buttons: ["上書きする", "キャンセル"],
        message: "上書きしてもよろしいですか？",
      }, (response => {
        if (response === 0) {
          this.writeFile(this.state.filePath, this.state.editorValue);
        }
      }));
  }

  private onCreateNewFile() {
    const win = remote.BrowserWindow.getFocusedWindow();

    remote.dialog.showSaveDialog(
      win,
      {},
      (fileName) => {
        if (fileName) {
          this.writeFile(fileName, this.state.editorValue);
        }
      }
    )
  }

  private onEditorChange(editorValue: string) {
    this.setState({ editorValue } as AppState);
  }

  private writeFile(path: string, data: string) {
    fs.writeFile(path, data, (error) => {
      if (error != null) {
        alert("error : " + error);
      }
    });
  }
}
