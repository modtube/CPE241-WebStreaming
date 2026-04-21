// Use this code at dbdiagram.io
// https://miro.com/app/board/uXjVHemKxjw=/?share_link_id=667222274645

Table movie {
  movie_id int [pk, increment]
  title varchar(255) [not null]
  img_path varchar(150)
  movie_description text
  release_date date
  price numeric(10,2) [not null, default: 0]
  rating_id int [not null]
  country_code int
  create_date timestamptz [default: `now()`]
  update_date timestamptz [not null, default: `now()`]
}

Table movie_rating {
  rating_id int [pk, increment]
  rating_label varchar(10) [unique, not null]
  maturity_level int [not null]
  rating_description text
}
Ref: movie.rating_id > movie_rating.rating_id


Table genre {
  genre_id int [pk, increment]
  genre_name varchar(50) [unique, not null]
}

Table movie_genre {
  movie_id int [pk]
  genre_id int [pk]
}
Ref: movie_genre.movie_id > movie.movie_id [delete: cascade]
Ref: movie_genre.genre_id > genre.genre_id [delete: cascade]


Table language_list {
  language_id int [pk, increment]
  language_name varchar(100) [unique, not null]
  native_name varchar(100) [not null]
}

Table movie_resource {
  movie_id int [not null]
  language_id int [not null]
  lang_type varchar(50) [not null, note: 'Audio, Subtitle']
  file_path varchar(255) [not null]
  priority int [not null, default: 1]
    indexes {
    (movie_id, language_id, lang_type) [pk]
  }
}
Ref: movie_resource.language_id > language_list.language_id [delete: cascade]
Ref: movie_resource.movie_id > movie.movie_id [delete: cascade]

Table media_path {
  source_id int [pk, increment]
  movie_id int [pk]
  quality varchar(50) [not null, note: 'SD, HD, FHD, QHD, 2K, UHD, FUHD']
  file_path varchar(255) [not null]
  priority int [not null, default: 1]
}
Ref: media_path.movie_id > movie.movie_id [delete: cascade]

Table person {
  person_id int [pk, increment]
  img_path varchar(150)
  first_name varchar(100) [not null]
  middle_name varchar(100)
  last_name varchar(100) [not null]
  nationality varchar(100) [not null]
  birth_date date [not null]
  birth_place varchar(100) [not null]
  biography text
  create_date timestamptz [not null, default: `now()`]
  update_date timestamptz [default: `now()`]
}

Table movie_role {
  movie_id int [pk]
  person_id int [pk]
  role_type varchar(100) [pk, note: 'Actor, Director, Producer, Crew']
  character_name varchar(200)
}
Ref: movie_role.person_id > person.person_id [delete: cascade]
Ref: movie_role.movie_id > movie.movie_id [delete: cascade]

Table app_user {
  user_id int [pk, increment]
  username varchar(50) [unique, not null]
  email varchar(255) [unique, not null]
  img_path varchar(150)
  user_password varchar(255) [not null]
  register_date timestamptz [not null, default: `now()`]
  country_code int
  user_status varchar(50) [not null, note: 'active, suspended, banned']
  user_role varchar(20) [default: 'customer', note: 'admin, customer']
}

Table personal_library {
  user_id int [not null]
  movie_id int [not null]
  purchase_date timestamptz [default: `now()`]
  indexes {
    (user_id, movie_id) [pk]
  }
}
Ref: personal_library.user_id > app_user.user_id [delete: cascade]
Ref: personal_library.movie_id > movie.movie_id [delete: cascade]

Table reviews {
  review_id int [pk, increment]
  user_id int
  movie_id int [not null]
  rating numeric(2,1) [not null]
  comment_text text
  post_time timestamptz [not null, default: `now()`]
  post_status varchar(100) [not null, note: 'Published, Hidden, Removed']
}
Ref: reviews.user_id > app_user.user_id [delete: set null]
Ref: reviews.movie_id > movie.movie_id [delete: cascade]


Table transaction_list {
  transaction_id int [pk, increment]
  user_id int
  transaction_date timestamptz [not null, default: `now()`]
  total_amount numeric(10,3) [not null, default: 0]
  payment_method varchar(100) [not null, note: 'credit_card, debit_card, paypal, bank_transfer']
  payment_status varchar(100) [not null, note: 'Completed, Pending, Refunded, Cancelled']
}
Ref: transaction_list.user_id > app_user.user_id [delete: set null]

Table transaction_detail {
  detail_id int [pk, increment]
  transaction_id int [not null]
  movie_id int
  movie_name varchar(255) [not null]
  original_price numeric(10,3)
  discount_applied numeric(10,3)
  sold_price numeric(10,3) [not null, default: 0]
}
Ref: transaction_detail.transaction_id > transaction_list.transaction_id [delete: cascade]
Ref: transaction_detail.movie_id > movie.movie_id [delete: set null]

Table playlist {
  user_id int [not null]
  playlist_name varchar(100) [not null]
  create_date timestamptz [not null, default: `now()`]
  visibility varchar(100) [not null, note: 'Public, Unlisted, Hidden']
  
  indexes {
    (user_id, playlist_name) [pk]
  }
}
Ref: playlist.user_id > app_user.user_id [delete: cascade]

Table playlist_item {
  playlist_name int [not null]
  user_id int [not null]
  movie_id int [not null]
  add_date timestamptz [not null, default: `now()`]

  indexes {
    (user_id, playlist_name, movie_id) [pk]
  }
}
Ref: playlist_item.(user_id, playlist_name) > playlist.(user_id, playlist_name) [delete: cascade]
Ref: playlist_item.movie_id > movie.movie_id [delete: cascade]

Table country {
  country_name varchar(100) [unique, not null]
  country_code varchar(10) [pk, not null]
}
Ref: app_user.country_code > country.country_code [delete: set null]
Ref: movie.country_code > country.country_code [delete: set null]