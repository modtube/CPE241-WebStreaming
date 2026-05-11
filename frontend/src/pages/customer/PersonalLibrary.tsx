import { useState, useEffect } from "react";
import { message } from "antd";
import { Settings, Languages, Info, PlayCircle } from "lucide-react";

// --- Types ---
type MovieInLibrary = {
  movie_id: string;
  title: string;
  img_path: string;
  purchase_date: string;
};

type MediaFile = { quality: string; file_path: string; priority: number };
type Resource = {
  type: "Subtitle" | "Audio";
  file_path: string;
  language_id: string;
  priority: number;
};
type CastCrew = {
  person_id: string;
  role_type: string;
  character_name: string | null;
};

type MovieDetail = {
  movie_id: string;
  title: string;
  movie_description: string;
  release_date: string;
  media_files: MediaFile[];
  resources: Resource[];
  cast_and_crew: CastCrew[];
};

type LanguageMap = { [key: string]: string };
type PersonMap = { [key: string]: string }; // เพิ่มสำหรับเก็บชื่อบุคคล

function MoviePoster({ imageUrl, title }: { imageUrl: string; title: string }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative aspect-[2/3] overflow-hidden bg-[#1a1a1a] flex items-center justify-center pointer-events-none">
      {isLoading && !isError && (
        <div className="absolute inset-0 animate-pulse bg-zinc-800" />
      )}
      {isError ? (
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <span className="text-gray-600 text-[10px] uppercase font-bold mb-2">
            {title}
          </span>
          <div className="text-gray-500 text-[10px] border border-gray-700 px-2 py-1 rounded">
            img not rendered
          </div>
        </div>
      ) : (
        <img
          src={`http://localhost:5000${imageUrl}`}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsError(true);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
}

export default function PersonalLibrary() {
  const [movies, setMovies] = useState<MovieInLibrary[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [languages, setLanguages] = useState<LanguageMap>({});
  const [persons, setPersons] = useState<PersonMap>({}); // State สำหรับชื่อคน
  const [currentQuality, setCurrentQuality] = useState<string>("");
  const [currentAudio, setCurrentAudio] = useState<string>("");
  const [currentSub, setCurrentSub] = useState<string>("None");

  const fetchLibrary = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/customer/my-movies",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const result = await response.json();
      setMovies(result.data || result);
    } catch (error) {
      message.error("โหลดคลังหนังไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetail = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/movies/${id}`);
      const data: MovieDetail = await res.json();
      setMovieDetail(data);

      if (data.media_files.length > 0)
        setCurrentQuality(data.media_files[0].quality);

      // ดึงภาษา
      const langIds = Array.from(
        new Set(data.resources.map((r) => r.language_id)),
      );
      const langMap: LanguageMap = { ...languages };
      for (const lId of langIds) {
        if (!langMap[lId]) {
          try {
            const lRes = await fetch(
              `http://localhost:5000/api/languages/${lId}`,
            );
            const lData = await lRes.json();
            langMap[lId] = lData.language_name;
          } catch (e) {
            langMap[lId] = lId;
          }
        }
      }
      setLanguages(langMap);

      // 🟢 ดึงข้อมูล Person แทนที่คำว่า UNKNOWN
      const personIds = Array.from(
        new Set(data.cast_and_crew.map((p) => p.person_id)),
      );
      const personMap: PersonMap = { ...persons };
      for (const pId of personIds) {
        if (!personMap[pId]) {
          try {
            const pRes = await fetch(
              `http://localhost:5000/api/persons/${pId}`,
            );
            const pData = await pRes.json();
            // รวมชื่อ First + Last Name
            personMap[pId] = `${pData.first_name} ${pData.last_name}`;
          } catch (e) {
            personMap[pId] = "Unknown Person";
          }
        }
      }
      setPersons(personMap);

      const firstAudio = data.resources.find((r) => r.type === "Audio");
      if (firstAudio) setCurrentAudio(firstAudio.language_id);
    } catch (error) {
      message.error("ไม่สามารถโหลดรายละเอียดหนังได้");
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  useEffect(() => {
    if (selectedMovieId) fetchMovieDetail(selectedMovieId);
    else setMovieDetail(null);
  }, [selectedMovieId]);

  if (selectedMovieId && movieDetail) {
    const currentVideo = movieDetail.media_files.find(
      (f) => f.quality === currentQuality,
    );

    return (
      <div className="fixed inset-y-0 left-64 right-0 overflow-y-auto bg-[#0a0a0a] text-white z-50">
        <div className="p-8 max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedMovieId(null)}
            className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>←</span> Back to Library
          </button>

          <div className="relative aspect-video rounded-3xl overflow-hidden bg-black border border-white/5 shadow-2xl group">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/50">
              <span className="text-zinc-500 text-[12px] mb-2 font-mono">
                Source: {currentVideo?.file_path}
              </span>
              <PlayCircle size={64} className="text-[#A3526D] opacity-80" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold">{movieDetail.title}</div>
                  <div className="text-[10px] bg-white/10 border border-white/10 px-2 py-0.5 rounded text-[#EAB8C9]">
                    {currentQuality}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Settings size={16} className="text-gray-400" />
                    <select
                      value={currentQuality}
                      onChange={(e) => setCurrentQuality(e.target.value)}
                      className="bg-transparent text-xs outline-none cursor-pointer hover:text-[#EAB8C9]"
                    >
                      {movieDetail.media_files.map((f) => (
                        <option
                          key={f.quality}
                          value={f.quality}
                          className="bg-zinc-900"
                        >
                          {f.quality}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                    <Languages size={16} className="text-gray-400" />
                    <div className="flex flex-col gap-1">
                      <select
                        value={currentAudio}
                        onChange={(e) => setCurrentAudio(e.target.value)}
                        className="bg-transparent text-[10px] outline-none cursor-pointer"
                      >
                        {movieDetail.resources
                          .filter((r) => r.type === "Audio")
                          .map((r) => (
                            <option
                              key={r.file_path}
                              value={r.language_id}
                              className="bg-zinc-900"
                            >
                              Audio: {languages[r.language_id] || r.language_id}
                            </option>
                          ))}
                      </select>
                      <select
                        value={currentSub}
                        onChange={(e) => setCurrentSub(e.target.value)}
                        className="bg-transparent text-[10px] outline-none cursor-pointer"
                      >
                        <option value="None" className="bg-zinc-900">
                          Sub: Off
                        </option>
                        {movieDetail.resources
                          .filter((r) => r.type === "Subtitle")
                          .map((r) => (
                            <option
                              key={r.file_path}
                              value={r.language_id}
                              className="bg-zinc-900"
                            >
                              Sub: {languages[r.language_id] || r.language_id}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{movieDetail.title}</h1>
              <p className="text-gray-400 mb-6 text-sm italic border-l-2 border-[#A3526D] pl-4">
                {movieDetail.movie_description}
              </p>

              <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5">
                <h3 className="text-[#A3526D] font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Info size={14} /> Cast & Crew Information
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {movieDetail.cast_and_crew.map((person) => (
                    <div
                      key={person.person_id + person.role_type}
                      className="flex flex-col"
                    >
                      {/* 🟢 แสดงชื่อจริงจาก API แทน UNKNOWN */}
                      <span className="text-sm font-bold text-white">
                        {persons[person.person_id] ||
                          person.character_name ||
                          "Unknown Role"}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase">
                        {person.role_type}{" "}
                        {person.character_name
                          ? `(${person.character_name})`
                          : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#A3526D]/5 p-6 rounded-3xl border border-[#A3526D]/10 h-fit">
              <h4 className="text-[#EAB8C9] text-[10px] font-bold uppercase tracking-widest mb-4">
                Playback Details
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Quality</span>
                  <span className="text-white font-mono">{currentQuality}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Audio</span>
                  <span className="text-white">
                    {languages[currentAudio] || "System Default"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtitle</span>
                  <span className="text-white">
                    {currentSub === "None" ? "Off" : languages[currentSub]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 left-64 right-0 overflow-y-auto bg-black text-white">
      <div className="p-8">
        <div className="mb-8 flex justify-between items-end border-b border-white/5 pb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Personal Library
            </h2>
            <p className="mt-1 text-sm text-gray-500 font-medium">
              Your collection of {movies.length} movies
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading
            ? [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-2xl bg-zinc-900 animate-pulse"
                />
              ))
            : movies.map((movie) => (
                <button
                  key={movie.movie_id}
                  onClick={() => setSelectedMovieId(movie.movie_id)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 text-left transition-all hover:-translate-y-2 hover:border-[#A3526D]/50"
                >
                  <div className="relative">
                    <MoviePoster
                      imageUrl={movie.img_path}
                      title={movie.title}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/60">
                      <PlayCircle
                        size={40}
                        className="text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-black/40">
                    <h3 className="truncate text-sm font-bold text-gray-200 group-hover:text-[#EAB8C9]">
                      {movie.title}
                    </h3>
                    <p className="mt-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                      {new Date(movie.purchase_date).getFullYear()} • Owned
                    </p>
                  </div>
                </button>
              ))}
        </div>
      </div>
    </div>
  );
}
