const http = require('http');
const { URLSearchParams } = require('url');

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/users')) {
    switch (req.method) {
      case 'GET':
        handleGetUsers(req, res);
        break;
      case 'POST':
        handleCreateUser(req, res);
        break;
      case 'PUT':
        handleUpdateUser(req, res);
        break;
      case 'DELETE':
        handleDeleteUser(req, res);
        break;
      default:
        res.statusCode = 405;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Method not allowed');
        break;
    }
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found');
  }
});

const users = [];

function handleGetUsers(req, res) {
  sendResponse(res, 200, users);
}

function handleCreateUser(req, res) {
  collectRequestData(req, (user) => {
    users.push(user);
    sendResponse(res, 201, { message: 'User created', user });
  });
}

function handleUpdateUser(req, res) {
  const userId = parseInt(req.url.split('/')[2]); // Extract the user ID from the URL

  collectRequestData(req, (updatedUser) => {
    const user = users.find((user) => user.id === userId);

    if (user) {
      user.name = updatedUser.name;
      sendResponse(res, 200, { message: `User with ID ${userId} updated`, user });
    } else {
      sendResponse(res, 404, { message: `User with ID ${userId} not found` });
    }
  });
}

function handleDeleteUser(req, res) {
  const userId = parseInt(req.url.split('/')[2]); // Extract the user ID from the URL

  const index = users.findIndex((user) => user.id === userId);

  if (index !== -1) {
    const deletedUser = users.splice(index, 1);
    sendResponse(res, 200, { message: `User with ID ${userId} deleted`, user: deletedUser[0] });
  } else {
    sendResponse(res, 404, { message: `User with ID ${userId} not found` });
  }
}

function sendResponse(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function collectRequestData(req, callback) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const params = new URLSearchParams(body);
    const user = Object.fromEntries(params);

    callback(user);
  });
}

server.listen(3000, () => {
  console.log('Server running on port 3000');
});