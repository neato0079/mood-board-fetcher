Errors from `mysql2sqlite`:
```
➜  ~ ./mysql2sqlite art_ref_db_dump.sql | sqlite3 art_ref_sqlite3.db
memory
Parse error near line 24: near ",": syntax error
  DEFAULT NULL ,  "image_id" integer DEFAULT NULL , ,  CONSTRAINT "image_artist_
                                      error here ---^
Parse error near line 32: near ",": syntax error
  DEFAULT NULL ,  "image_id" integer DEFAULT NULL , ,  CONSTRAINT "image_genre_i
                                      error here ---^
Parse error near line 40: near ",": syntax error
  DEFAULT NULL ,  "image_id" integer DEFAULT NULL , ,  CONSTRAINT "image_ip_ibfk
                                      error here ---^
Parse error near line 48: near ",": syntax error
  DEFAULT NULL ,  "image_id" integer DEFAULT NULL , ,  CONSTRAINT "image_key_wor
                                      error here ---^
Parse error near line 74: near ",": syntax error
  DEFAULT NULL ,  "image_id" integer DEFAULT NULL , ,  CONSTRAINT "test_ass_ibfk
                                      error here ---^
Parse error near line 82: no such table: test_ass
Parse error near line 97: near ",": syntax error
  DEFAULT NULL ,  "image_id" integer DEFAULT NULL , ,  CONSTRAINT "test_word_img
                                      error here ---^
Parse error near line 105: no such table: test_word_img
Parse error near line 106: no such table: main.
Parse error near line 107: no such table: main.
Parse error near line 108: no such table: main.
Parse error near line 109: no such table: main.
Parse error near line 110: no such table: main.
Parse error near line 111: no such table: main.
Parse error near line 112: no such table: main.
Parse error near line 113: no such table: main.
Parse error near line 114: no such table: main.
Parse error near line 115: no such table: main.
Parse error near line 116: no such table: main.
Parse error near line 117: no such table: main.
```