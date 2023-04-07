import { Injectable } from '@angular/core';
import { WebSocket } from 'ws';

export default function webSocketServerListener(myPort:number) {
    const server = new WebSocket.Server({ port:myPort });
    console.log(`WebSocket server started on port ${myPort}`);
    server.on('connection', (socket: WebSocket) => {
      console.log('Client connected');

      socket.onmessage = (message) => {
        console.log(`Received message: ${message}`);
        alert('Message from client is ' + message);
        socket.send(`Server received message: ${message}`);
      };

      socket.onclose = () => {
        console.log('Client disconnected');
      };
    });

    server.close();
    console.log(`WebSocket server closed on port ${myPort}`);
  }
