import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper Components & Data ---

const Flashcard = ({ image, text }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="w-full aspect-[4/3] [perspective:1000px] cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div className="relative w-full h-full [transform-style:preserve-3d] transition-all duration-500 group-hover:scale-105" animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.6 }}>
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          <img src={image} alt="Memory" className="w-full h-full object-cover rounded-lg shadow-lg border-2 border-white/20" />
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-pink-300 rounded-lg shadow-lg p-6 flex items-center justify-center text-center">
          <div className="h-full w-full overflow-y-auto custom-scrollbar pr-2">
            <p className="text-gray-800 text-xl font-romantic italic">{text}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


const memoryCards = [
  { image: '/assets/memories/first-photo.jpg', text: 'Humari pehli photo sath me yaad hai mere nokia wale se tum kheechi thi photo 20 april ke kuch din baad ke hi baad ki photo hogi yaad hai kaise subah subah plan bana ke milne aate the tum jis time nikalti thi uske hisab se hum plan karke apne ghar se nikalte the ki raste me mil jaye ha hum the ussi time se pagal ab aur zada hogaye hai lekin the toh starting se hi' },
  { image: '/assets/memories/memory-2.jpg', text: 'yeh yaad hai mera itna zada man tha tumhare sath mele me jane ka aur tumko kisi tarah manaye the ki koi nhi dekhega chalte hai aur finally ek din mani tum aur humlog gaye the mele par kismat toh dekho koi jhula start hi nhi hua tha mera toh bahut man tha gaint wheel pe tumhare sath jane the tum dar ke humko pakad leti sare jhule pe jana tha par thik hai maza aya tha bas ghumne me bhi icecream khaye the humlog aur fir parking me jab vapas aye yeh photo liye the tumhara gaal kheechte hue uss time kitna gaal kheech te the itna soft tha matlab abhi bhi bas ane do humko baki sab toh thik pehle toh tumhara gaal laal karenge hum ' },
  { image: '/assets/memories/memory-3.jpg', text: 'yeh yaad hai shayad photo me nhi pata chal raha lekin tum meri godi me ho uthaye hue hai tumko yeh pehli baar toh nhi tha but yaad karate hai pehli baar kaise kiye the tumko ek reel bheje the jisme tha aise utha ke patak dunga tum boli nhi kar paoge hum bole challenge dekho ab karte hai aur next day pe jab mile the pehli baar tumko uthaye the godi me yrr kya kya hua hai ganga center pe bahut yaad ati hai uss time ki bhi aur kitni pyrai lag rahi ho meri godi me sirf meri ' },
  { image: '/assets/memories/memory-4.jpg', text: 'yeh date waffle company me bhaii kya uncle types lagte the hum kaise pasand ki tum humko samjh nhi aa raha dekho ek baar bas much hai ekdum koi uncle lag rahe aur apne aap ko dekho itni cuteee si ho kaise hum aye pasand humko nhi pata ' },
  { image: '/assets/memories/memory-5.jpg', text: 'fir aa jate hai farewell sirf achi battien karenge uss din ki pata hai hum jaise hi ghuse the bas dhund rahe the kaha ho tum dikh hi nhi rahi thi fir ayush mila vo tumhare pass leke gaya khudse hum nhi bole kuch aur itna awkward kar diya tha humko le gaya aur bola shreya lo tumhare liye gift aur bhai itni sundar lag rahi thi na tum uss din hum bata nhi sakte hum nhi ane wale the bas tumhare liye aye the and it was worth it you in red saree is still the second best thing puchogi first kya hai ummm you without any saree 😳 jo bhi, itni achi achi photo hai uss din ki ' },
  { image: '/assets/memories/memory-6.jpg', text: 'Ab dekho is photo ka time toh humko bhi nhi but most probably mains ke baad hai bhaiii hum itna screenshot lete the tumhara vc pe matlab itniii pyari lagti thi yrr kaise na le meri cutipieee uss time kitna manana padta tha tumko ek video call ke liye itna tadpathi thi humko gandi kahiki.' },
  { image: '/assets/memories/memory-7.jpg', text: 'Is photo ki toh date bhi yaad hai humko 26 may jis din advance ka exam tha hum tumhari di hui tshirt pehen ke gaye the exam dene for luck you know 😉 aur uss din ghar walo ko bole the dosto ke sath ghumne ja rahe doston ko bole ghar walon ke sath ja rahe bahut high deman thi meri but ayenge ofcourse aapke pass i know my priorities 😘' },
  { image: '/assets/memories/memory-8.jpg', text: 'Thik hai photo ki quality gandi hai lekin kitni mast photo hai ekdum lag raha blush bhi karna chah rahi lekin public me hai toh toh kar nhi pa rahi yeh advance ke baad pehli date thi humlog ki hum apna bitsat chod ke aye the tumse milna aur uss din mere jaadu maza aa gaya tha na bahut maza aya tha uss din aur humse jo uske baad boli thi ki hum jaldi chale jate aur par tumhari black shirt ki vajah se extra ruke itna kya pasand hai bhai tumko black shirt with folded sleeves.' },
  { image: '/assets/memories/memory-9.jpg', text: 'Hum dono randomly tuning kar liye the tumbhi green hum bhi aur tum aayi thi shrija ko coaching se lene but hum pehle hi bula liye the hum log gaye the 1888 jo gkp club me tha jagah thik thi lekin uske baad jo hua vo badhiya tha if you dont remember our third kiss and the first jisme tumko bilkul guilt nhi hua tha itna acha laga tha tumhare mu se yeh sun ke kya hi bataye' },
  { image: '/assets/memories/memory-10.jpg', text: 'Hum tum aur bhoomika in barista bhai kitnaaa maza aya tha yaha ki jo jo photo hai usme tumhare chehre pe dikh raha tha mere hath tumhare pair pe tha 🫣 kya mast mast photos ayi thi uss din aur tumhare bharose toh kuch ho na hum bheje bhoomika ko vapas aur fir humlog gaye the upar yaad hai 🫣🫣' },
  { image: '/assets/memories/memory-11.jpg', text: 'Ofcourse meri pehli kanpur trip in december jacket akshay ki liye tshirt specailly nayi kharide the us time yaad hai vo park me tumko pendant pehnaye the vo moment i cant forget vo gaurd nhi aya hita hum shaad aur resist nhi kar pate kiss karna vo moment hi aisa ban gaya tha bhai matlab your lips were calling me.' },
  { image: '/assets/memories/memory-12.jpg', text: 'And ofcourse last but not the very least meri last kanpur trip the best the most special kyuki uss time bhi bahut ladai hui thi humlog ki aur fir co teen din vo ganga bairach vo pure gille humdono vo patake best fucking moment of my life aur baki ke 2 din ka toh kya hi kehna matlab uss trip me every single moment with you was just epic and one last thing I just LOVE you ♥️♥️♥️' },
];

const MemoryLane = () => (
  <div>
    <h3 className="text-3xl font-bold mb-2 text-center text-pink-300">A Walk to Remember</h3>
    <p className="text-center mb-8 text-gray-300">Scroll down our memory lane. Click a card to read the story behind it.</p>
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8">
      {/* Central Timeline Line */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-1 bg-gradient-to-b from-pink-300 via-purple-300 to-pink-300"></div>

      {memoryCards.map((card, index) => (
        <div key={index} className="relative mb-12 flex justify-between items-center w-full">
          {/* Timeline Dot */}
          <div className="absolute left-1/2 -translate-x-1/2 z-20 bg-indigo-900 shadow-xl w-8 h-8 rounded-full border-4 border-pink-300 flex items-center justify-center">
            <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
          </div>

          {/* Memory Card - Alternating sides */}
          <div className={`w-5/12 ${index % 2 === 0 ? 'order-1' : 'order-3'}`}>
            <Flashcard image={card.image} text={card.text} />
          </div>

          {/* Empty space for alternating layout */}
          <div className={`w-5/12 ${index % 2 === 0 ? 'order-3' : 'order-1'}`}></div>
        </div>
      ))}
    </div>
  </div>
);

const quotes = ["Keep making the right choices to reveal."];

const Quotes = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const handleNextQuote = () => { setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length); };
  return (
    <div className="text-center p-4 flex flex-col items-center justify-center min-h-[300px] bg-rose-100/10 rounded-lg">
      <h3 className="text-3xl font-bold mb-6 text-pink-300 flex items-center gap-2 font-romantic">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
        Words for You
      </h3>
      <div className="relative h-48 flex items-center justify-center w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.p key={currentQuoteIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="text-2xl italic text-white font-serif-display">"{quotes[currentQuoteIndex]}"</motion.p>
        </AnimatePresence>
      </div>

    </div>
  );
};

