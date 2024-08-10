// Create a new div to hold the terminal
var terminalDiv = document.createElement('div');
terminalDiv.id = 'terminal';
terminalDiv.style.width = '100%';
terminalDiv.style.height = '500px';
terminalDiv.style.backgroundColor = 'black';
terminalDiv.style.color = 'white';
terminalDiv.innerHTML = `
    <div id="output"></div>
    <div id="input-line">
        <span id="prompt">> </span>
        <input id="command" style="background: transparent; border: none; color: white; outline: none;" />
    </div>
`;

// Append the terminal div to the body or another element
document.body.appendChild(terminalDiv);

// Load and run the WebSocket code to make the terminal functional
var script = document.createElement('script');
script.src = "https://cdn.socket.io/4.0.1/socket.io.min.js";
script.onload = function() {
    const socket = io();
    const terminal = document.getElementById('terminal');
    const outputDiv = document.getElementById('output');
    const commandInput = document.getElementById('command');

    function appendOutput(text) {
        outputDiv.innerHTML += text + '<br/>';
        terminal.scrollTop = terminal.scrollHeight;
    }

    commandInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = commandInput.value.trim();
            if (command) {
                socket.emit('execute_command', { command: command });
                appendOutput(`> ${command}`);
                commandInput.value = ''; 
            }
        }
    });

    socket.on('command_output', function(data) {
        appendOutput(data.output.replace(/\n/g, '<br/>'));
    });
};

document.body.appendChild(script);
