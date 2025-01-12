document.addEventListener('DOMContentLoaded', function () {
    let audio = null;
    let isPlaying = false;

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
            .then(data => {
                displayResults(data);
                searchArtists(songTitle);
            })
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

            const playButton = document.createElement('button');
            playButton.classList.add('play-button');
            playButton.innerText = 'Ascolta';
            playButton.addEventListener('click', function() {
                if (isPlaying) {
                    audio.pause();
                    playButton.innerText = 'Ascolta';
                    isPlaying = false;
                } else {
                    if (audio === null || audio.src !== track.preview) {
                        audio = new Audio(track.preview);
                        audio.play();
                        audio.ontimeupdate = function() {
                            const progressBar = trackElement.querySelector('.track-progress-bar');
                            const currentTimeLabel = trackElement.querySelector('.current-time');
                            const totalTimeLabel = trackElement.querySelector('.total-time');
                            const currentTime = audio.currentTime;

                            totalTimeLabel.innerHTML = formatTime(track.duration);

                            const progressValue = (currentTime / track.duration) * 100;
                            progressBar.value = progressValue;
                            currentTimeLabel.innerHTML = formatTime(currentTime);
                        };
                    } else {
                        audio.play();
                    }
                    playButton.innerText = 'Pausa';
                    isPlaying = true;
                }
            });

            const durationDiv = document.createElement('div');
            durationDiv.classList.add('track-duration');
            durationDiv.style.display = 'flex';
            durationDiv.style.alignItems = 'center';

            const currentTimeLabel = document.createElement('span');
            currentTimeLabel.classList.add('current-time');
            currentTimeLabel.innerHTML = '0:00';
            currentTimeLabel.style.marginRight = '10px';

            const progressBar = document.createElement('progress');
            progressBar.classList.add('track-progress-bar');
            progressBar.max = 100;
            progressBar.value = 0;
            progressBar.style.width = '80%';

            const totalTimeLabel = document.createElement('span');
            totalTimeLabel.classList.add('total-time');
            totalTimeLabel.innerHTML = formatTime(track.duration);
            totalTimeLabel.style.marginLeft = '10px';

            durationDiv.appendChild(currentTimeLabel);
            durationDiv.appendChild(progressBar);
            durationDiv.appendChild(totalTimeLabel);

            const linkDiv = document.createElement('div');
            linkDiv.classList.add('track-link');
            linkDiv.innerHTML = `<a href="${track.link}" target="_blank">Ascolta su Deezer</a>`;

            textDiv.appendChild(titleDiv);
            textDiv.appendChild(artistDiv);
            textDiv.appendChild(playButton);
            textDiv.appendChild(durationDiv);
            textDiv.appendChild(linkDiv);
            trackElement.appendChild(imgDiv);
            trackElement.appendChild(textDiv);
            resultsDiv.appendChild(trackElement);
        });
    }

    function searchArtists(songTitle) {
        const url = `https://api.deezer.com/search/artist?q=${encodeURIComponent(songTitle)}`;

        fetch(url)
            .then(response => response.json())
            .then(data => displayArtists(data))
            .catch(error => {
                console.error('Errore durante la ricerca degli artisti:', error);
                alert('Si è verificato un errore, per favore riprova.');
            });
    }

    function displayArtists(data) {
        const artistsDiv = document.getElementById('artists');
        if (!artistsDiv) {
            console.error('L\'elemento #artists non è stato trovato nel DOM.');
            return;
        }
        artistsDiv.innerHTML = '';

        if (data.data.length === 0) {
            artistsDiv.innerHTML = 'Nessun artista trovato con questo nome.';
            return;
        }

        const artistList = document.createElement('div');
        artistList.classList.add('artist-list');
        artistList.style.display = 'flex';
        artistList.style.flexWrap = 'wrap';
        artistList.style.marginTop = '20px';

        data.data.forEach(artist => {
            const artistItem = document.createElement('div');
            artistItem.classList.add('artist-item');
            artistItem.style.marginRight = '20px';
            artistItem.style.width = '150px';

            const artistImage = document.createElement('img');
            artistImage.src = artist.picture_medium;
            artistImage.alt = `${artist.name} profile image`;
            artistImage.style.width = '100%';

            const artistName = document.createElement('h4');
            artistName.innerHTML = artist.name;

            const fans = document.createElement('p');
            const fanCount = artist.fan ? artist.fan : 'N/A';
            fans.innerHTML = `Fan: ${fanCount}`;

            const artistLink = document.createElement('a');
            artistLink.href = artist.link;
            artistLink.target = "_blank";
            artistLink.innerHTML = 'Visita profilo';

            artistItem.appendChild(artistImage);
            artistItem.appendChild(artistName);
            artistItem.appendChild(fans);
            artistItem.appendChild(artistLink);

            artistList.appendChild(artistItem);
        });

        artistsDiv.appendChild(artistList);
    }
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}
