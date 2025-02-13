import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AxiosError from 'axios-error';
import './chatupload.css'; // CSS file for the merged component
//import { useNavigate } from 'react-router-dom';

interface Course {
  courseId: string,
  title: string;
  description: string;
  imageUrl: string;
}

interface Message {
  courseId: string;
  content: string;
  sender: string;
  timestamp: string;
}

interface ApiResponse {
  body: string;
}

const chatupload: React.FC = () => {
  // Call course from db
  const [course, setCourse] = useState<Course>();

  const { courseId } = useParams();

  useEffect(() => { 
    const fetchCourseAndMessages = async () => {
      try {
        // שליפת פרטי הקורס (ללא שינוי)
        const responseCourse = await axios.get<ApiResponse>(`https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/getCourse/${courseId}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const course = JSON.parse(responseCourse.data.body); // No need for type assertion

        console.log('User profile fetched:', course);
        setCourse(course);

        // שליפת הודעות הצ'אט של הקורס (השינוי כאן)
        const responseMessages = await axios.get<ApiResponse>(`https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/getMessages/${courseId}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const messages = JSON.parse(responseMessages.data.body); // No need for type assertion

        console.log("Messages received:", messages);
        setDBMessages(messages);

      } catch (error) {
        console.error('Error fetching course or messages:', error);
      }
    };
  
  fetchCourseAndMessages();
  }, [courseId]);
  
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get<ApiResponse>(`https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/getCourse/${courseId}`, {
          headers: {
            'Content-Type': 'application/json' // Important!
          }
        });

        const course = JSON.parse(response.data.body); // No need for type assertion

        console.log('Course fetched:', course);
        setCourse(course);

      } catch (error) {
        console.error('Error fetching course:', error);

        if (error instanceof AxiosError) {
          console.error("Axios Error Details:", error.response?.data, error.response?.status, error.response?.headers);
          console.error("Axios Request:", error.request);
          console.error("Axios Message:", error.message);
        } else if (error instanceof Error) {
          console.error("General Error:", error.message);
        } else {
          console.error("Unknown Error:", error);
        }
      }
    };

    fetchCourse();
  },[courseId]);

  

  // State for chat messages
  const [message, setMessage] = useState('');
  const [DBmessages, setDBMessages] = useState<Message[]>([]);


  // State for file uploads
  const [uploadedFiles, setUploadedFiles] = useState<{ fileName: string; fileUrl: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('No file chosen');

  // Handle sending a chat message
  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        // שלח את ההודעה לשרת
        await axios.post('https://0uipl61dfa.execute-api.us-east-1.amazonaws.com/dev/sendMessage', { 
          courseId, // הקורס שאליו ההודעה שייכת
          content: message, // תוכן ההודעה
          timestamp: Date.now(), // זמן ההודעה
        }, {
          headers: {
            'Content-Type': 'application/json' // חשוב!
          }
        });
  
        window.location.reload();
  
        // אפשר להוסיף טיפול בתגובה מהשרת כאן אם רוצים
  
      } catch (error) {
        console.error('Error sending message:', error);
      }
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
          <h2>{course ? `${course.title} Course Chat` : 'Loading Course'}</h2>
          <div className="chat-box">
            {DBmessages.map((msg, index) => ( 
              <div key={index} className="message"><strong>{msg.sender} at {msg.timestamp} :</strong> <br></br>{msg.content}</div> 
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
