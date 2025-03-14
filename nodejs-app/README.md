# Node.js Application with Docker Integration

This project is a Node.js application that integrates with MongoDB and Redis for user management, points tracking, and purchases. It includes an automated points expiration system.

## Project Structure

TBD

## Setup Instructions

1. **Clone the repository:**

   ```
   git clone <repository-url>
   cd nodejs-app
   ```

2. **Build and run the application using Docker Compose:**

   ```
   docker-compose up -d
   ```

3. **Access the application:**
   The application will be running on `http://localhost:3000`.

   **_To fix issues with replica set:_**
   To access the Mongo db through the terminal: docker exec -it <containerid:2a0a88555f6e> mongosh (before use the docker ps command to get the mongo container id)

   run rs.initiate() manually to initiate the replicaSet

   // config the replicaSet to support the way you access it (mongo:27017 from the container and localhost:27017 from the host machine)

   // for Docker environment
   var config = rs.conf();
   // Modify the configuration as needed
   config.members[0].host = "mongo:27017";
   // Apply the new configuration
   rs.reconfig(config, { force: true });

   //
   // for local environment
   var config = rs.conf();
   // Modify the configuration as needed
   config.members[0].host = "localhost:27017";
   // Apply the new configuration
   rs.reconfig(config, { force: true });

   ** Run rs.status() to make sure the change was applied **

   also you should create a userdb database (Command: use userDb) in mongo in case it doesn't exist (or should implement it in the docker-compose file)

## API Endpoints

### User Management

- **POST /users**: Create a new user.
- **GET /users/:id**: Retrieve user information.

### Points Tracking

- **POST /points**: Add points to a user's balance.
- **DELETE /points/expire**: Expire points older than six weeks.

### Purchases

- **POST /purchase**: Deduct points from a user's balance for a purchase.
- **GET /purchases/:userId**: Retrieve purchase history for a user.

## Points Expiration

The application includes a service that automatically checks and expires points older than six weeks. This service can be scheduled to run at regular intervals.

## Dependencies

This project uses the following dependencies:

- Express
- Mongoose
- Redis
- Other necessary libraries for testing and development.

## Usage Examples

- To create a user, send a POST request to `/users` with the user data.
- To add points, send a POST request to `/points` with the user ID and points amount.
- To make a purchase, send a POST request to `/purchase` with the user ID and item details.

## License

This project is licensed under the MIT License.
