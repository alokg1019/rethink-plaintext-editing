import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import {ControlledEditor as Editor}from '@monaco-editor/react';
import path from 'path';
import { Col, Container } from 'react-bootstrap';
import previewCss from './../pages/style.module.css';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm'
import css from './style.css';

function Previewer({ file }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [file]);

  return (
    <div className={previewCss.preview}>
      <div className={previewCss.title}>{path.basename(file.name)} - Preview</div>
      <div className={previewCss.content}>
        <ReactMarkdown plugins={[gfm]}>{value}</ReactMarkdown>
      </div>
    </div>
  );
}

Previewer.propTypes = {
  file: PropTypes.object
};


function MarkdownEditor({ file, write }) {
  
  const [fileText, setfileText] = useState("");
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
            <div className={css.gridChild}>
              <div className={previewCss.preview}>
                <div className={previewCss.title}>{path.basename(file.name)} - Editor</div>
                  <div className={previewCss.content}>
                    <Editor
                            value={fileText}
                            height="80vh"
                            language="markdown"
                            onChange={handleEditorChange}
                          >
                    </Editor>
                  </div>
                </div>
              </div>
            
            <div className={css.gridChild}>
              <Previewer file={fileObj} />
            </div>
          </div>
  );
}

MarkdownEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func,
  fileText: PropTypes.string,
  Editor: PropTypes.object
};

export default MarkdownEditor;