const PasswordPrompt = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const correctPassword = "OURSECRET";
  const handleSubmit = () => {
    if (password.toUpperCase() === correctPassword) { onUnlock(); }
    else { setError('That\'s not it, try to remember...'); setTimeout(() => setError(''), 2000); }
  };
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-4">A secret code is required.</h3>
      <p className="mb-4">Hint: What's our special word?</p>
      <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSubmit()} className="bg-indigo-800 border-2 border-purple-500 rounded-md text-white text-center font-bold p-2 uppercase focus:outline-none focus:ring-2 focus:ring-pink-400" placeholder="Enter code" />
      <button onClick={handleSubmit} className="ml-2 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg">Unlock</button>
      {error && <p className="mt-3 text-yellow-400">{error}</p>}
    </div>
  );
};

const CustomModal = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 0 }} className="w-full max-w-4xl max-h-[90vh] bg-indigo-900/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 text-white relative overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-4 right-4 text-2xl z-10">&times;</button>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const TeaserOverlay = ({ onConfirm }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
    <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { delay: 0.2, type: 'spring' } }} exit={{ scale: 0.7, opacity: 0 }} className="text-center text-white">
      <h2 className="text-4xl md:text-5xl font-bold mb-8">Acha laga na???</h2>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onConfirm} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg">Chalo once moreee</motion.button>
    </motion.div>
  </motion.div>
);

