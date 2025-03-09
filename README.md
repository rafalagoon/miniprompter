# Miniprompter

A Minimal Teleprompter

## Requirements

- NodeJS LTS (tested on 20.9.0, should work on any NodeJS)
- WebSocket support in the browser

## Instalation

1. Clone or download this repository
> $ git clone https://github.com/rafalagoon/miniprompter
2. Enter the repository directory
> $ cd miniprompter
3. Install the dependences
> $ node install
4. Execute the server
> $ node index.js
5. On the device that you are goint to use to control the prompter, open the web browser and write:
> http://SERVER_IP:SERVER_PORT
> 
> *SERVER_IP and SERVER_PORT (default 3330) are shown on the server console*
6. On the device that you are going to use as a prompter, open the web browser and write:
> http://SERVER_IP:SERVER_PORT/prompter.html

## How to use it