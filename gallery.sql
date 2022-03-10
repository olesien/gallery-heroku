-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: gallery
-- ------------------------------------------------------
-- Server version	5.7.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `albums`
--

DROP TABLE IF EXISTS `albums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `albums` (
  `title` varchar(100) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `albums`
--

LOCK TABLES `albums` WRITE;
/*!40000 ALTER TABLE `albums` DISABLE KEYS */;
INSERT INTO `albums` VALUES ('The first collection',1,1),('Infinite Album',3,3),('Infinite Album',4,3),('Destroy Me Album',6,3),('Confetti Photos',9,5),('Confetti Photos 3',11,5);
/*!40000 ALTER TABLE `albums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `albums_photos`
--

DROP TABLE IF EXISTS `albums_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `albums_photos` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `album_id` int(11) NOT NULL,
  `photo_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `album_id` (`album_id`),
  KEY `photo_id` (`photo_id`),
  CONSTRAINT `albums_photos_ibfk_1` FOREIGN KEY (`album_id`) REFERENCES `albums` (`id`),
  CONSTRAINT `albums_photos_ibfk_2` FOREIGN KEY (`photo_id`) REFERENCES `photos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `albums_photos`
--

LOCK TABLES `albums_photos` WRITE;
/*!40000 ALTER TABLE `albums_photos` DISABLE KEYS */;
INSERT INTO `albums_photos` VALUES (1,1,4),(3,3,5),(4,3,6),(7,3,8),(8,3,9),(10,3,11),(11,3,12),(13,3,17),(14,3,18),(15,3,3),(16,3,4),(17,4,4);
/*!40000 ALTER TABLE `albums_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photos`
--

DROP TABLE IF EXISTS `photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `url` varchar(255) NOT NULL,
  `comment` varchar(100) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photos`
--

LOCK TABLES `photos` WRITE;
/*!40000 ALTER TABLE `photos` DISABLE KEYS */;
INSERT INTO `photos` VALUES (3,'The first level','www.goodimages.com/the-first-level','The best level',1),(4,'The second level','www.goodimages.com/the-second-level','The 2nd best level',1),(5,'The infinite level','www.goodimages.com/the-infinite-level','It\'s infinite!',3),(6,'When life gives you confetti, celebrate','www.goodimages.com/the-double-infinite-level','osasda',3),(8,'Confetti Photo #1','https://images.unsplash.com/photo-1492684223066-81342ee5ff30','Confetti',3),(9,'Confetti Photo #5','https://images.unsplash.com/photo-1492684223066-8152ee5ff30','Confetti5',3),(10,'Confetti Photo #6','https://images.unsplash.com/photo-146684223066-8152ee5ff30','Confetti6',3),(11,'Confetti Photo #7','https://images.un7ash.com/photo-146684223066-8152ee5ff30','Confetti7',3),(12,'Confetti Photo #8','https://images.un888h.com/photo-146684223066-8152ee5ff30','Confetti8',3),(13,'Destroyed Album Photo #8','https://images.sun888h.com/photo-146684223066-8152ee5ff30',NULL,3),(14,'Destroyed Album Photo #9','https://images.sun889h.com/photo-1s46684223066-8152ee5ff30','not null!',3),(17,'Confetti Photo #1','pppppppppppppppppppppppppppp.com','Confetti',5),(18,'Confetti Photo #2','ppppppppppppppppppppppppp2ppp.com','Conf2etti',5),(19,'Confetti Photo #3','pppppppppppppppppppspppppp2ppp.com','Conf2etsti',5);
/*!40000 ALTER TABLE `photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'mail@gmail.com','1234','Linus','Lindberg'),(2,'jn@badcameraphotography.com','$2b$10$sYj6kAsJl5dHwmdCQm1N9OfL6yAvVyy20cjlnQDiS9YB4lBl2xUgC','Johan','Nordström'),(3,'test@gmail.com','$2b$10$5Bq/lkV4IWEbjZ1jhZIrFulT9ED1Ei7LK/4CsAEUnQtghMhCy.DXS','test','test'),(5,'testing@gmail.com','$2b$10$EJdQJK.q1A6ohQzKEWZkkOtqlKE/3lTYiqx6gI0/jB3yVjd1ulTOO','testing','testing');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-03-10 15:53:40