const KeyOverlay = ({ onConfirm }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { delay: 0.2, type: 'spring' } }} exit={{ scale: 0.7, opacity: 0 }} className="text-center text-white">
      <svg className="w-24 h-24 mx-auto mb-6 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.7)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5,2C10,2,8,4,8,6.5V9H4V15H8V18.5C8,21,10,23,12.5,23S17,21,17,18.5V17H18A3,3,0,0,0,21,14V11A3,3,0,0,0,18,8H17V6.5C17,4,15,2,12.5,2M12.5,4A2.5,2.5,0,0,1,15,6.5V8H10V6.5A2.5,2.5,0,0,1,12.5,4M15,11V14H10V11H15M18,10A1,1,0,0,1,19,11V14A1,1,0,0,1,18,15H17V10H18Z" /></svg>
      <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to give me one more "genuine" reaction?</h2>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onConfirm} className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg">Let's goooo!!!!</motion.button>
    </motion.div>
  </motion.div>
);

const DramaticReveal = () => (
  <div className="fixed inset-0 z-[100] pointer-events-none bg-gray-900">
    <motion.div className="absolute top-0 left-0 w-1/2 h-full bg-gray-900" initial={{ x: 0 }} animate={{ x: '-100vw', transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }} />
    <motion.div className="absolute top-0 right-0 w-1/2 h-full bg-gray-900" initial={{ x: 0 }} animate={{ x: '100vw', transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }} />
    <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 1, scale: 1 }} animate={{ opacity: 0, scale: 2, transition: { duration: 0.7, delay: 0.3 } }}>
      <svg className="w-32 h-32 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.7)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5,2C10,2,8,4,8,6.5V9H4V15H8V18.5C8,21,10,23,12.5,23S17,21,17,18.5V17H18A3,3,0,0,0,21,14V11A3,3,0,0,0,18,8H17V6.5C17,4,15,2,12.5,2M12.5,4A2.5,2.5,0,0,1,15,6.5V8H10V6.5A2.5,2.5,0,0,1,12.5,4M15,11V14H10V11H15M18,10A1,1,0,0,1,19,11V14A1,1,0,0,1,18,15H17V10H18Z" /></svg>
    </motion.div>
  </div>
);

