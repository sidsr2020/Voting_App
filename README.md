# Voting Application

This is a backend application for a voting system where users can vote for electors. It provides functionalities for user authentication, elector management, and voting.

## Features

- User sign up and login with Aadhar Card Number and password
- User can view the list of electors
- User can vote for an elector (only once)
- Admin can manage electors (add, update, delete)
- Admin cannot vote

## Technologies Used

- Node.js
- Express.js
- MongoDB
- JSON Web Tokens (JWT) for authentication

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sidsr2020/Voting_App.git


# API Endpoints

## Authentication

### Sign Up
- `POST /signup`: Sign up a user

### Login
- `POST /login`: Login a user

## electors

### Get Electors
- `GET /electors`: Get the list of electors

### Add Elector
- `POST /electors`: Add a new elector (Admin only)

### Update Elector
- `PUT /electors/:id`: Update an elector by ID (Admin only)

### Delete Elector
- `DELETE /electors/:id`: Delete an elector by ID (Admin only)

## Voting

### Get Vote Count
- `GET /electors/vote/count`: Get the count of votes for each elector

### Vote for Elector
- `POST /electors/vote/:id`: Vote for an elector (User only)

## User Profile

### Get Profile
- `GET /users/profile`: Get user profile information

### Change Password
- `PUT /users/profile/password`: Change user password
