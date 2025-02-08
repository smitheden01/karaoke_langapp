import React, { useState, useEffect } from "react";
import { Howl } from "howler";
import "./App.css";

// Web Speech API setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false; // Only final results
recognition.lang = "es-ES"; // Default language

// Songs Data (Spanish & Hindi)
const songs = {
  spanish: {
    title: "La Fuerte (Shakira)",
    lyrics: [
      { time: 2, text: "Si tú quieres yo me asomo" },
      { time: 6, text: "Dime dónde, cuándo y cómo" },
      { time: 10, text: "Si tú quieres yo me asomo" },
      { time: 14, text: "Dime dónde, cómo" }
    ],
    audio: "/Shakira, Bizarrap - La Fuerte (Audio).mp3",
    language: "es-ES"
  },
  hindi: {
    title: "Kuch Kuch Hota Hai",
    lyrics: [
      { time: 2, text: "Tum paas aaye" },
      { time: 6, text: "Yoon muskuraaye" },
      { time: 10, text: "Tumne na jaane kya" },
      { time: 14, text: "Sapne dikhaye" }
    ],
    audio: "/KuchKuchHotaHai.mp3",
    language: "hi-IN"
  }
};

function App() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [recognizedText, setRecognizedText] = useState("");
  const [highlightedLyrics, setHighlightedLyrics] = useState([]);
  const [correctWordCount, setCorrectWordCount] = useState(0);
  const [totalWordCount, setTotalWordCount] = useState(0);

  // Auto-update lyrics every 100ms while the song plays
  useEffect(() => {
    if (!selectedSong || !isPlaying || !player) return;

    const interval = setInterval(() => {
      if (player.playing()) {
        let currentTime = player.seek();
        let lyrics = selectedSong.lyrics;
        let newIndex = lyrics.findIndex(line => currentTime >= line.time);

        if (newIndex !== -1 && newIndex !== currentLyricIndex) {
          setCurrentLyricIndex(newIndex);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [selectedSong, isPlaying, player, currentLyricIndex]);

  // Handle song selection
  const handleSongSelection = (language) => {
    const song = songs[language];
    setSelectedSong(song);
    setCurrentLyricIndex(0);
    setHighlightedLyrics(song.lyrics.map(line => ({ text: line.text, status: "neutral" })));

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

  // Play/Pause music & speech recognition
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

  // Handle speech recognition result
  useEffect(() => {
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log("🎤 Recognized Speech:", transcript);
      setRecognizedText(transcript);
      compareLyrics(transcript);
    };

    recognition.onerror = (event) => {
      console.error("🚨 Speech Recognition Error:", event.error);
    };

    recognition.onend = () => {
      console.log("⚠️ Speech Recognition Stopped. Restarting...");
      if (isPlaying) recognition.start();
    };
  }, [isPlaying]);

  // Compare recognized words to expected lyrics
  const compareLyrics = (userInput) => {
    if (!selectedSong) return;

    let expectedText = selectedSong.lyrics[currentLyricIndex]?.text.toLowerCase();
    if (!expectedText) return;

    const expectedWords = expectedText.split(" ");
    const userWords = userInput.toLowerCase().split(" ");

    let correctCount = 0;
    const newHighlightedLyrics = selectedSong.lyrics.map((line, index) => {
      if (index === currentLyricIndex) {
        const words = line.text.split(" ").map(word => {
          const cleanWord = word.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, "");
          return userWords.includes(cleanWord)
            ? `<span class="correct">✅ ${word}</span>`
            : `<span class="incorrect">❌ ${word}</span>`;
        }).join(" ");

        correctCount = words.match(/✅/g)?.length || 0;
        return { text: words, status: "checked" };
      }
      return { text: line.text, status: "neutral" };
    });

    setHighlightedLyrics(newHighlightedLyrics);
    setCorrectWordCount(correctCount);
    setTotalWordCount(expectedWords.length);
  };

  return (
    <div className="App">
      <h1>🎤 Karaoke Language App</h1>

      <div className="song-selection">
        <h2>Select a song:</h2>
        <div className="buttons">
          <button onClick={() => handleSongSelection("spanish")}>La Fuerte (Spanish)</button>
          <button onClick={() => handleSongSelection("hindi")}>Kuch Kuch Hota Hai (Hindi)</button>
        </div>
      </div>

      {selectedSong && (
        <div className="song-lyrics">
          <h2>{selectedSong.title}</h2>
          <div id="lyrics-container">
            {highlightedLyrics.map((line, index) => (
              <p key={index} className={index === currentLyricIndex ? "highlight" : ""} dangerouslySetInnerHTML={{ __html: line.text }} />
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
