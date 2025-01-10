document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchButton').addEventListener('click', function() {
        const songTitle = document.getElementById('songInput').value;
        if (songTitle) {
            searchSong(songTitle);
        } else {
            alert('Per favore, inserisci il titolo di una canzone.');
        }
    });

    function searchSong(songTitle) {
        const url = `https://api.deezer.com/search?q=${encodeURIComponent(songTitle)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => displayResults(data))
            .catch(error => {
                console.error('Errore durante la ricerca della canzone:', error);
                alert('Si è verificato un errore, per favore riprova.');
            });
    }

    function displayResults(data) {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) {
            console.error('L\'elemento #results non è stato trovato nel DOM.');
            return;
        }

        resultsDiv.innerHTML = ''; 

        if (data.data.length === 0) {
            resultsDiv.innerHTML = 'Nessun risultato trovato.';
            return;
        }

        data.data.forEach(track => {
            const trackElement = document.createElement('div');
            trackElement.classList.add('track-result');

            trackElement.innerHTML = `
                <h3>${track.title}</h3>
                <p>Artista: ${track.artist.name}</p>
                <a href="${track.link}" target="_blank">Ascolta su Deezer</a>
                <br><br>
            `;

            resultsDiv.appendChild(trackElement);
        });
    }
});
