# Task Manager

This is a Task Manager application built using Next.js v15 and tRPC, exposing the backend on the same port. This document deatils some of the features developed and the decisions I made during the build process.

## How to run the project

1. Clone the project repository by runnig:

```
git clone git@github.com:RodrigoTRS/task-manager.git
```

2. Install dependencies by running:

```
npm install
```

3. Run the application locally by running:

```
npm run dev
```

## Extra

How to build the application:

```
npm run build
```

How to run the build:

```
npm run start
```

## Decisions

- <b>Tasks stores in a local file:</b> Instead of relying on an in-memory array, I opted to persist tasks in a local file. This approach avoids losing data on server restarts, which helps during development to test infinite scroll, and enables server-side revalidation, which wouldn’t be possible if the data existed only in memory.
- <b>Hybrid Server/Client tasks fetch:</b> On initial page load, the interface is server-side rendered with 8 tasks, which is enough to fill the desktop screen. For additional tasks, I implemented infinite scroll using the react-intersection-observer library, which detects when the user scrolls to the bottom of the page and triggers client-side fetches to load more tasks dynamically.

## Backend-Routes

| Route          | Method | Url                   | Query                          | Body (JSON)                             | Status Code | Return on success | Observations                                              |
| -------------- | ------ | --------------------- | ------------------------------ | --------------------------------------- | ----------- | ----------------- | --------------------------------------------------------- |
| Get tasks      | GET    | /api/trpc/getTasks    | N/A                            | N/A                                     | 200         | tasks: Task[]     |                                                           |
| Get task by ID | GET    | /api/trpc/getTaskById | batch: 1, input: {"0": {{id}}} | N/A                                     | 200/404     | task: Task        | Returns 404 error if an invalid ID is passed as parameter |
| Add task       | POST   | /api/trpc/addTask     | N/A                            | { title: string; description: string; } | 200/400     | id: string        | Returns 400 if any of the inputs is missing               |
| Update task    | POST   | /api/trpc/updateTask  | N/A                            | { title: string; description: string; } | 200/404     | id: string        | Returns 404 error if an invalid ID is passed as parameter |
| Delete task    | POST   | /api/trpc/deleteTask  | N/A                            | id: string                              | 200/404     | id: string        | Returns 404 error if an invalid ID is passed as parameter |
