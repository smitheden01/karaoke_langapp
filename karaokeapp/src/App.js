import React, { useState, useEffect } from "react";
import { Howl } from "howler";
import "./App.css";

// Web Speech API setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

// Function to remove accents
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Removes accents
};

// Songs Data (Spanish & French)
const songs = {
  spanish: {
    title: "La Fuerte (Shakira)",
    lyrics: [
      { time: 2, text: "Olvidarte yo trato, pero a esta loba le da el arrebato" },
      { time: 6, text: "Yo con él paso el rato y luego a tu nombre solita me mato" },
      { time: 10, text: "Me siento como leona enjaula, cuesta tanto quedarme calla" },
      { time: 14, text: "Me tienes con la cabeza raya, con la cabeza raya" }
    ],
    audio: "/ShakiraTrimmed.mp3",
    language: "es-ES"
  },
  french: {
    title: "Ya Habibi",
    lyrics: [
      { time: 2, text: "Ya habibi, ya habibi, tu es tombé comme la pluie" },
      { time: 6, text: "T'as déboulé dans ma petite vie, dans ma ville comme un ovni" },
      { time: 10, text: "Puis t'es parti comme le jour qui laisse place à la nuit" },
      { time: 14, text: "Et quand t'es parti, ton absence a laissé place à l'ennui" }
    ],
    audio: "/YaHabibiTrimmed.mp3",
    language: "fr-FR"
  },
  english: {
    title: "Balloon",
    lyrics: [
      { time: 2, text: "Yeah, we ain't talking to your dumbass" },
      { time: 6, text: "You could be a millionaire and still be a bum ass" },
      { time: 10, text: "Boy, I been on a dream, I been on the-" },
      { time: 14, text: "(Don't stop, do-don't stop) okay, look" },
      { time: 18, text: "Why I work so hard? My soul profit" }
    ],
    audio: "/BalloonTrimmed.mp3",
    language: "en-US"
  }
};

function App() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [spokenWords, setSpokenWords] = useState([]); // Stores all recognized words
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [highlightedLyrics, setHighlightedLyrics] = useState([]);
  const [correctWordCount, setCorrectWordCount] = useState(0);
  const [totalWordCount, setTotalWordCount] = useState(0);

  useEffect(() => {
    if (!selectedSong || !isPlaying || !player) return;

    const interval = setInterval(() => {
      if (player.playing()) {
        let currentTime = player.seek();
        let newIndex = selectedSong.lyrics.findIndex(line => currentTime >= line.time);

        if (newIndex !== -1 && newIndex !== currentLyricIndex) {
          setCurrentLyricIndex(newIndex);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [selectedSong, isPlaying, player, currentLyricIndex]);

  const handleSongSelection = (language) => {
    const song = songs[language];
    setSelectedSong(song);
    setCurrentLyricIndex(0);
    setHighlightedLyrics(song.lyrics.map(line => ({ text: line.text, status: "neutral" })));
    setSpokenWords([]); // Reset spoken words

    recognition.lang = song.language;
    console.log(`🌍 Speech recognition set to: ${song.language}`);

    const sound = new Howl({
      src: [song.audio],
      html5: true,
      onend: () => {
        setIsPlaying(false);
        recognition.stop();
      }
    });

    setPlayer(sound);
  };

  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
      recognition.stop();
    } else {
      player.play();
      recognition.start();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("🎤 Recognized Speech:", transcript);

      const cleanedTranscript = removeAccents(transcript);
      setSpokenWords(prevWords => [...prevWords, ...cleanedTranscript.split(" ")]);
      setRecognizedText(transcript);
      compareLyrics([...spokenWords, ...cleanedTranscript.split(" ")]);
    };

    recognition.onerror = (event) => {
      console.error("🚨 Speech Recognition Error:", event.error);
    };

    recognition.onend = () => {
      console.log("⚠️ Speech Recognition Stopped. Restarting...");
      if (isPlaying) recognition.start();
    };
  }, [isPlaying, spokenWords]);

  const compareLyrics = (spokenWords) => {
    if (!selectedSong) return;
  
    let correctCount = 0;
    let totalWords = 0;
  
    const newHighlightedLyrics = selectedSong.lyrics.map((line) => {
      const expectedText = removeAccents(line.text.toLowerCase());
      const expectedWords = expectedText.split(" ");
      totalWords += expectedWords.length;
  
      // Compare all spoken words against this line
      const words = expectedWords.map(word => {
        const cleanWord = word.replace(/[^a-zA-Z0-9\s]/g, "");
        return spokenWords.includes(cleanWord)
          ? `<span class="correct">✅ ${word}</span>`
          : `<span class="incorrect">❌ ${word}</span>`;
      }).join(" ");
  
      correctCount += (words.match(/✅/g) || []).length;
      return { text: words, status: "checked" };
    });

    setHighlightedLyrics(newHighlightedLyrics);
    setCorrectWordCount(correctCount);
    setTotalWordCount(totalWords);
  };

  return (
    <div className="App">
      <h1>🎤 Karaoke Language App</h1>

      <div className="song-selection">
        <h2>Select a song:</h2>
        <div className="buttons">
          <button onClick={() => handleSongSelection("spanish")}>La Fuerte (Spanish)</button>
          <button onClick={() => handleSongSelection("french")}>Ya Habibi (French)</button>
          <button onClick={() => handleSongSelection("english")}>Balloon (English)</button>
        </div>
      </div>

      {selectedSong && (
        <div className="song-lyrics">
          <h2>{selectedSong.title}</h2>
          <div id="lyrics-container">
            {highlightedLyrics.map((line, index) => (
              <p key={index} className={index <= currentLyricIndex ? "highlight" : ""} dangerouslySetInnerHTML={{ __html: line.text }} />
            ))}
          </div>
        </div>
      )}

      {selectedSong && (
        <div className="audio-player">
          <button onClick={togglePlay}>
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      )}

      {selectedSong && (
        <div className="speech-recognition">
          <h3>🎤 Speech Recognition:</h3>
          <p className="speech-output">{recognizedText}</p>
        </div>
      )}

      {selectedSong && (
        <div className="score-box">
          <h3>🎯 Score:</h3>
          <p className="score">✅ {correctWordCount} / {totalWordCount} words correct</p>
        </div>
      )}
    </div>
  );
}

export default App;