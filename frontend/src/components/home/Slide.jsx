import React, { useEffect, useState } from 'react';

import Img0 from '../../assets/Img/0.png';
import Img1 from '../../assets/Img/1.jpg';
import Img2 from '../../assets/Img/2.jpg';
import Img3 from '../../assets/Img/3.jpg';
import Video4 from '../../assets/Img/4.MP4';
import Img5 from '../../assets/Img/5.jpg';

// List of imported media (video must be treated properly)
const media = [
  { type: 'image', src: Img0 },
  { type: 'image', src: Img1 },
  { type: 'image', src: Img2 },
  { type: 'image', src: Img3 },
  { type: 'video', src: Video4 },
  { type: 'image', src: Img5 },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev === media.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const current = media[currentIndex];

  return (
    <div className="slider relative w-full h-full flex items-center justify-center rounded-xl shadow-lg bg-black">
      {current.type === 'video' ? (
        <video
          key={currentIndex}
          src={current.src}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          key={currentIndex}
          src={current.src}
          alt={`Slide ${currentIndex}`}
          className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
        />
      )}
    </div>
  );
};

function Slide() {
  return (
    <div className="w-full  h-[65vh] ">
      <Slider />
    </div>
  );
}

export default Slide;
