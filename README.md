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

## Candidates

### Get Candidates
- `GET /electors`: Get the list of candidates

### Add Candidate
- `POST /electors`: Add a new candidate (Admin only)

### Update Candidate
- `PUT /electors/:id`: Update a candidate by ID (Admin only)

### Delete Candidate
- `DELETE /electors/:id`: Delete a candidate by ID (Admin only)

## Voting

### Get Vote Count
- `GET /electors/vote/count`: Get the count of votes for each candidate
- `PUT /users/profile/password`: Change user password