const MessagesFromFriends = () => {
  const [activeTab, setActiveTab] = useState('shruti');

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h3 className="text-3xl font-bold mb-6 text-center text-pink-300 font-romantic">Special Messages 💕</h3>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <div className="bg-white/10 rounded-lg p-1 flex gap-2">
          <button
            onClick={() => setActiveTab('shruti')}
            className={`px-4 py-2 rounded-md transition-all ${activeTab === 'shruti' ? 'bg-pink-500 text-white' : 'text-gray-300 hover:bg-white/20'}`}
          >
            Shruti
          </button>
          <button
            onClick={() => setActiveTab('suhani')}
            className={`px-4 py-2 rounded-md transition-all ${activeTab === 'suhani' ? 'bg-pink-500 text-white' : 'text-gray-300 hover:bg-white/20'}`}
          >
            Suhani
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white/10 rounded-xl p-6 min-h-[400px]">
        {activeTab === 'shruti' && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-2 border-white/30">
              <img
                src="/assets/messages/shruti_photo.jpg"
                alt="Shruti"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-xl font-bold text-pink-300 mb-4">From Shruti</h4>

            <div className="aspect-video w-full max-w-2xl mx-auto bg-black rounded-lg overflow-hidden">
              <video
                src="/assets/messages/shruti_video.mp4"
                controls
                className="w-full h-full"
              >
                Your browser does not support the video tag.
              </video>
            </div>

          </div>
        )}

        {activeTab === 'suhani' && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-2 border-white/30">
              <img
                src="/assets/messages/suhani_avatar.jpg"
                alt="Suhani"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-xl font-bold text-blue-300 mb-4">From Suhani</h4>

            <div className="max-w-md mx-auto">
              <img
                src="/assets/messages/suhani_photo.jpg"
                alt="Special memory with Suhani"
                className="w-full rounded-lg shadow-lg border-2 border-white/20"
              />
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

const VisionBoardContent = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h3 className="text-3xl font-bold mb-6 text-center text-purple-300 font-romantic">All your choices will lead you here...</h3>
      <div className="bg-white/10 rounded-xl p-6">
        <div className="w-full max-w-4xl mx-auto">
          <img
            src="/assets/vision-board/vision-board-image.jpg"
            alt="Shreya's Vision Board"
            className="w-full rounded-lg shadow-lg border-2 border-white/20"
          />
        </div>

      </div>
    </div>
  );
};


