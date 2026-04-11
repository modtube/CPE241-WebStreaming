// Use this code at dbdiagram.io
// Full Version: Purchase Model + Premium Discount + Subtitles + Localization + Audit


// === กลุ่มการจัดการผู้ใช้งานและสมาชิก (User & Membership) ===
Table app_user {
 user_id int [pk, increment]
 username varchar(50) [unique, not null]
 email varchar(255) [unique, not null]
 user_password varchar(255) [not null]
 img_path varchar(150)
 register_date timestamp [default: `now()`]
 country_id int
 user_status varchar(20) [note: 'active, suspended, banned']
 user_role varchar(20) [note: 'admin, customer', default: 'customer']
}


Table membership_tier {
 tier_id int [pk, increment]
 tier_name varchar(50) [unique, not null]
 monthly_price numeric(10,2) [not null]
 discount_rate numeric(3,2) [note: 'เช่น 0.20 สำหรับลด 20%']
}


Table subscription_history {
 sub_id int [pk, increment]
 user_id int
 tier_id int
 start_date timestamp
 end_date timestamp
 payment_status varchar(20)
}


// === กลุ่มเนื้อหาและโครงสร้างสื่อ (Content Structure) ===
Table content {
 content_id int [pk, increment]
 title varchar(255) [not null]
 img_path varchar(150)
 content_description text
 release_date date
 price numeric(10,2) [note: 'ราคาตั้งต้นก่อนส่วนลด']
 content_type varchar(20) [note: 'Movie/TV Show']
 rating_id int
 country_id int
 create_date timestamp [default: `now()`]
 update_date timestamp
 create_by int
 update_by int
}


Table movie {
 content_id int [pk]
 run_time int
 curr_status varchar(50)
}


Table tv_show {
 content_id int [pk]
 curr_status varchar(50)
}


Table season {
 content_id int [pk]
 season_num int [pk]
 air_date date
 synopsis text
}


Table episode {
 episode_id int [pk, increment]
 content_id int
 season_num int
 episode_num int
 title varchar(150)
 synopsis text
 run_time int
}


// === กลุ่มทรัพยากรสื่อ (Media & Localization) ===
Table media_path {
 source_id int [pk, increment]
 content_id int
 episode_id int
 quality varchar(20) [note: '720p, 1080p, 4K']
 file_path varchar(255) [not null]
 priority int
}


Table content_resource {
 resource_id int [pk, increment]
 content_id int
 episode_id int
 language_id int
 lang_type varchar(20) [note: 'Subtitle หรือ Dub']
 file_path varchar(255) [not null]
 priority int
}


// === กลุ่มการเงินและคลังสื่อ (Financial & Library) ===
Table personal_library {
 library_id int [pk, increment]
 user_id int
 content_id int
 purchase_date timestamp [default: `now()`]
}


Table transaction_list {
 transaction_id int [pk, increment]
 user_id int
 transaction_date timestamp
 total_amount numeric(10,3) [not null]
 payment_method varchar(100)
 payment_status varchar(50)
}


Table transaction_detail {
 detail_id int [pk, increment]
 transaction_id int
 content_id int
 content_name varchar(255) [note: 'Snapshot']
 original_price numeric(10,3)
 discount_applied numeric(10,3)
 sold_price numeric(10,3)
}


// === กลุ่มการโต้ตอบและประวัติ (Interactions & History) ===
Table user_content {
 user_id int [pk]
 content_id int [pk]
 last_watch timestamp
 watch_status varchar(20) [note: 'Watching, Completed']
}


Table reviews {
 review_id int [pk, increment]
 user_id int
 content_id int
 rating numeric(2,1) [note: '1.0 - 5.0']
 comment_text text
 post_time timestamp
}


Table playlist {
 playlist_id int [pk, increment]
 user_id int
 playlist_name varchar(100)
 create_date timestamp
 visibility varchar(20) [note: 'Public, Unlisted, Hidden']
}


Table playlist_item {
 playlist_id int [pk]
 content_id int [pk]
 add_date timestamp
}


// === กลุ่มข้อมูลเสริมและ Master Data ===
Table person {
 person_id int [pk, increment]
 first_name varchar(100) [not null]
 last_name varchar(100) [not null]
 nationality varchar(100)
 birth_date date
 biography text
 create_date timestamp [default: `now()`]
 update_date timestamp
 create_by int
 update_by int
}


Table content_role {
 content_id int [pk]
 person_id int [pk]
 role_type varchar(50) [note: 'Director, Actor']
 character_name varchar(200)
}


Table genre {
 genre_id int [pk, increment]
 genre_name varchar(50) [unique]
}


Table content_genre {
 content_id int [pk]
 genre_id int [pk]
}


Table language_list {
 language_id int [pk, increment]
 language_name varchar(100)
 native_name varchar(100)
}


Table country {
 country_id int [pk, increment]
 country_name varchar(100) [unique]
 country_code varchar(10)
 primary_timezone_id int
}


Table timezone {
 timezone_id int [pk, increment]
 iana_name varchar(50)
}


Table content_rating {
 rating_id int [pk, increment]
 rating_label varchar(10)
 maturity_level int
}


// === ความสัมพันธ์ (Relationships) ===
Ref: app_user.country_id > country.country_id [delete: set null]
Ref: country.primary_timezone_id > timezone.timezone_id
Ref: content.rating_id > content_rating.rating_id
Ref: content.country_id > country.country_id
Ref: movie.content_id - content.content_id [delete: cascade]
Ref: tv_show.content_id - content.content_id [delete: cascade]
Ref: season.content_id > tv_show.content_id [delete: cascade]
Ref: episode.(content_id, season_num) > season.(content_id, season_num) [delete: cascade]
Ref: personal_library.user_id > app_user.user_id
Ref: personal_library.content_id > content.content_id
Ref: transaction_list.user_id > app_user.user_id
Ref: transaction_detail.transaction_id > transaction_list.transaction_id
Ref: transaction_detail.content_id > content.content_id
Ref: subscription_history.user_id > app_user.user_id
Ref: subscription_history.tier_id > membership_tier.tier_id
Ref: content_genre.content_id > content.content_id
Ref: content_genre.genre_id > genre.genre_id
Ref: content_role.content_id > content.content_id
Ref: content_role.person_id > person.person_id
Ref: media_path.content_id > content.content_id
Ref: media_path.episode_id > episode.episode_id
Ref: content_resource.content_id > content.content_id
Ref: content_resource.language_id > language_list.language_id
Ref: reviews.user_id > app_user.user_id
Ref: reviews.content_id > content.content_id
Ref: playlist.user_id > app_user.user_id
Ref: playlist_item.playlist_id > playlist.playlist_id
Ref: playlist_item.content_id > content.content_id
Ref: user_content.user_id > app_user.user_id
Ref: user_content.content_id > content.content_id


// Admin Audit Links
Ref: content.create_by > app_user.user_id
Ref: content.update_by > app_user.user_id
Ref: person.create_by > app_user.user_id
Ref: person.update_by > app_user.user_id
