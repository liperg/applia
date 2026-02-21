# Dra Lia MVP Requirements

## 1. Product Overview

Dra Lia is a React Native + Expo mobile application for Android and iOS.
The app allows users to upload PDF files containing laboratory exam results.
Uploaded documents are processed and data is extracted using LLM/OpenAI.

## 2. MVP Scope

The MVP includes:
- Mobile authentication and onboarding flows.
- PDF upload for laboratory exam documents.
- Background processing pipeline for slow extraction tasks.
- Exam dashboard and exam list views.
- Backend-for-Frontend (BFF) API focused on mobile UI needs.

## 3. Functional Requirements

### 3.1 Platform and Technology

- **FR-001**: The mobile app MUST be implemented using React Native + Expo.
- **FR-002**: The mobile app MUST run on Android and iOS.

### 3.2 Authentication and Access

- **FR-003**: The app MUST provide a Login screen.
- **FR-004**: Authentication MUST use Firebase.
- **FR-005**: The Login flow MUST support Google social sign-in.
- **FR-006**: The app MUST provide a Signup screen.

### 3.3 Onboarding

- **FR-007**: The app MUST provide an onboarding experience explaining how the app works.

### 3.4 Navigation and Drawer

- **FR-008**: The app MUST provide Drawer-based navigation.
- **FR-009**: The Drawer MUST display user profile information and avatar.
- **FR-010**: The Drawer MUST provide an action to edit user information.
- **FR-011**: The Drawer MUST provide a Settings screen entry.
- **FR-012**: The Settings screen MUST be available and can be empty in the MVP.
- **FR-013**: The Drawer MUST provide a Logout action.
- **FR-014**: The app MUST provide side navigation icons using Phosphor Icons.

### 3.5 Home Dashboard

- **FR-015**: The Home screen MUST display a dashboard with relevant exams.
- **FR-016**: Relevant exams MUST include exams with out-of-range values.
- **FR-017**: Relevant exams MUST include exams marked by users as follow-up.

### 3.6 PDF Import

- **FR-018**: The app MUST provide a "+" action that navigates to a PDF import screen.
- **FR-019**: Users MUST be able to upload PDF files containing laboratory exam results.

### 3.7 Exams Screen

- **FR-020**: The app MUST provide an Exams screen listing uploaded documents.
- **FR-021**: Each listed document MUST show import/processing status.
- **FR-022**: The Exams screen MUST show the total item count for each exam document.
- **FR-023**: The Exams screen MUST show how many exam items require attention (out_of_range).

### 3.8 Document Processing

- **FR-024**: Uploaded PDF documents MUST be processed asynchronously in the background.
- **FR-025**: The extraction process MUST use LLM/OpenAI.

### 3.9 API Architecture

- **FR-026**: The backend API MUST be implemented as a BFF.
- **FR-027**: The BFF MUST prioritize response models optimized for mobile UI consumption.

## 4. Non-Functional Requirements

### 4.1 API Access Layer in Mobile App

- **NFR-001**: API access in the mobile app MUST be centralized in a single TypeScript file.
- **NFR-002**: This file MUST encapsulate all REST API communication logic.
- **NFR-003**: API calls MUST be performed through a client generated automatically from the backend OpenAPI documentation.

### 4.2 Delivery Strategy

- **NFR-004**: Frontend prototyping MUST be delivered first.
- **NFR-005**: During frontend-first delivery, the backend MAY return mocked data structures required by the mobile UI.

## 5. Assumptions

- PDF uploads target laboratory exam reports only for MVP.
- The first MVP release prioritizes import, extraction visibility, and actionable exam status over advanced customization.
- The Settings screen is intentionally empty in the first MVP iteration.

## 6. Out of Scope for MVP

- Advanced settings management.
- Multi-provider social login beyond Google.
- Complex analytics and historical trend modules.
