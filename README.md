# Express API Project

This README provides instructions on how to set up and run the Postgres Express API project.

## Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Setup Instructions

1. **Clone the Repository**  
    ```bash
    git clone https://github.com/Saad-Saheed/3mtt_cohort3.git
    cd backend/crud_with_postgres
    ```

2. **Install Dependencies**  
    Run the following command to install all required dependencies:  
    ```bash
    npm install
    ```


## Running the Project

1. **Start the Development Server**  
    Use the following command to start the server in development mode:  
    ```bash
    npm run dev
    ```
2. **Set the Database config in the .env and database.json file**
    Set the USERNAME, DATABASE_NAME, PASSWORD, USERNAME and PORT number then run this script to migrate tables
    ```bash
    npm run migrate
    ```

3. **Start the Production Server**  
    Build the project and start the server in production mode:  
    ```bash
    npm start
    ```

4. **Access the API**  
    Once the server is running, access the API at:  
    ```
    http://localhost:<PORT>/api
    ```

## Scripts

- `npm run dev` - Starts the server in development mode with hot-reloading.
- `npm start` - Starts the server in production mode.


## API Documentation
This project is built using Node.js (v14 or later). 
It includes an Express-based API for handling backend operations.

### Base URL
`http://<your-server-domain>/api`

### Endpoints

1. **GET /users**
    - Description: Retrieves data from the server.
    - Response: JSON object containing all users.

2. **POST /users**
    - Description: Sends data to the server.
    - Request Body: JSON object with the required fields (name, email, and age).
    - Response: JSON object confirming the operation.
    
3. **PUT /users/:id**
    - Description: Updates data on the server for a specific user.
    - Parameters: `id` (Path parameter - ID of the user to update).
    - Request Body: JSON object with updated fields (e.g email, name, or age).
    - Response: JSON object confirming the update.

4. **DELETE /users/:id**
    - Description: Deletes a specific user from the server.
    - Parameters: `id` (Path parameter - ID of the specific user to delete).
    - Response: JSON object confirming the deletion.
    

5. **GET /users/:id**
    - Description: gate data on the server for a user resource.
    - Parameters: `id` (Path parameter - ID of the user to update).
    - Response: JSON object confirming the fetch operation.
   
### Prerequisites
- Ensure Node.js (v14 or later) is installed on your system.
- Install project dependencies using `npm install`.

### Usage
- Start the server using `npm start` or `node server.js`.
- Access the API endpoints via the base URL.

For further details, refer to the source code or contact the project maintainer.

## Authors
- Saad Saheed

## Contributing

Feel free to fork this repository and submit pull requests for improvements.

## License

This project is licensed under the [ISC License](LICENSE).
