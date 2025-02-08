import React, { useState } from 'react';

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

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  return (
    <div>
      {/* Home Page */}
      <h1>Welcome to the Language Learning App!</h1>
      <p>Select a song and start singing along to practice your language skills!</p>

      {/* Song Selection Page */}
      <div>
        <h2>Choose a Song to Sing</h2>
        <ul>
          <li onClick={() => handleSongSelect('french')}>French Song: La Vie en Rose</li>
          <li onClick={() => handleSongSelect('english')}>English Song: Waka Waka</li>
          <li onClick={() => handleSongSelect('chinese')}>Chinese Song: 茉莉花 (Jasmine Flower)</li>
          <li onClick={() => handleSongSelect('spanish')}>Spanish Song: Despacito</li>
          <li onClick={() => handleSongSelect('hindi')}>Hindi Song: Kuch Kuch Hota Hai</li>
        </ul>
      </div>

      {/* Sing Along Page */}
      {selectedSong && (
        <div>
          <h2>{songs[selectedSong].title}</h2>
          <p>{songs[selectedSong].lyrics}</p>
          <p>Start singing the lyrics above and practice your pronunciation!</p>
          <textarea placeholder="Record your singing here..." rows="5" cols="50"></textarea>
        </div>
      )}

      {/* Feedback Page */}
      <div>
        <h2>Your Pronunciation Feedback</h2>
        <p>We will provide feedback on the words you missed or pronounced incorrectly.</p>
      </div>
    </div>
  );
}

export default App;
