import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import path from 'path';
import classNames from 'classnames';

import { listFiles } from '../files';

// Used below, these need to be registered
import MarkdownEditor from '../MarkdownEditor';
import PlaintextEditor from '../components/PlaintextEditor';

import IconPlaintextSVG from '../public/icon-plaintext.svg';
import IconMarkdownSVG from '../public/icon-markdown.svg';
import IconJavaScriptSVG from '../public/icon-javascript.svg';
import IconJSONSVG from '../public/icon-json.svg';

import css from './style.module.css';
import CodeEditor from '../components/CodeEditor/CodeEditor';

const TYPE_TO_ICON = {
  'text/plain': IconPlaintextSVG,
  'text/markdown': IconMarkdownSVG,
  'text/javascript': IconJavaScriptSVG,
  'application/json': IconJSONSVG
};

function FilesTable({ files, activeFile, setActiveFile, setActiveIndex }) {
  return (
    <div className={css.files}>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr
              key={file.name}
              className={classNames(
                css.row,
                activeFile && activeFile.name === file.name ? css.active : ''
              )}
              onClick={() => {
                
                setActiveFile(file);
                setActiveIndex(index);
              }}
            >
              <td className={css.file}>
                <div
                  className={css.icon}
                  dangerouslySetInnerHTML={{
                    __html: TYPE_TO_ICON[file.type]
                  }}
                ></div>
                {path.basename(file.name)}
              </td>

              <td>
                {new Date(file.lastModified).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

FilesTable.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  activeFile: PropTypes.object,
  setActiveFile: PropTypes.func,
  setActiveIndex: PropTypes.func
};

function Previewer({ file }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [file]);

  return (
    <div className={css.preview}>
      <div className={css.title}>{path.basename(file.name)}</div>
      <div className={css.content}>{value}</div>
    </div>
  );
}

Previewer.propTypes = {
  file: PropTypes.object
};

// Uncomment keys to register editors for media types
const REGISTERED_EDITORS = {
  "text/plain": PlaintextEditor,
  "text/markdown": MarkdownEditor,
  "text/javascript" : CodeEditor,
  "application/json" : CodeEditor
};

function PlaintextFilesChallenge() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const files = listFiles();
    var cachedData = JSON.parse(localStorage.getItem("files"));

    if(cachedData == null || cachedData.length == 0)
    {
      //localstorage empty, use the files data from array
      setFiles(files);
    }
    else
    {
       // set files array from localstorage data.
       var newFiles = files.map( localFile => {

          //Check if this file present in cache
          if(cachedData[localFile.name] !== undefined)
          {
              var cachedFile = cachedData[localFile.name];
              var newFile = new File(
                [cachedFile.content],
                localFile.name,
                {
                   type : cachedFile.type,
                   lastModified : cachedFile.lastModified
                }
              );

              return newFile;
          }
          
          return localFile;

       });

       setFiles(newFiles);
    }

  }, []);

  const write = (file, content) => {

    console.log("Current index", activeIndex);
    var cachedFiles = JSON.parse(localStorage.getItem('files'));
    if(cachedFiles == null)
    {
        cachedFiles = {};
    }

    cachedFiles[file.name] = {
       name : file.name,
       content : content,
       type : file.type,
       lastModified : file.lastModified
    };

    var updatedFiles = files.map( oldFile => {
      if(oldFile.name == file.name)
      {
          return file;
      }
      return oldFile;
    });
    
    //Update the files array
    setFiles(updatedFiles);
    localStorage.setItem("files", JSON.stringify(cachedFiles));
  };

  const Editor = activeFile ? REGISTERED_EDITORS[activeFile.type] : null;

  return (
    <div className={css.page}>
      <Head>
        <title>Rethink Engineering Challenge</title>
      </Head>
      <aside>
        <header>
          <div className={css.tagline}>Rethink Engineering Challenge</div>
          <h1>Fun With Plaintext</h1>
          <div className={css.description}>
            Let{"'"}s explore files in JavaScript. What could be more fun than
            rendering and editing plaintext? Not much, as it turns out.
          </div>
        </header>

        <FilesTable
          files={files}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
          setActiveIndex={setActiveIndex}
        />

        <div style={{ flex: 1 }}></div>

        <footer>
          <div className={css.link}>
            <a href="https://v3.rethink.software/jobs">Rethink Software</a>
            &nbsp;—&nbsp;Frontend Engineering Challenge
          </div>
          <div className={css.link}>
            Questions? Feedback? Email us at jobs@rethink.software
          </div>
        </footer>
      </aside>

      <main className={css.editorWindow}>
        {activeFile && (
          <>
            {Editor && <Editor file={activeFile} write={write} />}
            {!Editor && <Previewer file={activeFile} />}
          </>
        )}

        {!activeFile && (
          <div className={css.empty}>Select a file to view or edit</div>
        )}
      </main>
    </div>
  );
}

export default PlaintextFilesChallenge;
