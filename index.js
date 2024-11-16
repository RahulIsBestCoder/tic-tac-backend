const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const port = 3000 || port + 1
const ip = '192.168.0.89'

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: `https://tic-tac-2024.netlify.app`, // Allow your React app's origin
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true // Allow credentials if needed
    }
});

let board = Array(9).fill(null);
let isXNext = true;

io.on('connection', (socket) => {
    console.log('A player connected');

    socket.emit('updateBoard', { board, isXNext });

    socket.on('makeMove', (index) => {
        if (!board[index] && !calculateWinner(board)) {
            board[index] = isXNext ? 'X' : 'O';
            isXNext = !isXNext;
            io.emit('updateBoard', { board, isXNext });

            const winner = calculateWinner(board);
            if (winner) {
                io.emit('gameOver', { winner });
            }
        }
    });

    socket.on('resetGame', () => {
        board = Array(9).fill(null);
        isXNext = true;
        io.emit('updateBoard', { board, isXNext });
    });
});

const calculateWinner = (squares) => {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
};

server.listen(port + 1, () => {
    console.log(`Server is running on port ${port + 1}`);
});