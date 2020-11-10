import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import previewCss from './../../pages/style.module.css';


function PlaintextPreviewer({ file }) {
    const [value, setValue] = useState('');
  
    useEffect(() => {
      (async () => {
        setValue(await file.text());
      })();
    }, [file]);
  
    return (
      <div className={previewCss.preview}>
        <div className={previewCss.title}>{path.basename(file.name)} - Preview</div>
            <div className={previewCss.content}>{value}</div>
      </div>
    );
  }
  
  PlaintextPreviewer.propTypes = {
    file: PropTypes.object
  };

  export default PlaintextPreviewer;