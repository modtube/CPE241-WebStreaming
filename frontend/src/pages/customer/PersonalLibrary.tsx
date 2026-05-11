import { useState, useEffect } from "react";
import { message } from "antd";

// 🟢 1. กำหนด Interface ให้ตรงกับข้อมูลที่ได้จาก API
type MovieInLibrary = {
  movie_id: string;
  title: string;
  img_path: string;
  purchase_date: string;
};

// 🟢 2. Component สำหรับแสดงรูป Poster พร้อมระบบ Fallback
// ใส่ pointer-events-none เพื่อให้การคลิกทะลุไปยังปุ่มแม่ได้เสมอ
function MoviePoster({ imageUrl, title }: { imageUrl: string; title: string }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative aspect-[2/3] overflow-hidden bg-[#1a1a1a] flex items-center justify-center pointer-events-none">
      {/* แสดง Skeleton ระหว่างโหลด */}
      {isLoading && !isError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#181818] via-[#242024] to-[#0b0b0b]" />
      )}

      {/* กรณีโหลดรูปไม่ขึ้น (Fallback) */}
      {isError ? (
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <span className="text-gray-600 text-[20px] uppercase font-bold tracking-widest mb-2">
            {title}
          </span>
          <div className="text-gray-500 text-[20px] border border-gray-700 px-2 py-1 rounded">
            img not rendered
          </div>
        </div>
      ) : (
        <img
          src={`http://localhost:5000${imageUrl}`}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
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
  const [selectedMovie, setSelectedMovie] = useState<MovieInLibrary | null>(
    null,
  );

  // 🟢 3. ฟังก์ชันดึงข้อมูลจาก API
  const fetchLibrary = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/customer/my-movies",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401 || response.status === 403) {
        message.error("Session expired. Please login again.");
        return;
      }

      const result = await response.json();
      // รองรับทั้งแบบ result เป็น array หรืออยู่ใน field data
      setMovies(result.data || result);
    } catch (error) {
      console.error("Fetch Error:", error);
      message.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  // 🟢 4. ส่วนแสดง Video Player (เมื่อกดเลือกหนัง)
  if (selectedMovie) {
    return (
      <div className="fixed inset-y-0 left-64 right-0 overflow-y-auto bg-black text-white z-50">
        <div className="p-8">
          <button
            onClick={() => setSelectedMovie(null)}
            className="mb-6 text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>←</span> Back to Library
          </button>

          <div className="mx-auto max-w-5xl">
            {/* Video Placeholder Section */}
            <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="h-20 w-20 flex items-center justify-center rounded-full bg-[#A3526D] text-white text-3xl shadow-xl hover:scale-110 transition-transform">
                  ▶
                </button>
              </div>
              <div className="absolute top-6 left-6">
                <h3 className="text-xl font-bold drop-shadow-md">
                  {selectedMovie.title}
                </h3>
                <span className="text-xs text-[#EAB8C9] bg-[#A3526D]/20 px-2 py-1 rounded border border-[#A3526D]/30 mt-2 inline-block">
                  Premium Quality
                </span>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-3xl font-bold">{selectedMovie.title}</h2>
              <p className="text-gray-400 mt-2">
                Purchased on:{" "}
                {new Date(selectedMovie.purchase_date).toLocaleDateString(
                  "th-TH",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </p>
              <div className="mt-6 p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
                <h4 className="text-sm font-bold uppercase tracking-widest text-[#A3526D] mb-2">
                  Synopsis
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  เนื้อหาจำลองสำหรับหนังเรื่อง {selectedMovie.title}{" "}
                  ระบบกำลังเตรียมไฟล์วิดีโอเพื่อการรับชม...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🟢 5. หน้าหลักของคลังหนัง
  return (
    <div className="fixed inset-y-0 left-64 right-0 overflow-y-auto bg-black text-white">
      <div className="p-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Personal Library</h2>
            <p className="mt-1 text-sm text-gray-400">
              เข้าชมภาพยนตร์ทั้งหมดที่คุณเป็นเจ้าของ
            </p>
          </div>
          <div className="px-4 py-2 bg-[#A3526D]/10 border border-[#A3526D]/30 rounded-xl text-[#EAB8C9] text-sm font-bold">
            {movies.length} Movies Owned
          </div>
        </div>

        {/* Search Bar Placeholder */}
        <div className="mb-8 group">
          <input
            type="text"
            placeholder="ค้นหาหนังในคลังของคุณ..."
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#A3526D] focus:ring-1 focus:ring-[#A3526D] transition-all"
          />
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading ? (
            // Skeleton Loading State
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] rounded-2xl bg-zinc-900 animate-pulse"
              />
            ))
          ) : movies.length > 0 ? (
            movies.map((movie) => (
              <button
                key={movie.movie_id}
                onClick={() => setSelectedMovie(movie)}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 text-left transition-all hover:-translate-y-2 hover:border-[#A3526D]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                {/* Poster Wrapper */}
                <div className="relative">
                  <MoviePoster imageUrl={movie.img_path} title={movie.title} />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/60">
                    <div className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-[#A3526D] opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 shadow-xl text-white">
                      ▶
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="truncate text-sm font-bold text-white group-hover:text-[#EAB8C9] transition-colors">
                    {movie.title}
                  </h3>
                  <p className="mt-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    {new Date(movie.purchase_date).getFullYear()} • Owned
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className="text-4xl mb-4">🎬</div>
              <p className="text-zinc-500 italic">
                คุณยังไม่มีภาพยนตร์ในคลังส่วนตัว
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
