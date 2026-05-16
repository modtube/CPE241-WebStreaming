import { useState, useEffect } from "react";
import { message } from "antd";
// 🟢 นำเข้า MovieCard และ MoviePlayerOverlay
import MovieCard from "../../components/customer/MovieCard";
import MoviePlayerOverlay from "../../components/customer/MoviePlayerOverlay";

// --- Types ---
type MovieInLibrary = {
  movie_id: string;
  title: string;
  img_path: string;
  purchase_date: string;
  price?: string | number;
  average_rating?: number;
};

type LanguageMap = { [key: string]: string };
type PersonMap = { [key: string]: string };

export default function PersonalLibrary() {
  const [library, setLibrary] = useState<MovieInLibrary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  const [languageMap, setLanguageMap] = useState<LanguageMap>({});
  const [personMap, setPersonMap] = useState<PersonMap>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const libRes = await fetch(
          "http://localhost:5000/api/customer/my-movies",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const libData: MovieInLibrary[] = await libRes.json();

        // ยิง /api/movies/:id ขนานกันเพื่อเอา price + average_rating
        const enriched = await Promise.all(
          libData.map(async (m) => {
            try {
              const detailRes = await fetch(
                `http://localhost:5000/api/movies/${m.movie_id}`,
              );
              const detail = await detailRes.json();
              return {
                ...m,
                price: detail.price,
                average_rating: detail.average_rating,
              };
            } catch {
              return m;
            }
          }),
        );
        setLibrary(enriched);

        const langRes = await fetch("http://localhost:5000/api/languages");
        const langData = await langRes.json();
        setLanguageMap(
          langData.reduce(
            (acc: any, curr: any) => ({
              ...acc,
              [curr.language_id]: curr.language_name,
            }),
            {},
          ),
        );

        const personRes = await fetch("http://localhost:5000/api/persons");
        const personData = await personRes.json();
        setPersonMap(
          personData.reduce(
            (acc: any, curr: any) => ({
              ...acc,
              [curr.person_id]: curr.person_name,
            }),
            {},
          ),
        );
      } catch (error) {
        message.error("ไม่สามารถโหลดข้อมูลคลังภาพยนตร์ได้");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-20">
      <div className="mx-auto max-w-7lg">
        <header className="mb-12 border-b border-white/5 pb-8">
          <h1 className="text-4xl font-black tracking-tighter text-white">
            PERSONAL <span className="text-[#A3526D]">LIBRARY</span>
          </h1>
          <p className="mt-2 text-zinc-500 font-medium">
            คลังภาพยนตร์ส่วนตัวของคุณทั้งหมด ({library.length} เรื่อง)
          </p>
        </header>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {loading
            ? [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] animate-pulse rounded-2xl bg-zinc-900"
                />
              ))
            : library.map((movie) => (
                <MovieCard
                  key={movie.movie_id}
                  movie={{
                    movie_id: movie.movie_id,
                    title: movie.title,
                    poster: movie.img_path,
                    year: new Date(movie.purchase_date).getFullYear(),
                    genre: "Owned", // แสดงสถานะว่าครอบครองแล้ว
                    price: movie.price ?? 0,
                    score: movie.average_rating ?? 0,
                    stars: Math.round(movie.average_rating ?? 0), // ปัดเป็นจำนวนเต็มสำหรับดาว
                    rating: 5, // ค่า default
                  }}
                  isLibraryView={true}
                  onClick={() => setSelectedMovieId(movie.movie_id)}
                  // ในหน้า Library เราไม่ต้องการปุ่ม Add to Cart
                  // คุณอาจปรับ MovieCard.tsx ให้ซ่อนปุ่มนี้หากไม่ส่ง onAddToCart เข้าไป
                  onAddToCart={(e) => e.stopPropagation()}
                  inCart={false}
                />
              ))}
        </div>

        {selectedMovieId && (
          <MoviePlayerOverlay
            movieId={selectedMovieId}
            onClose={() => setSelectedMovieId(null)}
            languageMap={languageMap}
            personMap={personMap}
          />
        )}

        {!loading && library.length === 0 && (
          <div className="col-span-full py-24 text-center">
            <div className="text-4xl mb-4 opacity-20">🎬</div>
            <p className="text-zinc-500 italic">
              คุณยังไม่มีภาพยนตร์ในคลังส่วนตัว
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
