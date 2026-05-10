import express from "express";
import {
  deleteMovieById,
  getAllMovies,
  getMovieDetailById,
  createMovie,
  updateMovie,
} from "../controllers/movieController.js"; // อย่าลืม .js

const router = express.Router();

// เมื่อมีคนเรียก GET http://localhost:5000/api/movies?[...]
router.get("/", getAllMovies);

// เมื่อมีคนเรียก GET http://localhost:5000/api/movies/[...]
router.get("/:id", getMovieDetailById);

// เมื่อมีคนเรียก DELETE  http://localhost:5000/api/movies/[...]
router.delete("/:id", deleteMovieById);

// เมื่อมีคนเรียก POST  http://localhost:5000/api/movies
router.post("/", createMovie);

/* ตัวอย่างโครงสร้างตอนสร้างหนังใหม่

{
    "title": "Inception",
    "img_path": "/img/movies/inception.jpg",
    "movie_description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    "release_date": "2010-07-16",
    "price": 299.00,
    "rating_id": 3, 
    "country_code": "US",
    "genres": [1, 2, 3], 
    "media_files": [
        {
            "quality": "FHD",
            "file_path": "/media/inception_1080p.mp4",
            "priority": 1
        },
        {
            "quality": "UHD",
            "file_path": "/media/inception_4k.mp4",
            "priority": 2
        }
    ],
    "resources": [
        {
            "type": "Subtitle",
            "file_path": "/resources/inception_th_sub.srt",
            "language_id": 1,
            "priority": 1
        },
        {
            "type": "Audio",
            "file_path": "/resources/inception_en_audio.mp3",
            "language_id": 2,
            "priority": 1
        }
    ],
    "cast_and_crew": [
        {
            "person_id": 1, 
            "role_type": "Director"
        },
        {
            "person_id": 20, 
            "role_type": "Actor"
        }
    ]
}
*/

// เมื่อมีคนเรียก PUT  http://localhost:5000/api/movies
router.put("/:id", updateMovie);

/* ตัวอย่างโครงสร้างตอนอัปเดทหนังจะเหมือนกับ POST เลย */

export default router;
