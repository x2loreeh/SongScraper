document.addEventListener('DOMContentLoaded', function () {
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
            trackElement.style.display = 'flex';

            const imgDiv = document.createElement('div');
            imgDiv.classList.add('track-cover');
            const imgElement = document.createElement('img');
            imgElement.src = track.album.cover_medium;
            imgElement.alt = `${track.title} cover`;
            imgElement.style.width = '125px';
            imgDiv.appendChild(imgElement);
            const textDiv = document.createElement('div');
            textDiv.classList.add('track-text');
            textDiv.style.marginLeft = '15px';

            const titleDiv = document.createElement('div');
            titleDiv.classList.add('track-title');
            titleDiv.innerHTML = `<h3>${track.title}</h3>`;

            const artistDiv = document.createElement('div');
            artistDiv.classList.add('track-artist');
            artistDiv.innerHTML = `<p>Artista: ${track.artist.name}</p>`;

            const linkDiv = document.createElement('div');
            linkDiv.classList.add('track-link');
            linkDiv.innerHTML = `<a href="${track.link}" target="_blank">Ascolta su Deezer</a>`;

            textDiv.appendChild(titleDiv);
            textDiv.appendChild(artistDiv);
            textDiv.appendChild(linkDiv);
            trackElement.appendChild(imgDiv);
            trackElement.appendChild(textDiv);
            resultsDiv.appendChild(trackElement);
        });
    }
});
