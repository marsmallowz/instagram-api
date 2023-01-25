use insagram;
select * from photos;
select * from posts;

INSERT INTO posts(caption, user_id) VALUES("Halo Guys",3);

INSERT INTO photos(url, post_id) VALUES("https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",4);
INSERT INTO photos(url, post_id) VALUES("https://ik.imagekit.io/tvlk/blog/2020/01/keindahan-alam-indonesia-4-Wikipedia.jpg?tr=dpr-2,w-675",4);

INSERT INTO comments(comment, user_id, post_id) VALUES("Hi Juga",3, 4);
INSERT INTO comments(comment, user_id, post_id) VALUES("Hi",1, 4);

INSERT INTO bookmarks(user_id, post_id) VALUES(3, 4);
INSERT INTO likes(user_id, post_id) VALUES(3, 4);

-- fecth posts
SELECT * from posts where id = 4;
SELECT avatar_url, username from users where id = 3;
SELECT * from comments where post_id = 4;
SELECT count(*) as Comments from comments where post_id = 4;
SELECT * from likes where post_id = 4 AND user_id = 3;
SELECT count(*) from likes where post_id = 4 AND user_id = 2;
SELECT count(*) as Likes from likes where post_id = 4;
SELECT * from bookmarks where post_id = 4 AND user_id = 3;
SELECT * from bookmarks where post_id = 4 AND user_id = 2;

select * from branch b 
join students s on s.branch_id = b.id and s.firstname = 'uzumaki'
where b.branch = 'batam';

select * from posts p join users u on p.user_id = u.id where p.id = 4;

