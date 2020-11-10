import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import PlaintextPreviewer from './../PlaintextPreviewer/index';
import css from './style.css';
import previewCss from './../../pages/style.module.css';
import path from 'path';
import {ControlledEditor as Editor } from '@monaco-editor/react';

function PlaintextEditor({ file, write }) {
  
  const [fileText, setfileText] = useState("This is dummy text");
  const [fileObj, setFileObj] = useState(file);

  useEffect(() => {
    file.text().then((text) => { 
      console.log("Reading text:" , text);
      setfileText(text);
      setFileObj(file);
  });
}, [file]);

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
    <div className={css.gridChild}>
      <div className={previewCss.preview}>
        <div className={previewCss.title}>{path.basename(file.name)} - Editor</div>
          <div className={previewCss.content}>
            <Editor
                    value={fileText}
                    height="80vh"
                    width='100%'
                    language="plaintext"
                    onChange={handleEditorChange}
                  >
            </Editor>
          </div>
        </div>
      </div>
    
    <div className={css.gridChild}>
      <PlaintextPreviewer file={fileObj} />
    </div>
  </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