// --- Main Birthday Component ---
export default function App() {
  const [stage, setStage] = useState(1);
  const [glitching, setGlitching] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [finalAccepted, setFinalAccepted] = useState(false);
  const [candles, setCandles] = useState(6);
  const [isBlowing, setIsBlowing] = useState(false);
  const [cakeCut, setCakeCut] = useState(0);
  const [postCakeStep, setPostCakeStep] = useState(0);
  const [isRevealingEpic, setIsRevealingEpic] = useState(false);
  const [chits, setChits] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);
  const [unlockedFolders, setUnlockedFolders] = useState([]);
  const [notification, setNotification] = useState('');
  const [time, setTime] = useState(new Date());
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [hasStartedMusic, setHasStartedMusic] = useState(false);

  const blowIntervalRef = useRef(null);
  const audioRef = useRef(null);

  const handleAccept = () => { setGlitching(true); setTimeout(() => { setStage(2); setGlitching(false); }, 500); };
  const handleSkip = () => setStage(4);

  const handleCutCake = () => {
    if (cakeCut < 100) {
      const newCut = Math.min(100, cakeCut + 10);
      setCakeCut(newCut);
      const cakePopups = ["❤️", "🎉", "💖", "Happy Bday!", "Yay!", "✨", "😍"];
      const newPopup = {
        id: Date.now() + Math.random(),
        content: cakePopups[Math.floor(Math.random() * cakePopups.length)],
        style: { top: `${20 + Math.random() * 60}%`, left: `${10 + Math.random() * 80}%` }
      };
      setChits(prev => [...prev, newPopup]);
      setTimeout(() => { setChits(currentChits => currentChits.filter(c => c.id !== newPopup.id)); }, 1500);
    }
  };

  const handleUseKey = () => { setPostCakeStep(0); setStage(3); };
  const handleFinalAccept = () => { setIsRevealingEpic(true); setTimeout(() => { setStage(4); }, 1600); };

  useEffect(() => {
    if (isBlowing && candles > 0) {
      blowIntervalRef.current = setInterval(() => { setCandles(c => Math.max(0, c - 1)); }, 700);
    }
    return () => clearInterval(blowIntervalRef.current);
  }, [isBlowing, candles]);

  useEffect(() => { if (cakeCut === 100) { setTimeout(() => { setPostCakeStep(1); }, 10000); } }, [cakeCut]);
  useEffect(() => { const timer = setInterval(() => setTime(new Date()), 60000); return () => clearInterval(timer); }, []);

  // Playlist for background music
  const playlist = useMemo(() => ([
    { title: 'Until I Found You', src: '/assets/music/until i found you.mp3' },
    { title: 'Ajab Si', src: '/assets/music/ajab si.mp3' },
    { title: 'Dil Na Janeya', src: '/assets/music/dil na janeyan.mp3' },
    { title: 'Perfect', src: '/assets/music/perfect.mp3' },
  ]), []);

  // No autoplay; start on first folder click

  // Update audio source on track change
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = playlist[trackIndex]?.src || '';
    if (isMusicPlaying) {
      audioRef.current.play().catch(() => setIsMusicPlaying(false));
    }
  }, [trackIndex, isMusicPlaying, playlist]);

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      try { await audioRef.current.play(); setIsMusicPlaying(true); }
      catch { /* ignore */ }
    } else {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
  };

  const playPrev = () => {
    setTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };
  const playNext = () => {
    setTrackIndex((prev) => (prev + 1) % playlist.length);
  };
  const onEnded = () => {
    setTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const openFolder = (folder) => {
    if (!hasStartedMusic && audioRef.current) {
      if (!audioRef.current.src) {
        audioRef.current.src = playlist[0]?.src || '';
      }
      try { audioRef.current.load(); } catch { }
      audioRef.current.play()
        .then(() => { setIsMusicPlaying(true); setHasStartedMusic(true); })
        .catch(() => {
          setTimeout(() => {
            if (!audioRef.current) return;
            audioRef.current.play().then(() => { setIsMusicPlaying(true); setHasStartedMusic(true); }).catch(() => { });
          }, 150);
        });
    }
    if (folder.locked && !unlockedFolders.includes(folder.id)) setActiveFolder({ ...folder, needsUnlock: true });
    else setActiveFolder(folder);
  };
  const closeFolder = () => setActiveFolder(null);

  const folderData = useMemo(() => {
    const iconBaseProps = { className: "w-8 h-8", viewBox: "0 0 24 24", fill: "currentColor" };
    return [
      { id: 'memory-lane', title: 'Memory Lane', icon: <svg {...iconBaseProps} className="w-8 h-8 text-blue-600"><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" /><circle cx="12" cy="12" r="3.2" /></svg>, content: <MemoryLane /> },
      { id: 'quotes', title: 'Quotes', icon: <svg {...iconBaseProps} className="w-8 h-8 text-pink-600"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>, content: <Quotes /> },
      { id: 'message', title: 'Message', icon: <svg {...iconBaseProps} className="w-8 h-8 text-green-600"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z" /></svg>, content: <MessagesFromFriends /> },
      { id: 'vision-board', title: 'Photos from the Future', icon: <svg {...iconBaseProps} className="w-8 h-8 text-purple-600"><path d="M4 22h4v-4H4v4zm0-12h4V6H4v4zm0 6h4v-4H4v4zm6 6h4v-4h-4v4zm0-6h4v-4h-4v4zm6-12v4h4V6h-4zm-6 0h4V2h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" /></svg>, content: <VisionBoardContent /> },
      { id: 'open-at-last', title: 'Open at Last', locked: true, icon: <svg {...iconBaseProps} className="w-8 h-8 text-yellow-600"><path d="M4,20H20A2,2 0 0,0 22,18V8A2,2 0 0,0 20,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20Z" /></svg>, content: <div className="aspect-video w-full max-w-2xl mx-auto"><video src="/assets/videos/recorded_message.mp4" controls className="w-full h-full rounded-lg bg-black"></video></div> }
    ];
  }, []);

  // STAGE 1: Dull T&C
  if (stage === 1) return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center font-serif-display text-gray-800 p-4">
      <AnimatePresence>{glitching && <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0, 1, 0] }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black z-50 pointer-events-none" />}</AnimatePresence>
      <div className="max-w-2xl w-full bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">An attempt to make your Birthday special (during midsems)</h1>
        <p className="mb-6">By proceeding, you agree to give a very "genuine" reaction for what's coming next.</p>
        <div className="flex items-center space-x-3"><input type="checkbox" id="accept" checked={accepted} onChange={() => setAccepted(!accepted)} className="h-5 w-5" /><label htmlFor="accept">Aur koi option nhi hai</label></div>
        <button onClick={handleAccept} disabled={!accepted} className="mt-6 w-full bg-gray-800 text-white font-bold py-3 px-6 disabled:bg-gray-400 transition-colors">Thik hai fir lets go....</button>
        <button onClick={handleSkip} className="mt-2 text-center w-full text-gray-500 hover:text-gray-700 text-sm">Skip to surprise &gt;</button>
      </div>
    </div>
  );

  // STAGE 2: Cake Page
  if (stage === 2) return (
    <div className="bg-blue-100 min-h-screen flex flex-col items-center justify-center font-sans-body p-4 transition-colors duration-500 overflow-hidden relative">
      <AnimatePresence>
        {postCakeStep === 1 && <TeaserOverlay onConfirm={() => setPostCakeStep(2)} />}
        {postCakeStep === 2 && <KeyOverlay onConfirm={handleUseKey} />}
      </AnimatePresence>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <AnimatePresence>
          {chits.map((c) => (<motion.div key={c.id} initial={{ opacity: 0, y: 20, scale: 0.5 }} animate={{ opacity: 1, y: 0, scale: 1, rotate: Math.random() * 20 - 10 }} exit={{ opacity: 0, y: -50, scale: 0, transition: { duration: 0.5 } }} className="absolute text-3xl drop-shadow-lg" style={c.style}>{c.content}</motion.div>))}
        </AnimatePresence>
      </div>
      <div className="w-full max-w-md text-center z-10">
        <h1 className="text-5xl font-bold text-pink-500 mb-4 animate-pulse">Happy Birthday, Shreya!</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-2">Make a Wish!</h2>
        <div className="relative w-64 h-48 mx-auto mb-8">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-20 bg-pink-300 rounded-t-lg border-4 border-gray-800"></div>
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-64 h-20 bg-yellow-200 rounded-t-lg border-4 border-gray-800"></div>
          {Array.from({ length: 6 }).map((_, i) => (<motion.div key={i} className="absolute bottom-36" style={{ left: `${25 + i * 10}%` }} initial={{ opacity: 1, y: 0 }} animate={{ opacity: i < 6 - candles ? 0 : 1, y: i < 6 - candles ? 20 : 0 }}><div className="w-2 h-8 bg-blue-400"></div><div className="w-2 h-2 bg-yellow-400 rounded-full -mt-9 animate-pulse"></div></motion.div>))}
        </div>
        <div className="space-y-4">
          <div>
            <button onMouseDown={() => setIsBlowing(true)} onMouseUp={() => setIsBlowing(false)} onMouseLeave={() => setIsBlowing(false)} disabled={candles === 0} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg disabled:bg-gray-400 select-none">{isBlowing ? 'Blowing...' : 'Hold to Blow Candles'} ({candles} left)</button>
            <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(6 - candles) / 6 * 100}%` }}></div></div>
          </div>
          <div>
            <button onClick={handleCutCake} disabled={cakeCut === 100} className="w-full bg-pink-500 text-white font-bold py-3 rounded-lg disabled:bg-gray-400">Cut Cake</button>
            <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2"><div className="bg-pink-600 h-2.5 rounded-full" style={{ width: `${cakeCut}%` }}></div></div>
          </div>
        </div>
      </div>
    </div>
  );

  // STAGE 3: Final T&C
  if (stage === 3) return (
    <div className="bg-gray-900 text-gray-300 min-h-screen flex items-center justify-center font-mono p-4 relative">
      {isRevealingEpic && <DramaticReveal />}
      <div className="max-w-2xl w-full bg-black/50 border border-red-500/50 p-8 shadow-2xl shadow-red-500/20">
        <h1 className="text-3xl font-bold mb-4 text-red-400">[ System Alert: Time Travel Detected ]</h1>
        <p className="mb-6">Hii, Piyush from the future here iss kutte se toh dhnag ki website banai nhi gai, I think you might like this one better 💗💗💗</p>
        <div className="flex items-center space-x-3">
          <input type="checkbox" id="finalAccept" checked={finalAccepted} onChange={() => setFinalAccepted(!finalAccepted)} className="h-5 w-5 appearance-none border-2 border-red-400 bg-gray-800 checked:bg-red-500 transition-all duration-200 cursor-pointer" />
          <label htmlFor="finalAccept" className="cursor-pointer">Idhar bhi koi aur choice nhi hai</label>
        </div>
        <button onClick={handleFinalAccept} disabled={!finalAccepted} className="mt-6 w-full bg-red-600 text-white font-bold py-3 px-6 disabled:bg-gray-600 transition-colors hover:enabled:bg-red-700">Lets take a peek in the future</button>
      </div>
    </div>
  );

  // STAGE 4: Desktop UI
  if (stage === 4) return (
    <div className="min-h-screen w-full overflow-hidden bg-slate-900 font-sans-body text-white relative flex flex-col">
      <motion.div
        className="flex-grow relative w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/memories/vision-board.jpg.png')" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.5 } }}
      >
      </motion.div>
      <audio ref={audioRef} onEnded={onEnded} loop playsInline preload="auto" />
      <footer className="w-full h-24 bg-gradient-to-r from-purple-800 to-indigo-900 flex items-center justify-between px-8 z-20 shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={toggleMusic} className="bg-white/20 hover:bg-white/30 p-3 rounded-md text-sm font-bold">Start</button>
          <div className="flex items-center gap-3">
            <button onClick={playPrev} className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-md text-sm font-bold">⏮</button>
            <button onClick={toggleMusic} className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-md text-sm font-bold">{isMusicPlaying ? '⏸' : '▶️'}</button>
            <button onClick={playNext} className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-md text-sm font-bold">⏭</button>
            <select value={trackIndex} onChange={(e) => setTrackIndex(Number(e.target.value))} className="bg-white/20 hover:bg-white/30 text-white text-sm rounded-md px-3 py-2">
              {playlist.map((t, i) => (<option key={t.src} value={i}>{t.title}</option>))}
            </select>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-5 items-center gap-2 px-6">
          {folderData.map((folder, i) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0 + i * 0.1 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => openFolder(folder)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-white/60 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all duration-200 group-hover:scale-110">
                {folder.icon}
              </div>
              <span className="mt-1 text-xs text-white font-semibold drop-shadow-md">{folder.title}</span>
              {(folder.locked && !unlockedFolders.includes(folder.id)) && <div className="absolute -top-1 -right-1 text-xs bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center">🔒</div>}
            </motion.div>
          ))}
        </div>
        <div className="text-sm font-medium"><span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
      </footer>
      <CustomModal isOpen={!!activeFolder} onClose={closeFolder}>
        {activeFolder && (activeFolder.needsUnlock ? <PasswordPrompt onUnlock={() => { setUnlockedFolders(p => [...p, 'open-at-last']); closeFolder(); showNotification('Folder Unlocked!'); }} /> : <div>{activeFolder.content}</div>)}
      </CustomModal>
      <AnimatePresence>{notification && <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="absolute bottom-20 right-10 bg-green-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg z-50">{notification}</motion.div>}</AnimatePresence>
    </div>
  );

  return null;
}

