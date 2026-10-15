# Susu Group Tracker

A command-line program that manages a rotating savings group (Susu). Members contribute a fixed amount each week, and the entire pot is paid out to one member per week in the order they joined.

## Features

- Create a Susu group with a fixed weekly contribution amount.
- Add members to the group (locked once Week 1 begins).
- Record payments from members (partial payments are allowed).
- Close a week — only pays out if everyone has paid in full.
- View a report of the current week, payment status, and payout history.

## Installation

1. Ensure you have Node.js installed.
2. Clone this repository.
3. Navigate to the project folder.
4. Install dependencies:

npm install

## How to Run the Program

node index.js

## How to Run the Tests

npm test

## Project Structure

- src/Member.js — Represents a single member in the Susu.
- src/Group.js — The main logic that manages the group, payments, and payouts.
- index.js — The CLI entry point (in progress).
- tests/ — Automated tests (in progress).
- NOTES.md — Design assumptions and decisions.

## Status

Status ✅ Complete. All 11 automated tests passing.
