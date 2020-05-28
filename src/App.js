import React, { Component } from 'react';
import './App.css';

var Tesseract = require('tesseract.js');

class App extends Component {
  
  // Constructor method
  constructor(props) {
    super(props)
    this.state = {
      uploads: [],
      patterns: [],
      documents: []
    };    
  }

  // method to handle the files put on the uploader
  handleChange = (event) => {
    if (event.target.files[0]) {
      var uploads = []
      for (var key in event.target.files) {
        if (!event.target.files.hasOwnProperty(key)) continue;
        let upload = event.target.files[key]
        uploads.push(URL.createObjectURL(upload))
      }
      this.setState({
        uploads: uploads
      })
    } else {
      this.setState({
        uploads: []
      })
    }
  }

  // This method reads the uploads, call Tesseract API and generates the result text, the pattern and confidence level of prediction.
  generateText = () => {
    let uploads = this.state.uploads
  
    for(var i = 0; i < uploads.length; i++) {
      Tesseract.recognize(uploads[i],'eng')
      .catch(err => {
        console.error(err)
      })
      .then(result => {
        // Get Confidence score
        let confidence =  result.data.confidence
        
        // Define a confidence Flag to help the user guess if the result is good or not
        let confidenceFlag = ""
  
        // Get full output
        let text = result.data.text
  
        // Get codes
        let pattern =  /./g;
        let patterns = result.data.text.match(pattern);
        
        // Set confidence flag
        if (confidence < 50) {confidenceFlag = "Poor"};
        if (confidence > 50 && confidence < 90) {confidenceFlag = "Good"};
        if (confidence > 90) {confidenceFlag = "Very Good!"};
        
        // Update state
        this.setState({ 
          patterns: this.state.patterns.concat(patterns),
          documents: this.state.documents.concat({
            pattern: patterns,
            text: text,
            confidence: confidence,
            confidenceFlag: confidenceFlag
          })
        })
      })
    }
  }

  render() {
    return (
      <div className="app">
        
        <header className="header">
          
          <h1>TesseReact</h1>
          <h2> The OCR app made with React and Tesseract</h2>
        
        </header>

        { /* File uploader  Input*/ }
        <section className="hero">
          
          <label className="fileUploaderContainer">
            Click here to upload documents
            <input type="file" id="fileUploader" onChange={this.handleChange} multiple />
          </label>

          <div>
            { this.state.uploads.map((value, index) => {
              return <img key={index} src={value} width="100px" />
            }) }
          </div>

          <button onClick={this.generateText} className="button">Read the Image Now!</button>
        </section>

        { /* Results Area */ }
        <section className="results">
          { this.state.documents.map((value, index) => {
            return (
              
              <div key={index} className="results__result">
                
                <div className="results__result__image">
                  <img src={this.state.uploads[index]} width="250px" />
                </div>
                
                <div className="results__result__info">
                  
                  <div className="results__result__info__codes">
                    <small><strong>Your Confidence Score is:</strong> {value.confidence} ({value.confidenceFlag})</small>
                  </div>
                  
                  <div className="results__result__info__codes">
                    <small><strong>The Pattern Identified is:</strong> {value.pattern.map((pattern) => { return pattern + ', ' })}</small>
                  </div>
                  
                  <div className="results__result__info__text">
                    <small><strong>Here is the Full Output:</strong> {value.text}</small>
                  </div>
                
                </div>
              
              </div>
            )
          }) }
        </section>
      </div>
    )
  }

}

export default App;