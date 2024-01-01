# BE Technical Skill Test Project

## Overview
This project is developed as part of a BE technical skill test, showcasing proficiency in Nest.js, RESTful API development, and back-end best practices.

## Features
- Authentication and User Management.
- Profile Creation and Management.
- Real-time Room Management using WebSockets.

## Installation
```bash
$ npm install
```

## Running the App
```bash
$ npm run start
```

## Docker Setup

### Building the Docker Image
To build a Docker image of your application, use the following command:

```bash
docker build -t be-technical-test .
```

This command builds a Docker image named `be-technical-test` using the Dockerfile in your project's root directory.

### Running the App with Docker
Once the image is built, you can run your application using Docker:

```bash
docker run -d -p 3000:3000 --name be-app be-technical-test
```

This command runs the application in a detached mode, maps port 3000 of the container to port 3000 on the host, and names the container `be-app`.

## Running the App Locally
For local development, use the following commands as defined in your `package.json`:

```bash
# General start
$ npm run start

# Start specific modules in watch mode
$ npm run start:auth:dev
$ npm run start:message:dev
$ npm run start:profile:dev
$ npm run start:room:dev
```

## Testing
Run the automated tests with these commands:

```bash
$ npm test
$ npm run test:auth
$ npm run test:cov
```

## API Endpoints

### AuthController
- POST `/api/register` - Register a new user.
- POST `/api/login` - Log in a user.
- POST `/api/request-password-reset` - Request password reset.
- POST `/api/reset-password` - Reset password.
- POST `/api/refresh-token` - Refresh authentication token.
- POST `/api/sign-out` - Sign out the user.

### ProfileController
- POST `/api/createProfile` - Create a new user profile.
- GET `/api/getProfile` - Retrieve user profile.
- PUT `/api/updateProfile` - Update user profile.
- POST `/api/uploadProfilePicture` - Upload a profile picture.

### RoomController
- POST `/api/room` - Create a new room.
- GET `/api/room` - Get all rooms.
- GET `/api/room/:id` - Get a room by ID.
- PUT `/api/room/:id` - Update a room by ID.
- DELETE `/api/room/:id` - Delete a room by ID.

## Technical Highlights
- Explanation of architecture choices.
- Discussion of any challenging aspects and how they were addressed.
- Any specific patterns or practices employed.

## Testing
- Instructions on how to run tests.
- Brief overview of testing strategy.

## Future Enhancements
- Potential improvements or features that could be added.

## Contact
For inquiries related to this project, please contact me.

## License
[MIT](https://choosealicense.com/licenses/mit/)
