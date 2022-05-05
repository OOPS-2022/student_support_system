-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: sddatabase
-- ------------------------------------------------------
-- Server version	8.0.23

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
-- Table structure for table `evidence`
--

DROP TABLE IF EXISTS `evidence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evidence` (
  `ticket_id` int DEFAULT NULL,
  `link` varchar(300) DEFAULT NULL,
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `evidence_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `logged_offences` (`ticket_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evidence`
--

LOCK TABLES `evidence` WRITE;
/*!40000 ALTER TABLE `evidence` DISABLE KEYS */;
/*!40000 ALTER TABLE `evidence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logged_offences`
--

DROP TABLE IF EXISTS `logged_offences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logged_offences` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `offender_name` varchar(30) DEFAULT NULL,
  `offence_id` int DEFAULT NULL,
  `details` varchar(300) DEFAULT NULL,
  `crs_code` varchar(10) DEFAULT NULL,
  `offence_status` varchar(10) DEFAULT NULL,
  `submitter_id` int DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `offence_id` (`offence_id`),
  KEY `submitter_id` (`submitter_id`),
  CONSTRAINT `logged_offences_ibfk_1` FOREIGN KEY (`offence_id`) REFERENCES `offence_list` (`offence_id`),
  CONSTRAINT `logged_offences_ibfk_2` FOREIGN KEY (`submitter_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logged_offences`
--

LOCK TABLES `logged_offences` WRITE;
/*!40000 ALTER TABLE `logged_offences` DISABLE KEYS */;
INSERT INTO `logged_offences` VALUES (1,'Chegg',5,'Chegg keeps advertising answers to my test questions','PHYS1036','Not guilty',1),(2,'student',1,'During our group project, student plagiarized their portion of the work','APPM2006','Guilty',1),(3,'student1',4,'Student1 wrote a test for student 2','COMS3009','Pending',1),(4,'student',2,'Student copied my work and submitted it as their own','COMS3003','Guilty',1),(5,NULL,NULL,NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `logged_offences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offence_list`
--

DROP TABLE IF EXISTS `offence_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offence_list` (
  `offence_id` int NOT NULL AUTO_INCREMENT,
  `offence_name` varchar(30) DEFAULT NULL,
  `severity` int DEFAULT NULL,
  `offence_desc` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`offence_id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offence_list`
--

LOCK TABLES `offence_list` WRITE;
/*!40000 ALTER TABLE `offence_list` DISABLE KEYS */;
INSERT INTO `offence_list` VALUES (1,'Plagiarism',5,'Using cited work as your own without acknowledgement'),(2,'Copying',3,'Taking work from a peer without permission'),(3,'Unauthorized Collaboration',1,'Working with a peer on individual work'),(4,'Impersonation',3,'Submitting work as another peer'),(5,'other',0,'Offence not listed'),(67,'Cheating',2,'Using unjust methods to complete work');
/*!40000 ALTER TABLE `offence_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `other`
--

DROP TABLE IF EXISTS `other`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `other` (
  `ticket_id` int DEFAULT NULL,
  `offence_name` varchar(10) DEFAULT NULL,
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `other_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `logged_offences` (`ticket_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `other`
--

LOCK TABLES `other` WRITE;
/*!40000 ALTER TABLE `other` DISABLE KEYS */;
INSERT INTO `other` VALUES (1,'Incitation');
/*!40000 ALTER TABLE `other` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `name` varchar(30) NOT NULL,
  `surname` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL,
  `contact_num` varchar(10) NOT NULL,
  `organization_nr` varchar(10) NOT NULL,
  `role` varchar(10) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `organization_nr_UNIQUE` (`organization_nr`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test@gmail.com','test','test','test','0793694302','1608780','student'),(2,'test1@gmail.com','test1','test1','test1','0793694302','1608781','admin'),(3,'student@gmail.com','student','student','student','0793694302','1608782','student'),(4,'admin@gmail.com','admin','admin','admin','0793694302','1608783','admin');
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

-- Dump completed on 2022-04-09 15:02:55
