-- SQL table definitions for Team Pictor Group project



DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `post`;
DROP TABLE IF EXISTS `request`;
DROP TABLE IF EXISTS `server`;

CREATE TABLE `user` (
    `id` int NOT NULL AUTO_INCREMENT,
    `first_name` varchar(255) NOT NULL,
    `last_name` varchar(255) NOT NULL,
    `email` varchar(320) NOT NULL,
    `password` binary(60) NOT NULL,
    `location` varchar(255) NOT NULL,
    `public_key` varchar(2048) NOT NULL,
    `json_block` json,
    `sounds_like` varchar(255), 
    PRIMARY KEY(`id`),
    UNIQUE KEY(`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `post` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `title` varchar(500),
    `body` varchar(2000),
    `date` datetime,
    `url` varchar(255),
    `post_type` varchar(255),
    `encrypted` tinyint(1),
    PRIMARY KEY(`id`),
    CONSTRAINT `post_ibfk_1` FOREIGN KEY (`user_id`)
    REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `request` (
    `id` int NOT NULL AUTO_INCREMENT,
    `sender_id` int NOT NULL,
    `receiver_id` int NOT NULL,
    `accepted_date` datetime,
    `date` datetime,
    `req_accepted` tinyint(1),
    `blocked` tinyint(1),
    PRIMARY KEY(`id`),
    CONSTRAINT `request_ibfk_1` FOREIGN KEY (`sender_id`)
    REFERENCES `user`(`id`),
    CONSTRAINT `request_ibfk_2` FOREIGN KEY (`receiver_id`)
    REFERENCES `user`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `server`(
  `id` int NOT NULL AUTO_INCREMENT,
  `public_key` varchar(3000),
  `private_key` varchar(3000),
  PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=latin1;
