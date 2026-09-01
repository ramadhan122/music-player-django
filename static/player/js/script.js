    // KODE BACKEND ASLI - TETAP DIPERTAHANKAN

    let currentIndex = 0;
    let isPlaying = false;
    let lrcData = [];

    // VARIABEL BARU HANYA UNTUK VISUALIZER
    let audioContext;
    let analyser;
    let source;
    let dataArray;
    let bars = [];

    const audio = document.getElementById("audio");
    const title = document.getElementById("title");
    const artist = document.getElementById("artist");
    const cover = document.getElementById("cover");
    const playBtn = document.getElementById("playBtn");
    const progress = document.getElementById("progress");
    const progressContainer = document.getElementById("progressContainer");
    const currentTimeEl = document.getElementById("currentTime");
    const durationEl = document.getElementById("duration");
    const volumeSlider = document.getElementById("volumeSlider");
    const lyricsEl = document.getElementById("lyrics");
    const songListEl = document.getElementById("songList");
    const visualizer = document.getElementById("visualizer");

    // FUNGSI BARU HANYA UNTUK VISUALIZER
    function initVisualizer() {
        // Create 100 bars
        for (let i = 0; i < 100; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = '3px';
            visualizer.appendChild(bar);
            bars.push(bar);
        }

        // Setup Web Audio API (opsional, jika tidak bisa akan fallback)
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            
            const bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            if (!source && audio) {
                source = audioContext.createMediaElementSource(audio);
                source.connect(analyser);
                analyser.connect(audioContext.destination);
            }
        } catch (e) {
            console.log('Web Audio API not supported, using fallback animation');
        }
    }

    function updateVisualizer() {
        if (!bars.length) return;
        
        if (analyser && dataArray) {
            // Real audio analysis
            analyser.getByteFrequencyData(dataArray);
            for (let i = 0; i < bars.length && i < dataArray.length; i++) {
                const barHeight = (dataArray[i] / 255) * 60 + 3;
                bars[i].style.height = barHeight + 'px';
            }
        } else {
            // Fallback simulation
            for (let i = 0; i < bars.length; i++) {
                const height = Math.random() * 50 + 3;
                bars[i].style.height = height + 'px';
            }
        }
        
        if (isPlaying) {
            requestAnimationFrame(updateVisualizer);
        }
    }

    // SEMUA FUNGSI ASLI - TIDAK DIUBAH
    function formatTime(s) {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, "0")}`;
    }

    function parseLRC(lrcText) {
        const lines = lrcText.split(/\r?\n/);
        const result = [];
        const regex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)/;
        lines.forEach(line => {
            const match = regex.exec(line);
            if (match) {
                const min = parseInt(match[1]);
                const sec = parseInt(match[2]);
                const ms = match[3] ? parseInt(match[3].padEnd(3, '0')) : 0;
                const time = min * 60 + sec + ms / 1000;
                const text = match[4].trim();
                if (text) result.push({ time, text });
            }
        });
        return result;
    }

    function renderLyrics(song) {
        lyricsEl.innerHTML = "";
        lyricsEl.classList.remove("empty");
        lrcData = [];

        if (song.lrc) {
            lrcData = parseLRC(song.lrc);
            if (lrcData.length === 0) {
                lyricsEl.textContent = "No lyrics available.";
                lyricsEl.classList.add("empty");
            } else {
                lrcData.forEach((line, i) => {
                    const div = document.createElement("div");
                    div.className = "lyric-line";
                    div.dataset.index = i;
                    div.textContent = line.text;
                    lyricsEl.appendChild(div);
                });
            }
        } else if (song.lyric) {
            const lines = song.lyric.split(/<br\s*\/?>|\n/);
            lines.forEach(line => {
                const div = document.createElement("div");
                div.className = "lyric-line";
                div.textContent = line;
                lyricsEl.appendChild(div);
            });
        } else {
            lyricsEl.textContent = "No lyrics available.";
            lyricsEl.classList.add("empty");
        }
    }

    function highlightLyrics(currentTime) {
        if (lrcData.length === 0) return;
        let idx = lrcData.findIndex((l, i) =>
            currentTime >= l.time && (i === lrcData.length - 1 || currentTime < lrcData[i+1].time)
        );
        if (idx === -1) idx = 0;
        [...lyricsEl.children].forEach((line, i) => {
            line.classList.toggle("active", i === idx);
        });

        const activeLine = lyricsEl.querySelector(".active");
        if (activeLine) {
            const offset = activeLine.offsetTop - lyricsEl.clientHeight / 2 + activeLine.clientHeight / 2;
            lyricsEl.scrollTo({ top: offset, behavior: "smooth" });
        }
    }

    function updatePlaylistHighlight() {
        const songItems = document.querySelectorAll('.song-item');
        songItems.forEach((item, i) => {
            item.classList.toggle('active', i === currentIndex);
        });
    }

    function loadSong(index) {
        const song = songs[index];
        title.textContent = song.title;
        artist.textContent = song.artist;
        cover.src = song.cover;
        audio.src = song.file;
        renderLyrics(song);
        currentIndex = index;
        updatePlaylistHighlight();
    }

    function selectSong(index) {
        if (index === currentIndex && isPlaying) {
            audio.pause();
        } else {
            loadSong(index);
            audio.play().catch(console.error);
        }
    }

    function togglePlay() {
        if (isPlaying) { 
            audio.pause(); 
        } else { 
            audio.play().catch(console.error); 
        }
    }

    function nextSong() {
        currentIndex = (currentIndex + 1) % songs.length;
        loadSong(currentIndex);
        audio.play().catch(console.error); // langsung play tanpa cek isPlaying
    }

    function prevSong() {
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
        loadSong(currentIndex);
        audio.play().catch(console.error);
    }


    // Event listeners - ASLI + SEDIKIT TAMBAHAN UNTUK VISUALIZER
    audio.addEventListener("timeupdate", () => {
        if (!audio.duration) return;
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percent + "%";
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
        highlightLyrics(audio.currentTime);
    });

    audio.addEventListener("loadedmetadata", () => {
        const durationElement = document.getElementById(`duration-${currentIndex}`);
        if (durationElement && audio.duration) {
            durationElement.textContent = formatTime(audio.duration);
        }
    });

    audio.addEventListener("play", () => { 
        isPlaying = true; 
        playBtn.textContent = "⏸"; 
        cover.style.animationPlayState = "running"; 
        
        // Start visualizer
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        updateVisualizer();
    });

    audio.addEventListener("pause", () => { 
        isPlaying = false; 
        playBtn.textContent = "▶"; 
        cover.style.animationPlayState = "paused"; 
    });

    audio.addEventListener("ended", nextSong);

    progressContainer.addEventListener("click", (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        audio.currentTime = (clickX / width) * audio.duration;
    });

    volumeSlider.addEventListener("input", () => {
        audio.volume = volumeSlider.value / 100;
    });

    // Load durations for all songs - ASLI
    function loadAllDurations() {
        songs.forEach((song, index) => {
            const tempAudio = new Audio(song.file);
            tempAudio.addEventListener('loadedmetadata', () => {
                const durationElement = document.getElementById(`duration-${index}`);
                if (durationElement) {
                    durationElement.textContent = formatTime(tempAudio.duration);
                }
            });
        });
    }

    function init() {
        audio.volume = volumeSlider.value / 100;
        loadSong(0);
        loadAllDurations();
        initVisualizer(); // HANYA INI YANG DITAMBAHKAN
    }
    
    init();