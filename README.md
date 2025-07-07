# QA Pareto Visualizing Web App
## General Info
This project is a web app designed to display the QA inspection data from Coto Technology's database.
The web app connects to a local database using mysql2, then receives the status of each check from the database. The web app was designed with the user in mind.
## Features
- Receives information from a database
- Use from any device in the local network
- Utilizes a UI
## Technologies
Project is created with:
| Technology | Usage                    | Version     |
|------------|--------------------------|-------------|
| Node.js    | Backend runtime          | `v22.16.0`  |
| Express    | Web framework            | `v5.1.0`    |
| MySQL      | Database engine          | `v8.4.0`    |
| mysql2     | MySQL client for Node.js | `v3.x`      |
| HTML5      | Markup                   | N/A         |
| CSS3       | Styling                  | N/A         |
| JavaScript | Frontend scripting       | `ES6+`      |
| npm        | Package manager          | `v10.x`     |
| Git        | Version control          | latest      |
## Installation/Setup
### Web App
1. Download the zip from the green button that says code.
2. Extract its contents.
3. Enter the root file (so that this README is visible) and enter the terminal.
#### To Run Local Instance
Run these commands in your terminal to ensure you have the correct tools installed.
```
npm -v
node -v
```
If you don't, [install them from the official website.](https://nodejs.org/en/download)
Then run these commands in sequence to run the app:
```
npm ci
node server.js
``` 
Now there is a local instance of the app running on your machine. If the host machine does not have a firewall restriction on the host port (e.g. 80, 3000, 8080, or whichever you decide), then any machine connected to the same local network will be able to access the web app.
4. Configure a custom password in password.js. The default is 'password'.
5. Find the IP address of the host machine.
Enter this command into Command Prompt:
```
ipconfig /all
```
Look for a line similar to this:
```
IPv4 Address. . . . . . . . . . . : 192.168.X.X
```
By writing this IP address and the host port into the address bar of a browser (e.g ```192.168.1.130:3000```), then any machine on the local network can connect to the local webapp.
