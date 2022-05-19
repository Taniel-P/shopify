import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
// const API_KEY =require('./process.env')
const KEY = require('./config.js');

function App() {

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(() => {
    const savedMessages = window.localStorage.getItem('item');
    const initialValue = JSON.parse(savedMessages);
    return initialValue || [];
  });

  useEffect(() => {
    window.localStorage.setItem('item', JSON.stringify(messages));
  }, [messages]);

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  }

  const data = {
    prompt: inputText,
    temperature: 0.5,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  }

  const onSubmit = () => {
    if (inputText.length > 0) {
      axios.post('https://api.openai.com/v1/engines/text-curie-001/completions', data, {
        headers: {
          Authorization: `Bearer ${KEY.API_KEY}`,
        }
      })
      .then((response) => {
        const text = response.data.choices[0].text;
        const container = {
          'prompt': inputText,
          'message': text
        };
        setMessages(messages => [container, ...messages]);
        setInputText('');
      })
      .catch((err) => {
        console.log('ERROR', err);
      })
    }
  }

  const handleClear = () => {
    window.localStorage.removeItem('item');
    setMessages([]);
  }

  return (
    <div className="App">
      <h1 className="title">Talk to AI!</h1>
      <form className="inputForm" >
        <textarea className="promptInput" value={inputText} onChange={handleTextChange}></textarea>
      </form>
      <button className="submitButton" onClick={onSubmit}>Submit</button>
      <h1 className="responseHeader">Responses</h1>
      <button className="clearResponses" onClick={handleClear}>Clear</button>
      <div className="responses">
        {messages.map((message, i) =>
        <div className="responseContainer" key={i}>
          <div className="responsePrompt"><strong>Prompt:</strong> {message.prompt}</div>
          <div className="responseText"><strong>Response:</strong> {message.message}</div>
        </div>
        )}
      </div>
    </div>
  );
}

export default App;
