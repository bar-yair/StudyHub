const AWS = require('aws-sdk');
const { APIGatewayProxyEvent, Context } = require('aws-lambda');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const JWT_SECRET = process.env.JWT_SECRET || 'myTestSecretKey';

exports.addCourse = async (event, context) => {
  const data = JSON.parse(event.body || '{}');
  const { title, courseId, description, imageUrl } = data;

  const params = {
    TableName: 'Courses',
    Key: { courseId },
  };

  try {
    const existingCourse = await dynamoDb.get(params).promise();

    if (existingCourse.Item) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Course already exists' }),
      };
    }

    const newCourse = {
      TableName: 'Courses',
      Item: {
        courseId,
        title,
        description,
        imageUrl,
      },
    };

    await dynamoDb.put(newCourse).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(newCourse.Item),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server Error' }),
    };
  }
};

exports.checkAuth = async (event, context) => {
  const token = event.headers.Authorization || event.headers.authorization; // Check both cases

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'No token provided' }),
    };
  }

  const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider(); // Initialize inside handler
  const params = { AccessToken: token };

  try {
    const response = await cognitoIdentityServiceProvider.getUser(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ isAuthenticated: true, message: 'User is authenticated', user: response }),
    };
  } catch (err) {
    console.error(err.message);
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid or expired token' }),
    };
  }
};

exports.deleteCourse = async (event, context) => {
  const { courseId } = event.pathParameters;
  const params = {
    TableName: 'Courses',
    Key: {
      courseId: parseInt(courseId, 10), // Important: Parse courseId to number
    },
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Course deleted successfully' }),
    };
  } catch (err) {
    console.error(err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server Error' }),
    };
  }
};


exports.deleteUser = async (event, context) => {
    const { username } = event.pathParameters;
    const params = {
        TableName: 'Users',
        Key: {
            username: username,
        },
    };

    try {
        await dynamoDb.delete(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User deleted successfully' }),
        };
    } catch (err) {
        console.error(err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server Error' }),
        };
    }
};

exports.getCourse = async (event, context) => {
  const { courseId } = event.pathParameters;
  const params = {
    TableName: 'Courses',
    Key: {
      courseId: parseInt(courseId, 10),
    },
  };

  try {
    const data = await dynamoDb.get(params).promise();
    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Course not found' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } catch (err) {
    console.error(err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server Error' }),
    };
  }
};

exports.getCourses = async (event, context) => {
  try {
    const params = {
      TableName: 'Courses',
    };

    const data = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (err) {
    console.error(err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server Error' }),
    };
  }
};

exports.getMessages = async (event, context) => {
  try {
    const { courseId } = event.pathParameters;

    const params = {
      TableName: 'Messages',
      KeyConditionExpression: 'courseId = :courseId',
      ExpressionAttributeValues: {
        ':courseId': courseId
      }
    };

    const data = await dynamoDb.query(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    };
  }
};

exports.getUserProfile = async (event, context) => {
    try {
        const token = event.headers.Authorization || event.headers.authorization;
        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Unauthorized' }),
            };
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Fetching profile for user:', decoded.username);

        const params = {
            TableName: 'Users',
            Key: {
                username: decoded.username, // Use username as PK
            },
        };

        const data = await dynamoDb.get(params).promise();

        if (!data.Item) {
            console.log('User not found');
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'User not found' }),
            };
        }

        console.log('User profile:', data.Item);
        return {
            statusCode: 200,
            body: JSON.stringify(data.Item),
        };
    } catch (err) {
        console.error('Server Error:', err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server Error' }),
        };
    }
};


exports.getUsers = async (event, context) => {
  try {
    const params = {
      TableName: 'Users',
    };

    const data = await dynamoDb.scan(params).promise();

    console.log('Found users:', data.Items);
    if (!data.Items || data.Items.length === 0) {
      console.log('No users found in database');
      return {
        statusCode: 404,
        body: JSON.stringify('No users found'), // Important: Stringify the response
      };
    }

    console.log(`Sending ${data.Items.length} users`);
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items), // Important: Stringify the response
    };
  } catch (err) {
    console.error('Error in returnUsers:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify('Server Error'), // Important: Stringify the response
    };
  }
};

exports.loginUser = async (event, context) => {
    const { username, password } = JSON.parse(event.body || "{}");
    try {
      const params = {
        TableName: 'Users',
        Key: { username },
      };
  
      const data = await dynamoDb.get(params).promise();
  
      if (!data.Item) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid Username or Password' }),
        };
      }
  
      const user = data.Item;
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid Username or Password' }),
        };
      }
  
      const token = jwt.sign({ username: user.username }, JWT_SECRET); // Use username in JWT payload
  
      return {
        statusCode: 200,
        headers: { // Set cookie in headers
          'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=None`, // Customize cookie options as needed
        },
        body: JSON.stringify({
          message: 'Login successful',
          token,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        }),
      };
    } catch (err) {
      console.error(err.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server Error' }),
      };
    }
  };
  
  exports.logoutUser = async (event, context) => {
    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': 'token=; HttpOnly; Secure; SameSite=None; Max-Age=0', // Clear cookie
      },
      body: JSON.stringify({ message: 'Logged out successfully' }),
    };
  };
  
  exports.registerUser = async (event, context) => {
      const data = JSON.parse(event.body || '{}');
      const { firstName, lastName, birthDate, gender, username, password } = data;
  
      try {
  
          const hashedPassword = await bcrypt.hash(password, 10);
          const params = {
              TableName: 'Users',
              Item: {
                  username,
                  firstName,
                  lastName,
                  birthDate,
                  gender,
                  password: hashedPassword,
              },
          };
  
          await dynamoDb.put(params).promise();
  
          return {
              statusCode: 200,
              body: JSON.stringify({ message: 'User registered successfully' }),
          };
      } catch (error) {
          console.error(error);
          return {
              statusCode: 500,
              body: JSON.stringify({ error: 'Server error' }),
          };
      }
  };
  
  exports.sendMessage = async (event, context) => {
    const data = JSON.parse(event.body || '{}');
    const { courseId, content } = data;
    const token = event.headers.Authorization || event.headers.authorization;
  
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const username = decoded.username; // Get username from JWT payload
  
      const message = {
        courseId, // Add courseId to the message
        timestamp: Date.now(), // Store timestamp as a number (milliseconds)
        sender: username,
        content,
      };
  
      const messageParams = {
        TableName: 'Messages',
        Item: message,
      };
      await dynamoDb.put(messageParams).promise();
  
      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Message sent successfully', newMessage: message }),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server error' }),
      };
    }
};