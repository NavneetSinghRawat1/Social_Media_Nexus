import React, { useState,useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MediaCarousel({ addons }) {
  // console.log("addons -> ",addons);
  if (!addons || addons.length === 0) return null;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaTypes, setMediaTypes] = useState([]);

  // const isVideoUrl =async (url) => {
  //   const response = await fetch(url, { method: "HEAD" });
  //   const contentType = response.headers.get("content-type");
  //   // console.log("File type is:", contentType); 
  //   // Will output something like 'image/jpeg', 'image/webp', or 'video/mp4'
  //   // const videoExtensions = ['.mp4', '.mov', '.webm', '.mkv', '/video', 'ik-video', 'video/mp4'];
  //   // return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  //   if(contentType.includes("video")) {
  //     return true;
  //   }
  //   return false;
  // };

  const isVideoUrl = async (url) => {
    try {
      const response = await fetch(url, {
        method: "HEAD",
      });

      const contentType = response.headers.get("content-type");

      console.log("Content-Type:", contentType);

      if (contentType?.startsWith("image/")) {
        return false;
      }

      if (contentType?.startsWith("video/")) {
        return true;
      }

      return "unknown";
    } catch (err) {
      console.error(err);
      return "error";
    }
  };


  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === addons.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? addons.length - 1 : prev - 1));
  };

  // if (addons.length === 1) {
  //   return (
  //     <div className="mt-4 rounded-xl overflow-hidden border border-slate-100 bg-slate-950 aspect-video flex items-center justify-center relative">
  //       {isVideoUrl(addons[0]).then? (
  //         <video src={addons[0]} controls className="w-full h-full object-contain max-h-[450px]" />
  //       ) : (
  //         <img src={addons[0]} alt="Post attachment" className="w-full h-full object-cover max-h-[450px]" />
  //       )}
  //     </div>
  //   );
  // }


  // useEffect(() => {
  //   const checkFileType = async () => {
  //     try {
  //       const response = await fetch(addons[0], {
  //         method: "HEAD",
  //       });

  //       const contentType = response.headers.get("content-type");

  //       if (contentType?.startsWith("video/")) {
  //         setMediaType("video");
  //       } else if (contentType?.startsWith("image/")) {
  //         setMediaType("image");
  //       } else {
  //         setMediaType("unknown");
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       setMediaType("unknown");
  //     }
  //   };

  //   if (addons?.length === 1) {
  //     checkFileType();
  //   }
  // }, [addons]);

  useEffect(() => {
    const checkMediaTypes = async () => {
      const results = await Promise.all(
        addons.map(async (url) => {
          try {
            const response = await fetch(url, {
              method: "HEAD",
            });

            const contentType = response.headers.get("content-type");

            if (contentType?.startsWith("video/")) {
              return "video";
            }

            return "image";
          } catch (err) {
            console.error(err);
            return "image";
          }
        })
      );

      setMediaTypes(results);
    };

    if (addons?.length) {
      checkMediaTypes();
    }
  }, [addons]);

  if (addons.length === 1) {
    return (
      <div className="mt-4 rounded-xl overflow-hidden border border-slate-100 bg-slate-950 aspect-video flex items-center justify-center relative">

        {mediaTypes[0] === "video" ? (
          <video
            src={addons[0]}
            controls
            className="w-full h-full object-contain max-h-[450px]"
          />
        ) : (
          <img
            src={addons[0]}
            alt="Post attachment"
            className="w-full h-full object-cover max-h-[450px]"
            style={{objectFit: 'cover'}}
          />
        )}

      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl overflow-hidden border border-slate-100 bg-slate-950 aspect-video relative group select-none">
      
      <div 
        className="w-full h-full flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {addons.map((url, idx) => (
            <div
              key={idx}
              className="w-full h-full flex-shrink-0 flex items-center justify-center bg-slate-950"
            >

              {mediaTypes[idx] === "video" ? (
                <video
                  src={url}
                  controls={idx === currentIndex}
                  className="w-full h-full object-contain max-h-[450px]"
                />
              ) : (
                <img
                  src={url}
                  alt={`Attachment asset ${idx + 1}`}
                  className="w-full h-full object-cover max-h-[450px]"
                />
              )}
          </div>
        ))}
      </div>

      <button 
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {addons.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-4 bg-indigo-500' : 'w-1.5 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

    </div>
  );
}