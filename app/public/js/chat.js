const socket = io.connect('http://localhost:3000', {query: 'hello=world'});
socket.on('connect', () => {
    socket.emit('newUser', {apelido: $('#apelido').val(), id: $('#userId').val()});
});

socket.on('newMsgFromServer', data => {
    const html = 
        `<div class="dialogo py-3 px-4 my-2 border border-light rounded">
            <h2>@${data.apelido} - ID: ${data.id}</h2>
            <p class="lead ml-4">${data.mensagem}</p>
        </div>`;
    $('#dialogos').append(html);
    window.scroll(0, document.body.scrollHeight);
});

socket.on('newUserJoinedTheThread', data => {
    data.participantes.forEach(participante => {
        const html = `<p class="participante">
            <img src="images/ico_usuario.png">
            ${participante.apelido} - ID: ${participante.id}
        </p>`;
        $('#participantes').append(html);
    });
});

$('#sendMessageForm').submit(e => {
    e.preventDefault();
    socket.emit('newMsgFromClient', {id: $('#userId').val(), apelido: $('#apelido').val(), mensagem: $('#mensagem').val()});
    $('#mensagem').val('');
    $('#exibe_chat').click();
});