const socket = io.connect('http://localhost:3000', {query: 'hello=world'});
socket.emit('newUser', {apelido: $('#apelido').val()});

socket.on('newMsgFromServer', data => {
    const html = 
        `<div class="dialogo py-3 px-4 my-2 border border-light rounded">
            <h2>@${data.apelido}</h2>
            <p class="lead ml-4">${data.mensagem}</p>
        </div>`;
    $('#dialogos').append(html);
    window.scroll(0, document.body.scrollHeight);
});

socket.on('newUserJoinedTheThread', data => {
    data.apelido.forEach(apelido => {
        const html = `<p class="participante">
            <img src="images/ico_usuario.png">
            ${apelido}
        </p>`;
        $('#participantes').append(html);
    });
});

$('#sendMessageForm').submit(e => {
    e.preventDefault();
    socket.emit('newMsgFromClient', {apelido: $('#apelido').val(), mensagem: $('#mensagem').val()});
    $('#mensagem').val('');
    $('#exibe_chat').click();
});