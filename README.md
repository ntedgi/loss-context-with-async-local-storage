# Loss of Context with AsyncLocalStorage
A practical guide to understanding and resolving issues with AsyncLocalStorage and async_hooks losing context in Node.js applications.

## Overview
This repository aims to provide practical examples and insights into scenarios where AsyncLocalStorage loses its context. It also highlights certain npm packages and practices that may disrupt the asynchronous promise chain, causing context-related issues.

## Objectives
Practical Examples: Demonstrate real-world examples of context loss using AsyncLocalStorage.
Identify Problematic Packages: Highlight npm packages and common patterns that can cause disruptions in the async chain.
Educate and Guide: Offer actionable solutions and best practices to maintain context integrity in Node.js applications.
Why This Matters
Maintaining context is crucial for features like request tracing, logging, and user session handling in modern web applications. Understanding how and why context loss occurs can save you from potential debugging nightmares and ensure smoother application performance.

## Known Issues with Async Context Propagation
When working with asynchronous code in Node.js, maintaining proper context (e.g., user data, transaction IDs, etc.) across asynchronous execution flows is critical for debugging, tracing, and other purposes. Libraries like AsyncLocalStorage from Node.js can help with this. However, certain packages might interfere with or fail to properly propagate asynchronous execution contexts.

## Examples:

## `mysql` Package (https://www.npmjs.com/package/mysql)

real world example https://github.com/ntedgi/loss-context-with-async-local-storage/tree/main/examples/mysql

The mysql package is a commonly used library for interacting with MySQL databases. However, it is known to break asynchronous context propagation in the following scenarios:

### Connection Pooling
When using connection pooling, mysql may reuse connections in a way that causes context loss across asynchronous boundaries.

### Callback Wrapping
Internally, mysql wraps callbacks in a way that detaches them from the original asynchronous context, leading to loss of context data.

### Event Emitters
The mysql package uses event emitters to handle connection and query events. These event handlers may not respect the parent asynchronous execution context.

## Workarounds
To ensure consistent context propagation while using the mysql package, consider the following options:

1. Switch to mysql2
The mysql2 library is a more modern and actively maintained alternative that offers better support for promises and context propagation.

2. Wrap with `AsyncResource`
If switching libraries is not an option, you can use Node.js’s AsyncResource API from the async_hooks module to manually manage context propagation.

```javascript
const { AsyncResource } = require('async_hooks');

const resource = new AsyncResource('mysql-query');
resource.runInAsyncScope(() => {
  connection.query('SELECT * FROM users', (err, results) => {
    // The context will now be preserved here.
  });
});
```

3. Use Middleware for Async Context Management
If using AsyncLocalStorage, ensure that it is properly initialized and wrapped around your mysql operations:

```javascript
const { AsyncLocalStorage } = require('node:async_hooks');
const storage = new AsyncLocalStorage();

storage.run(new Map(), () => {
  connection.query('SELECT * FROM users', (err, results) => {
    const context = storage.getStore();
    // Ensure the context is accessible here.
  });
});
```

