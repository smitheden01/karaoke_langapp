import React, { useState, useRef } from "react";
import { Howl } from "howler";
import './App.css';

// Songs data (with paths to the audio files)
const songs = {
  spanish: {
    title: "La Fuerte (Shakira)",
    lyrics: `Si tú quieres yo me asomo
Dime dónde, cuándo y cómo
Si tú quieres yo me asomo
Dime dónde, cómo

Otra noche más que paso sin verte
Otra noche más que me hago la fuerte (Prr)
Borré tu número, ¿y pa' qué? Si ya me lo sé
No te olvido por más que aparente, que aparente`,
    audio: "/Shakira, Bizarrap - La Fuerte (Audio).mp3", // Path to the audio file  
  },
  hindi: {
    title: "Kuch Kuch Hota Hai",
    lyrics: `Tum paas aaye ...yoon muskuraaye...
Tumne naJaane kyaa.. sapne dikhaaye..
Ab to meraa dil.. jaage na sotha hai..
Kyaa karun haaye.. kuch kuch hotha hai..`,
    audio: "/KuchKuchHotaHai.mp3", // Path to the audio file for Hindi song (assuming it's in the public folder)
  },
};

function App() {
  const [selectedSong, setSelectedSong] = useState(null);
  const [player, setPlayer] = useState(null); // Howler player
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioElementRef = useRef(null);

  // Handle song selection
  const handleSongSelection = (language) => {
    const song = songs[language];
    setSelectedSong(song);

    // Create a new Howler instance for this song
    const sound = new Howl({
      src: [song.audio],
      html5: true, // For better performance with large audio files
      onend: () => {
        setIsPlaying(false); // Reset when audio ends
      }
    });

    setPlayer(sound);
  };

  // Play/Pause audio
  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="App">
      <h1>Welcome to Karaoke Language App</h1>

      <div className="song-selection">
        <h2>Select a song to sing:</h2>
        <div className="buttons">
          <button onClick={() => handleSongSelection("spanish")}>La Fuerte (Spanish)</button>
          <button onClick={() => handleSongSelection("hindi")}>Kuch Kuch Hota Hai (Hindi)</button>
        </div>
      </div>

      {selectedSong && (
        <div className="song-lyrics">
          <h2>{selectedSong.title}</h2>
          <pre>{selectedSong.lyrics}</pre>
        </div>
      )}

      {selectedSong && (
        <div className="audio-player">
          <h3>{selectedSong.title}</h3>
          <button onClick={togglePlay}>
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
