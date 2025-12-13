# MongoDB Atlas Connection Setup

This guide explains how to connect to MongoDB Atlas from the VS Code MongoDB Playground.

## Prerequisites

- MongoDB VS Code Extension installed
- X.509 certificate file downloaded from Atlas
- Certificate file saved to a secure location on your local machine

## Getting Your Connection Details

### 1. Download X.509 Certificate

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to **Database Access** → **Database Users**
3. Find or create a user with X.509 authentication
4. Download the X.509 certificate file (`.pem` format)
5. Save it to a secure location (e.g., `~/Downloads/` or `~/.mongodb/`)

### 2. Get Your Connection String

1. In Atlas, go to **Database** → **Connect**
2. Select **Connect your application**
3. Choose **X.509** as the authentication method
4. Copy the connection string template

## Connection Methods

### Method 1: Connect from Playground (Recommended)

1. Open the playground file: `playground-1.mongodb.js`
2. If not connected, you'll see "Click here to add connection" at the top
3. Click it and select "Add new connection"
4. Paste your connection string with the certificate path:
   ```
   mongodb://<username>@<cluster-endpoint>/?tls=true&tlsCAFile=<path-to-cert.pem>&tlsCertificateKeyFile=<path-to-cert.pem>
   ```
   **Note:** Replace:
   - `<username>` with your Atlas database username
   - `<cluster-endpoint>` with your Atlas cluster endpoint
   - `<path-to-cert.pem>` with the full path to your certificate file
5. Press Enter to connect

### Method 2: Connect via Command Palette

1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
2. Type "MongoDB: Connect to MongoDB"
3. Select the command
4. Paste your connection string when prompted

### Method 3: Use Connection Manager

1. Open VS Code Command Palette (`Ctrl+Shift+P`)
2. Run "MongoDB: Open Overview Page"
3. Click "Add Connection"
4. Enter your connection string

## Connection String Format

For X.509 authentication, your connection string should follow this format:

```
mongodb://<username>@<cluster-endpoint>/?tls=true&tlsCAFile=<cert-path>&tlsCertificateKeyFile=<cert-path>
```

**Example (Windows):**
```
mongodb://vscode@cluster0.xxxxx.mongodb.net/?tls=true&tlsCAFile=C%3A%5CUsers%5CYourName%5CDownloads%5Ccert.pem&tlsCertificateKeyFile=C%3A%5CUsers%5CYourName%5CDownloads%5Ccert.pem
```

**Example (macOS/Linux):**
```
mongodb://vscode@cluster0.xxxxx.mongodb.net/?tls=true&tlsCAFile=%2FUsers%2FYourName%2FDownloads%2Fcert.pem&tlsCertificateKeyFile=%2FUsers%2FYourName%2FDownloads%2Fcert.pem
```

**Important:** 
- Paths in connection strings must be URL-encoded
- Windows paths: `C:\Users\...` becomes `C%3A%5CUsers%5C...`
- Unix paths: `/Users/...` becomes `%2FUsers%2F...`

## Troubleshooting

### Certificate File Not Found

If you get an error about the certificate file:
1. Verify the file exists at the specified path
2. Check file permissions (should be readable)
3. Try using forward slashes in the path (works on Windows too)
4. Ensure the path is URL-encoded in the connection string

### Connection Timeout

- Check your network connection
- Verify IP whitelist in Atlas (if enabled)
- Ensure the certificate hasn't expired
- Verify the cluster endpoint is correct

### Authentication Failed

- Verify the certificate matches the Atlas database user
- Check that the certificate file is not corrupted
- Re-download the certificate from Atlas if needed
- Ensure the username in the connection string matches the Atlas user

### Path Encoding Issues

If you're having trouble with path encoding:
- Use a URL encoder tool to encode your certificate path
- Or use the MongoDB VS Code extension's connection wizard which handles encoding automatically

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

## Security Best Practices

- **Never commit certificate files to version control**
- Store certificates in a secure location outside the project directory
- Use environment variables for connection strings in production
- Rotate certificates regularly
- Use separate certificates for different environments (dev/staging/prod)

## Additional Resources

- [MongoDB Playgrounds Documentation](https://www.mongodb.com/docs/mongodb-vscode/playgrounds/)
- [MongoDB VS Code Extension](https://www.mongodb.com/docs/mongodb-vscode/)
- [Atlas Connection Strings](https://www.mongodb.com/docs/atlas/connection-string/)
- [X.509 Certificate Authentication](https://www.mongodb.com/docs/manual/core/security-x.509/)
