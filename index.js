#!/usr/bin/node

const http = require("http");
const path = require("path");
const fs = require("fs");
const os = require('os');

const { WebSocketServer } = require("ws");

const PORT = 3330;

let interfaces = os.networkInterfaces();
let addresses = [];
for (let i in interfaces) {
    for (let j in interfaces[i]) {
        let address = interfaces[i][j];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

if (addresses.length > 0){
	console.log("Your IP: "+addresses[0]);
}

const http_server = http.createServer((req, res) => {
	if (req.url == "/favicon.ico")
		return;
    
  let file_path = path.resolve(__dirname + "/public" + req.url);
    
    fs.exists(file_path, (exists) => {
        if(!exists) {
            res.statusCode = 404;
            res.end(`ERROR 404: File ${file_path} not found!`);
        }
        
        if(fs.statSync(file_path).isDirectory()) {
            file_path += "/index.html"
        }
        
        fs.readFile(file_path, (err, data) => {
            if(err) {
                res.statusCode = 500;
                res.end(`ERROR 500: Error getting the file: ${err}.`);
            } else {
                res.end(data);
            }
        });
    });
}).listen(PORT, function (){
	console.log("Listening port: "+PORT);
});


const ws_server = new WebSocketServer({ server: http_server });

let client_conn;
let prompt_conn;

ws_server.on("connection", function(conn) {
  console.log("Recieved a new connection.");

	conn.on("message", (data, binary) => {
		data = binary ? data : data.toString();

		let message = JSON.parse(data);
		
		if (message.id == null){
			console.log("Error: Message incomplete");
			return;
		}
		
		if (message.id == "client"){
			if (message.action == "connect"){
				console.log("Client connect");
				client_conn = conn;
				return;
			}

			if (message.msg != null)
				console.log("Client: "+message.msg);

			if (prompt_conn == null){
				console.log("Prompter not connected");
				return;
			}

			prompt_conn.send(data);
		}
		else if (message.id == "prompter"){
			if (message.action == "connect"){
				console.log("Prompter connect");
				prompt_conn = conn;
				return;
			}
			else if (message.action == "wake_lock"){
				console.log("Wake Lock:", message.message);
				return;
			}

			if (client_conn == null){
				console.log("Client not connected");
				return;
			}

			client_conn.send(data);
		}
  });

  conn.on("close", () => {
    console.log("Client disconnected");
  });

});


function prompt_actions (action)
{
	
}


function client_actions (action)
{
	
}
