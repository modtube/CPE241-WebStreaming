import DarkSelect from "./DarkSelect";

interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;
  genre: string;
  setGenre: (val: string) => void;
  ageRating: string;
  setAgeRating: (val: string) => void;
}

export default function FilterBar({
  search, setSearch, language, setLanguage, genre, setGenre, ageRating, setAgeRating
}: FilterBarProps) {
  return (
    <div className="px-10 py-5 flex items-center gap-4 flex-wrap border-b border-white/5 bg-[#0d0d0d]">
      <div className="relative flex-1 min-w-[250px]">
        {/* Search Icon */}
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#161616] border border-white/5 rounded-lg pl-11 pr-4 py-2.5 text-sm text-white focus:border-[#a3526d]/50 focus:outline-none transition-colors"
        />
      </div>
      <div className="flex gap-3">
        <DarkSelect value={language}  onChange={setLanguage}  label="All Languages" options={["English","Thai","Japanese","Korean","French"]} />
        <DarkSelect value={genre}     onChange={setGenre}     label="All Genres"    options={["Action","Thriller","Drama","Comedy","Horror","Sci-Fi","Romance"]} />
        <DarkSelect value={ageRating} onChange={setAgeRating} label="All Ratings"   options={["G","PG","PG-13","R","NC-17"]} />
      </div>
    </div>
  );
}