# MongoDB Atlas Connection Setup

This guide explains how to connect to MongoDB Atlas from the VS Code MongoDB Playground.

## Prerequisites

- MongoDB VS Code Extension installed
- X.509 certificate file downloaded from Atlas
- Certificate file located at: `C:\Users\jswil\Downloads\X509-cert-1253989881055617180.pem`

## Connection Methods

### Method 1: Connect from Playground (Recommended)

1. Open the playground file: `playground-1.mongodb.js`
2. If not connected, you'll see "Click here to add connection" at the top
3. Click it and select "Add new connection"
4. Paste the connection string:
   ```
   mongodb://vscode@atlas-sql-691d75a0ab43cb5ef6bf1970-tdodph.a.query.mongodb.net/?tls=true&tlsCAFile=c%3A%5CUsers%5Cjswil%5CDownloads%5CX509-cert-1253989881055617180.pem&tlsCertificateKeyFile=c%3A%5CUsers%5Cjswil%5CDownloads%5CX509-cert-1253989881055617180.pem
   ```
5. Press Enter to connect

### Method 2: Connect via Command Palette

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
2. Type "MongoDB: Connect to MongoDB"
3. Select the command
4. Paste the connection string when prompted

### Method 3: Use Connection Manager

1. Open VS Code Command Palette (`Ctrl+Shift+P`)
2. Run "MongoDB: Open Overview Page"
3. Click "Add Connection"
4. Enter the connection string

## Connection String Details

**Host:** `atlas-sql-691d75a0ab43cb5ef6bf1970-tdodph.a.query.mongodb.net`  
**Username:** `vscode`  
**Authentication:** X.509 Certificate  
**Certificate File:** `C:\Users\jswil\Downloads\X509-cert-1253989881055617180.pem`  
**TLS:** Enabled

## Troubleshooting

### Certificate File Not Found

If you get an error about the certificate file:
1. Verify the file exists at: `C:\Users\jswil\Downloads\X509-cert-1253989881055617180.pem`
2. Check file permissions (should be readable)
3. Try using forward slashes in the path: `C:/Users/jswil/Downloads/X509-cert-1253989881055617180.pem`

### Connection Timeout

- Check your network connection
- Verify IP whitelist in Atlas (if enabled)
- Ensure the certificate hasn't expired

### Authentication Failed

- Verify the certificate matches the Atlas user
- Check that the certificate file is not corrupted
- Re-download the certificate from Atlas if needed

## Running the Playground

Once connected:

1. Click the **Play** button (▶) in VS Code's top navigation bar
2. Or use the keyboard shortcut (if configured)
3. Results will appear in the right-side pane

## Database Selection

The playground is configured to use the `app` database by default. To switch databases, modify:

```javascript
const database = 'your_database_name';
use(database);
```

## Additional Resources

- [MongoDB Playgrounds Documentation](https://www.mongodb.com/docs/mongodb-vscode/playgrounds/)
- [MongoDB VS Code Extension](https://www.mongodb.com/docs/mongodb-vscode/)
- [Atlas Connection Strings](https://www.mongodb.com/docs/atlas/connection-string/)

