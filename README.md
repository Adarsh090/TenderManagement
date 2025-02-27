# Tender Management System

A full-stack application built with React Native (Expo) and Firebase. This project implements a Tender Management System that consists of an Admin Panel, User View, and Bids Management, allowing for creation, viewing, bidding, and management of tenders with real-time notifications and extended functionality.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Requirements](#requirements)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Running the App](#running-the-app)
- [Building the APK](#building-the-apk)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview

This application is designed for managing tenders. Admin users can create new tenders by entering details such as tender name, description, start time, end time, buffer time, and more. Regular users can view available tenders, submit quotations, and receive notifications (e.g., when a tender is nearing its end). The Bids Management screen displays all bids in ascending order by cost and flags those submitted in the last 5 minutes before the tender end time.

## Features

- **Admin Panel**
  - Create new tenders with details:
    - Tender Name
    - Tender Description
    - Tender Start Time
    - Tender End Time
    - Buffer Time (to extend the tender end time)
  - View and manage all previous tenders
  - Edit and delete existing tenders

- **User View**
  - View all available tenders
  - Filter tenders by state, published date, and tender value
  - Submit quotations for tenders
  - Get notifications when a tender is placed in the last 5 minutes or when a new tender is available
  - See a checkmark icon on tenders for which a bid has been submitted

- **Bids Management**
  - Display all bids submitted by users
  - Bids are shown in ascending order of the bid cost
  - Display bid details (Company Name, Bid Time, Bid Cost)
  - Flag bids placed in the last 5 minutes before the tender end time
  - Ability to delete bids

- **Additional Functionalities**
  - Automatically extend tender end time by the buffer time if a bid is placed in the last 5 minutes
  - Real-time notifications for tender status updates

## Requirements

- React Native (Expo Managed Workflow)
- Firebase Firestore (for real-time database functionality)
- Node.js and npm/yarn
- Android Studio (for building APK) or Expo CLI for development

## Technologies Used

- **Front-end:** React Native, Expo, React Navigation, React Native Paper, React Native Reanimated
- **Back-end:** Firebase Firestore
- **Build Tools:** EAS Build (Expo Application Services), Gradle (for native builds)
- **Other:** AsyncStorage for local notification persistence, Moment.js for date/time manipulation

## Setup and Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/tendermanagementapp.git
   cd tendermanagementapp
Install Dependencies
npm install
# or
yarn install
Firebase Configuration

Create a new project in the Firebase Console.
Enable Firestore in your Firebase project.
Copy your Firebase configuration and create a file named firebaseConfig.js in the project root:

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
Replace the placeholder values with your actual Firebase project details.
Expo Configuration

Ensure your app.json (or app.config.js) includes the proper fields. For example:
{
  "expo": {
    "name": "TenderManagementApp",
    "slug": "tendermanagementapp",
    "version": "1.0.0",
    "sdkVersion": "48.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android"],
    "android": {
      "package": "com.yourcompany.tendermanagementapp"
    },
    "extra": {
      "eas": {
        "projectId": "YOUR_PROJECT_ID"
      }
    }
  }
}
Running the App
Using Expo (Development Mode)
Start the Metro Bundler
expo start
Open the App
On Android, press "a" to open the Android emulator (or scan the QR code using Expo Go).
On iOS, press "i" to open the iOS simulator.
Using React Native CLI (if not using Expo)
Start Metro Bundler
npx react-native start
Run on Android
npx react-native run-android
