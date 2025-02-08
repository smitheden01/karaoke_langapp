import React, { useState } from "react";
import './App.css';

// Songs data
const songs = {
  french: {
    title: "La Vie en Rose",
    lyrics: `Des yeux qui font baisser les miens
Un rire qui se perd sur sa bouche
Voilà le portrait sans retouches
De l'homme auquel j'appartiens
Quand il me prend dans ses bras
Qu'il me parle tout bas
Je vois la vie en rose
Il me dit des mots d'amour
Des mots de tous les jours
Mais moi, ça me fait quelque chose
Il est entré dans mon cœur
Une grande part de bonheur
Dont je connais la cause
C'est lui pour moi, moi pour lui dans la vie
Il me l'a dit, l'a juré pour la vie
Et dès que je l'aperçois
Alors je sens en moi
Mon cœur qui bat`
  },
  english: {
    title: "Waka Waka",
    lyrics: `You're a good soldier, choosing your battles
Pick yourself up and dust yourself off, get back in the saddle
You're on the front line, everyone's watching
You know it's serious, we're getting closer, this isn't over`
  },
  chinese: {
    title: "茉莉花 (Jasmine Flower)",
    lyrics: "好一朵美丽的茉莉花... (Good jasmine flower...)"
  },
  spanish: {
    title: "Despacito",
    lyrics: `Pasito a pasito, suave suavecito
Nos vamos pegando poquito a poquito
Cuando tú me besas con esa destreza
Veo que eres malicia con delicadeza
Pasito a pasito, suave suavecito
Nos vamos pegando, poquito a poquito (oh oh)
Y es que esa belleza es un rompecabezas (oh no)
Pero pa' montarlo aquí tengo la pieza (slow, oh yeah)`
  },
  hindi: {
    title: "Kuch Kuch Hota Hai",
    lyrics: `Tum paas aaye ...yoon muskuraaye...
Tumne naJaane kyaa.. sapne dikhaaye..
Tum paas aaye... yoon muskuraaye...
Tumne naJaane kyaa.. sapne dikhaaye..
Ab to meraa dil.. jaage na sotha hai..
Kyaa karun haaye.. kuch kuch hotha hai..
Kyaa karun haaye.. kuch kuch hotha hai..
F: Tum paas aaye.. yoon muskuraaye..
Tumne naJaane kyaa.. sapne dikhaaye..
Ab to meraa dil.. jaage na sotha hai
Kyaa karun haaye.. kuch kuch hotha hai..
Kyaa karun haaye.. kuch kuch hotha hai..`
  }
};

function App() {
  const [selectedSong, setSelectedSong] = useState(null);

  // Function to handle song selection
  const handleSongSelection = (language) => {
    setSelectedSong(songs[language]);
  };

  return (
    <div className="App">
      <h1>Welcome to Karaoke Language App</h1>

      <div className="song-selection">
        <h2>Select a song to sing:</h2>
        <div className="buttons">
          <button onClick={() => handleSongSelection("french")}>La Vie en Rose (French)</button>
          <button onClick={() => handleSongSelection("english")}>Waka Waka (English)</button>
          <button onClick={() => handleSongSelection("chinese")}>Jasmine Flower (Chinese)</button>
          <button onClick={() => handleSongSelection("spanish")}>Despacito (Spanish)</button>
          <button onClick={() => handleSongSelection("hindi")}>Kuch Kuch Hota Hai (Hindi)</button>
        </div>
      </div>

      {selectedSong && (
        <div className="song-lyrics">
          <h2>{selectedSong.title}</h2>
          <pre>{selectedSong.lyrics}</pre>
        </div>
      )}
    </div>
  );
}

export default App;