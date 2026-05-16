import { useState, useEffect } from "react";
import { Settings, Languages, Info, PlayCircle } from "lucide-react";
import { message } from "antd";

// --- Types ---
type MediaFile = { quality: string; file_path: string; priority: number };
type Resource = {
  type: "Subtitle" | "Audio";
  file_path: string;
  language_id: string;
  language_name: string;
  priority: number;
};
type CastCrew = {
  person_id: string;
  first_name: string;
  last_name: string;
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
type PersonMap = { [key: string]: string };

type MoviePlayerOverlayProps = {
  movieId: string;
  onClose: () => void;
  languageMap?: LanguageMap;
  personMap?: PersonMap;
};

export default function MoviePlayerOverlay({
  movieId,
  onClose,
  languageMap = {},
  personMap = {},
}: MoviePlayerOverlayProps) {
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuality, setCurrentQuality] = useState<string>("");
  const [currentAudio, setCurrentAudio] = useState<string>("");
  const [currentSub, setCurrentSub] = useState<string>("None");

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/movies/${movieId}`);
        const data: MovieDetail = await res.json();
        setMovieDetail(data);

        // ตั้งค่า default quality เป็นไฟล์แรก
        if (data.media_files.length > 0) {
          setCurrentQuality(data.media_files[0].quality);
        }

        // ตั้งค่า default audio เป็น Audio resource แรก
        const firstAudio = data.resources.find((r) => r.type === "Audio");
        if (firstAudio) setCurrentAudio(firstAudio.language_id);
      } catch (error) {
        message.error("ไม่สามารถโหลดรายละเอียดหนังได้");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  // Helper: หา language label จาก language_id โดยใช้ resources ก่อน, fallback ไป languageMap
  const getLanguageLabel = (languageId: string): string => {
    if (!movieDetail) return languageMap[languageId] || languageId;
    const fromResource = movieDetail.resources.find(
      (r) => r.language_id === languageId,
    );
    return fromResource?.language_name || languageMap[languageId] || languageId;
  };

  // Helper: หาชื่อบุคคลจาก cast_and_crew ก่อน, fallback ไป personMap
  const getPersonName = (person: CastCrew): string => {
    if (person.first_name && person.last_name) {
      return `${person.first_name} ${person.last_name}`;
    }
    return personMap[person.person_id] || "Unknown Person";
  };

  if (loading || !movieDetail) {
    return (
      <div className="fixed inset-y-0 left-64 right-0 overflow-y-auto bg-[#0a0a0a] text-white z-50">
        <div className="p-8 max-w-6xl mx-auto">
          <button
            onClick={onClose}
            className="mb-6 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>←</span> Back to Library
          </button>
          <div className="aspect-video rounded-3xl bg-zinc-900 animate-pulse" />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="h-10 w-2/3 rounded-lg bg-zinc-900 animate-pulse" />
              <div className="h-20 w-full rounded-lg bg-zinc-900 animate-pulse" />
            </div>
            <div className="h-48 rounded-3xl bg-zinc-900 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const currentVideo = movieDetail.media_files.find(
    (f) => f.quality === currentQuality,
  );

  return (
    <div className="fixed inset-y-0 left-64 right-0 overflow-y-auto bg-[#0a0a0a] text-white z-50">
      <div className="p-8 max-w-6xl mx-auto">
        <button
          onClick={onClose}
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
                            Audio: {r.language_name}
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
                            Sub: {r.language_name}
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
                    <span className="text-sm font-bold text-white">
                      {getPersonName(person)}
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
                  {currentAudio
                    ? getLanguageLabel(currentAudio)
                    : "System Default"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Subtitle</span>
                <span className="text-white">
                  {currentSub === "None" ? "Off" : getLanguageLabel(currentSub)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
