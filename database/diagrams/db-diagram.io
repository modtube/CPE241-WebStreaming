// Use this code at dbdiagram.io

// === กลุ่มการจัดการผู้ใช้งานและสมาชิก (User & Membership) ===
Table app_user {
  user_id int [pk, increment]
  username varchar(50) [unique, not null]
  email varchar(255) [unique, not null]
  img_path varchar(150)
  user_password varchar(255) [not null]
  register_date timestamptz [not null, default: `now()`]
  country_id int
  tier_id int [not null]
  user_status varchar(50) [not null, note: 'active, suspended, banned']
  user_role varchar(20) [default: 'customer', note: 'admin, customer']
}

Table membership_tier {
  tier_id int [pk, increment]
  tier_name varchar(50) [unique, not null]
  monthly_price numeric(10,2) [not null]
  discount_rate numeric(3,2)
  duration_days int [not null]
  description text
}

Table subscription_history {
  detail_id int [pk, increment]
  transaction_id int [not null]
  tier_id int
  tier_name varchar(50) [not null]
  start_date date [not null]
  end_date date [not null]
  sold_price numeric(10,3) [not null]
}

// === กลุ่มเนื้อหาและโครงสร้างสื่อ (Content Structure) ===
Table content {
  content_id int [pk, increment]
  title varchar(255) [not null]
  img_path varchar(150)
  content_description text
  release_date date
  price numeric(10,2) [not null, default: 0]
  content_type varchar(50) [not null, note: 'Movie/TV Show']
  rating_id int [not null]
  country_id int
  create_date timestamptz [default: `now()`]
  update_date timestamptz [not null, default: `now()`]
  create_by int
  update_by int [not null]
}

Table movie {
  content_id int [pk]
  curr_status varchar(100) [not null, note: 'Unreleased, Released']
  run_time int [not null]
}

Table tv_show {
  content_id int [pk]
  curr_status varchar(100) [not null, note: 'Not aired, Airing, Off']
}

Table season {
  content_id int [pk]
  season_num int [pk]
  air_date date [not null]
  synopsis text
}

Table episode {
  content_id int [pk]
  season_num int [pk]
  episode_num int [pk]
  episode_id int [unique, not null, increment]
  title varchar(150) [not null]
  synopsis text
  run_time int
}

// === กลุ่มทรัพยากรสื่อ (Media & Localization) ===
Table media_path {
  source_id int [pk, increment]
  content_id int [not null]
  episode_id int
  quality varchar(50) [not null, note: 'SD, HD, FHD, QHD, 2K, UHD, FUHD']
  file_path varchar(255) [not null]
  priority int [not null, default: 1]
}

Table content_resource {
  resource_id int [pk, increment]
  content_id int [not null]
  episode_id int
  language_id int [not null]
  lang_type varchar(50) [not null, note: 'Audio, Subtitle']
  file_path varchar(255) [not null]
  priority int [not null, default: 1]
}

// === กลุ่มการเงินและคลังสื่อ (Financial & Library) ===
Table personal_library {
  library_id int [pk, increment]
  user_id int [not null]
  content_id int [not null]
  purchase_date timestamptz [default: `now()`]
}

Table transaction_list {
  transaction_id int [pk, increment]
  user_id int
  transaction_date timestamptz [not null, default: `now()`]
  total_amount numeric(10,3) [not null, default: 0]
  payment_method varchar(100) [not null, note: 'credit_card, debit_card, paypal, bank_transfer']
  payment_status varchar(100) [not null, note: 'Completed, Pending, Refunded, Cancelled']
}

Table transaction_detail {
  detail_id int [pk, increment]
  transaction_id int [not null]
  content_id int
  content_name varchar(255) [not null]
  original_price numeric(10,3)
  discount_applied numeric(10,3)
  sold_price numeric(10,3) [not null, default: 0]
}

// === กลุ่มการโต้ตอบและประวัติ (Interactions & History) ===
Table user_content {
  user_id int [pk]
  content_id int [pk]
  last_watch timestamptz
  watch_status varchar(100) [note: 'Unwatched, Unfinished, Finished']
}

Table reviews {
  review_id int [pk, increment]
  user_id int
  content_id int [not null]
  rating numeric(2,1) [not null]
  comment_text text
  post_time timestamptz [not null, default: `now()`]
  post_status varchar(100) [not null, note: 'Published, Hidden, Removed']
}

