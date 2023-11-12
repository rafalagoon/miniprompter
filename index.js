#!/usr/bin/node

const http = require("http");
const path = require("path");
const fs = require("fs");

const { WebSocketServer } = require("ws");

const PORT = 3330;

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
}).listen(PORT);


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
			console.log("Client");
			if (message.action == "connect"){
				client_conn = conn;
				return;
			}

			if (message.msg != null)
				console.log("Client: "+message.msg);

			prompt_conn.send(data);
		}
		else if (message.id == "prompter"){
			console.log("Prompter");
			if (message.action == "connect"){
				prompt_conn = conn;
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
