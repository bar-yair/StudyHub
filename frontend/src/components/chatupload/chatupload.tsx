import React, { useState } from 'react';
import './chatupload.css'; // CSS file for the merged component

const chatupload: React.FC = () => {
  // State for chat messages
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  // State for file uploads
  const [uploadedFiles, setUploadedFiles] = useState<{ fileName: string; fileUrl: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('No file chosen');

  // Handle sending a chat message
  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  // Handle file upload
  const handleUpload = () => {
    if (!selectedFile) {
      return; // Do nothing if no file is selected
    }

    // Create a URL for the file (for preview purposes)
    const fileUrl = URL.createObjectURL(selectedFile);

    // Add the uploaded file to the list
    setUploadedFiles([...uploadedFiles, { fileName, fileUrl }]);

    // Reset file input and state
    setSelectedFile(null);
    setFileName('No file chosen');
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Shift+Enter: Add a new line
        event.preventDefault(); // Prevent the default behavior of Enter (submitting the form)
        setMessage((prevMessage) => prevMessage + '\n');
      } else {
        // Enter: Send the message
        event.preventDefault(); // Prevent the default form submission
        handleSendMessage();
      }
    }
  };

  return (
    <div>
      <div className="merge-container">
        {/* Chat Section */}
        <div className="chat-section">
          <h2>StudyHub Chat</h2>
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className="message">{msg}</div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown} // Listen for the Enter key
              placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="upload-section">
        <div className="uploaded-files">
            
            <h3>Uploaded Files:</h3>
            <ul>
              {uploadedFiles.map((file, index) => (
                <li key={index}>
                  <img src="/icons/upload-icon.png" alt="File Icon" className="file-icon" />
                  <a href={file.fileUrl} download={file.fileName}>
                    {file.fileName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className='upload-container'>
          <h3>Upload Your File</h3>
          <div className="upload-box">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              accept="image/*, .pdf, .docx"
            />
            <label htmlFor="file-upload">{fileName}</label>
          </div>
          <button onClick={handleUpload} className="upload-button">Upload</button>
          </div>
          {/* Display uploaded files */}
        </div>
      </div>
    </div>
  );
};

export default chatupload;