Table playlist {
  playlist_id int [not null]
  user_id int [not null]
  playlist_name varchar(100) [not null]
  create_date timestamptz [not null, default: `now()`]
  visibility varchar(100) [not null, note: 'Public, Unlisted, Hidden']
  
  indexes {
    (user_id, playlist_id) [pk]
  }
}

Table playlist_item {
  playlist_id int [not null]
  user_id int [not null]
  content_id int [not null]
  add_date timestamptz [not null, default: `now()`]

  indexes {
    (user_id, playlist_id, content_id) [pk]
  }
}

// === กลุ่มข้อมูลเสริมและ Master Data ===
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
  create_by int [not null]
  update_by int
}

Table content_role {
  content_id int [pk]
  person_id int [pk]
  role_type varchar(100) [not null, note: 'Actor, Director, Producer, Crew']
  character_name varchar(200)
}

Table genre {
  genre_id int [pk, increment]
  genre_name varchar(50) [unique, not null]
}

Table content_genre {
  content_id int [pk]
  genre_id int [pk]
}

Table language_list {
  language_id int [pk, increment]
  language_name varchar(100) [unique, not null]
  native_name varchar(100) [not null]
}

Table country {
  country_id int [pk, increment]
  country_name varchar(100) [unique, not null]
  country_code varchar(10) [not null]
  primary_timezone_id int
}

Table timezone {
  timezone_id int [pk, increment]
  iana_name varchar(50) [unique, not null]
  current_offset varchar(10) [not null]
  abbreviation varchar(10) [not null]
}

Table content_rating {
  rating_id int [pk, increment]
  rating_label varchar(10) [unique, not null]
  maturity_level int [not null]
  rating_description text
}

// === ความสัมพันธ์ (Relationships) ===
Ref: app_user.country_id > country.country_id [delete: set null]
Ref: app_user.tier_id > membership_tier.tier_id
Ref: country.primary_timezone_id > timezone.timezone_id
Ref: content.rating_id > content_rating.rating_id
Ref: content.country_id > country.country_id [delete: set null]
Ref: movie.content_id - content.content_id [delete: cascade]
Ref: tv_show.content_id - content.content_id [delete: cascade]
Ref: season.content_id > tv_show.content_id [delete: cascade]
Ref: episode.(content_id, season_num) > season.(content_id, season_num) [delete: cascade]
Ref: personal_library.user_id > app_user.user_id [delete: cascade]
Ref: personal_library.content_id > content.content_id [delete: cascade]
Ref: transaction_list.user_id > app_user.user_id [delete: set null]
Ref: transaction_detail.transaction_id > transaction_list.transaction_id [delete: cascade]
Ref: transaction_detail.content_id > content.content_id [delete: set null]
Ref: subscription_history.transaction_id > transaction_list.transaction_id [delete: cascade]
Ref: subscription_history.tier_id > membership_tier.tier_id [delete: set null]
Ref: content_genre.content_id > content.content_id [delete: cascade]
Ref: content_genre.genre_id > genre.genre_id [delete: cascade]
Ref: content_role.content_id > content.content_id [delete: cascade]
Ref: content_role.person_id > person.person_id [delete: cascade]
Ref: media_path.content_id > content.content_id [delete: cascade]
Ref: media_path.episode_id > episode.episode_id [delete: cascade]
Ref: content_resource.content_id > content.content_id [delete: cascade]
Ref: content_resource.episode_id > episode.episode_id [delete: cascade]
Ref: content_resource.language_id > language_list.language_id [delete: cascade]
Ref: reviews.user_id > app_user.user_id [delete: set null]
Ref: reviews.content_id > content.content_id [delete: cascade]
Ref: playlist.user_id > app_user.user_id [delete: cascade]
Ref: playlist_item.(user_id, playlist_id) > playlist.(user_id, playlist_id) [delete: cascade]
Ref: playlist_item.content_id > content.content_id [delete: cascade]
Ref: user_content.user_id > app_user.user_id [delete: cascade]
Ref: user_content.content_id > content.content_id [delete: cascade]

// Admin Audit Links
Ref: content.create_by > app_user.user_id
Ref: content.update_by > app_user.user_id
Ref: person.create_by > app_user.user_id
Ref: person.update_by > app_user.user_id