Migrate MySQL to SQLite3:

- (done 10/17) use `mysqldump` to create an `SQLite3` file:

    https://stackoverflow.com/questions/5164033/export-a-mysql-database-to-sqlite-database
- (done 10/21) use shell script to converte file to `SQLite`:

    https://github.com/mysql2sqlite/mysql2sqlite

- Run some `SQL` statements to test if it worked?

10/21:

- `MySQL` `.sql` file converted to `SQLite` `.db` file
- not all tables made it into the `.db` file. See [error notes](/error-notes.md)
- `.sql` file tables: 
```
mysql> SHOW TABLES;
+----------------------+
| Tables_in_art_ref_db |
+----------------------+
| artist               |
| genre                |
| image                |
| image_artist         |
| image_genre          |
| image_ip             |
| image_key_word       |
| ip                   |
| key_word             |
| test_artist          |
| test_ass             |
| test_img             |
| test_word            |
| test_word_img        |
+----------------------+
```
- `.db` tables:
```
sqlite> .tables
artist       
genre        
image        
ip           
key_word     
test_artist  
test_img
test_word
```