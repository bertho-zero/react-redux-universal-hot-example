import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import Dropzone from 'react-dropzone';
import * as uploadActions from 'redux/modules/upload';

const selector = getFormValues('upload');

@reduxForm({
  form: 'upload'
})
@connect(
  state => ({
    ...selector(state, 'files'),
    uploadError: state.upload.uploadError
  }),
  { sendFiles: uploadActions.sendFiles }
)
export default class Upload extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    sendFiles: PropTypes.func,
    uploadError: PropTypes.string,
    files: PropTypes.array
  };

  renderDropzoneInput = ({ input, multiple, content, values, meta: { touched, error } }) => (
    <div>
      <Dropzone multiple={multiple} onDrop={input.onChange}>
        {content}
      </Dropzone>
      {touched && error && <span className="error">{error}</span>}
      {values && Array.isArray(values) && (
        <ul>
          { values.map((file, i) => <li key={i}>{file && file.value && file.value.name}</li>) }
        </ul>
      )}
    </div>
  )

  render() {
    const { handleSubmit, sendFiles, uploadError, files } = this.props;

    return (
      <div className="container">
        <Helmet title="Upload" />
        <h1>Upload</h1>
        <Field
          name="files"
          type="file"
          parse={values => values.map(value => ({ key: 'files', value }))}
          multiple
          component={this.renderDropzoneInput}
          values={files}
          content={<div>Drop your files, or click here !</div>}
        />
        {uploadError && <p className="text-danger"><strong>{uploadError}</strong></p>}
        <button className="btn btn-primary" onClick={handleSubmit(sendFiles)}>Upload</button>
      </div>
    );
  }
}
