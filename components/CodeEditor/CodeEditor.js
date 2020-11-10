import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import {ControlledEditor as Editor}from '@monaco-editor/react';
import path from 'path';
import previewCss from './../../pages/style.module.css';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm'
import css from './style.css';

// Mapping between file types and languages for the editor
const LANGUAGE_MAPPER = {
    "text/javascript" : 'javascript',
    "application/json" : 'json'
  };

function CodeEditor({ file, write }) {
  
  const [fileText, setfileText] = useState("This is dummy text");
  const [fileObj, setFileObj] = useState(file);

  file.text().then((text) => { 
      console.log(text);
      setfileText(text);
  });

  //Handle changes in the editor
  const handleEditorChange = (ev, value) => {
    console.log(value);
    var updatedFile = new File([value], file.name, {
      type: file.type,
      lastModified: new Date()
    });
    console.log(updatedFile);
    write(updatedFile, value);
    setFileObj(updatedFile);
  };

  return (
        <div className={css.gridContainer}>
            <div>
              <div className={previewCss.preview}>
                <div className={previewCss.title}>{path.basename(file.name)} - Editor</div>
                  <div className={previewCss.content}>
                    <Editor
                            value={fileText}
                            height="80vh"
                            language={LANGUAGE_MAPPER[file.type]}
                            onChange={handleEditorChange}
                          >
                    </Editor>
                  </div>
                </div>
              </div>
          </div>
  );
}

CodeEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func,
  fileText: PropTypes.string,
  Editor: PropTypes.object
};

export default CodeEditor;