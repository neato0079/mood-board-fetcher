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

10/22
- the `.sql` from the `mysqldump` command contained some `CONSTRAINT` statements that were causing errors:
    ```
    CONSTRAINT "test_word_img_ibfk_2"
    ```
    Idk what `ibfk` is. I don't remember writing this statement when creating the schema for the original `MySQL` db but that was like 3 years ago now. Anyway I deleted the statements that contain these `CONSTRAINT` commands and then re-ran the `./mysql2sqlite` script again, and all the `test...` tables made it into the resulting `SQLite3` compatible `.db` file. I still need to make sure all the existing `SQL` statements in `database.js` work, and that should tell me if there are anymore issues with the `.db` file