# Sports Prediction Backend

This is a Node.js backend application for a sports prediction platform. It allows users to make predictions on sports games, and it simulates the progression of these games in real-time.

## Features

- User authentication (not implemented yet)
- Create, read, update, and delete predictions
- Real-time game simulation
- WebSocket support for real-time updates

## Technologies Used

- Node.js
- Express
- TypeScript
- MongoDB
- Socket.IO

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/sports-prediction-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd sports-prediction-backend
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## API Endpoints

### Predictions

- `POST /predictions`: Create a new prediction
- `GET /predictions`: Get all predictions for a user
- `DELETE /predictions/:id`: Delete a prediction by its ID

### Games

- `GET /games`: Get all games
- `GET /games/:id`: Get a specific game by its ID

## Real-time Updates

The application uses Socket.IO to provide real-time updates to clients. When a game state changes, all connected clients will receive an update.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
