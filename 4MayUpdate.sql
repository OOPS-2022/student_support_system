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
-- Table structure for table `investigation_record`
--

DROP TABLE IF EXISTS `investigation_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `investigation_record` (
  `ticket_id` int NOT NULL,
  `description` varchar(45) NOT NULL,
  `date` date NOT NULL,
  KEY `ticket_id_idx` (`ticket_id`),
  CONSTRAINT `ticket_id` FOREIGN KEY (`ticket_id`) REFERENCES `logged_offences` (`ticket_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `investigation_record`
--

LOCK TABLES `investigation_record` WRITE;
/*!40000 ALTER TABLE `investigation_record` DISABLE KEYS */;
INSERT INTO `investigation_record` VALUES (1,'Student logged ticket and sent to HOD','2022-04-20');
/*!40000 ALTER TABLE `investigation_record` ENABLE KEYS */;
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
  `ticket_link` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `offence_id` (`offence_id`),
  KEY `submitter_id` (`submitter_id`),
  CONSTRAINT `logged_offences_ibfk_1` FOREIGN KEY (`offence_id`) REFERENCES `offence_list` (`offence_id`),
  CONSTRAINT `logged_offences_ibfk_2` FOREIGN KEY (`submitter_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logged_offences`
--

LOCK TABLES `logged_offences` WRITE;
/*!40000 ALTER TABLE `logged_offences` DISABLE KEYS */;
INSERT INTO `logged_offences` VALUES (1,'Chegg',5,'Chegg keeps advertising answers to my test questions','PHYS1036','Not guilty',1,NULL),(2,'student',1,'During our group project, student plagiarized their portion of the work','APPM2006','Guilty',1,NULL),(3,'student1',4,'Student1 wrote a test for student 2','COMS3009','Pending',1,NULL),(4,'student',2,'Student copied my work and submitted it as their own','COMS3003','Guilty',1,NULL),(5,NULL,NULL,NULL,NULL,NULL,1,NULL),(6,'Leandra',1,'tets','COMS3003',NULL,NULL,NULL),(7,'test',1,'testing','COMS3003',NULL,NULL,NULL),(8,'Me',2,'me','me',NULL,NULL,NULL),(9,'1608780',3,'testing','COMS3003',NULL,NULL,NULL),(10,'1608780',3,'new test','','Pending',4,NULL),(11,'1608780',3,'123','123','Pending',4,NULL),(12,'1608780',2,'1234','1234','Pending',4,NULL),(13,'1608780',71,'this is a test for files','12345','Pending',1,NULL),(14,'1608780',1,'this is a test for file link insert','12345','Pending',1,NULL),(15,'1608780',1,'this is a test for file link insert','12345','Pending',1,'/Uploads/Evidence/ticket15');
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
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offence_list`
--

LOCK TABLES `offence_list` WRITE;
/*!40000 ALTER TABLE `offence_list` DISABLE KEYS */;
INSERT INTO `offence_list` VALUES (1,'Plagiarism',5,'Using cited work as your own without acknowledgement'),(2,'Copying',3,'Taking work from a peer without permission'),(3,'Unauthorized Collaboration',1,'Working with a peer on individual work'),(4,'Impersonation',3,'Submitting work as another peer'),(5,'other',0,'Offence not listed'),(67,'Cheating',3,'Using unjust methods to complete work'),(71,'test',1,NULL);
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
-- Table structure for table `pledge_submissions`
--

DROP TABLE IF EXISTS `pledge_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pledge_submissions` (
  `student_id` int NOT NULL,
  `test_id` int NOT NULL,
  `pledge_link` varchar(300) DEFAULT NULL,
  `paragraph` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`test_id`,`student_id`),
  KEY `student_id_idx` (`student_id`),
  CONSTRAINT `student_id` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pledge_submissions`
--

LOCK TABLES `pledge_submissions` WRITE;
/*!40000 ALTER TABLE `pledge_submissions` DISABLE KEYS */;
INSERT INTO `pledge_submissions` VALUES (3,2,'/Uploads/Pledges/Test/Test12022APPM2007/1608782.pdf','I understand that I must reference all work that is not my own and try my best to interpret written works to the point that I can explain it in my own words. ');
/*!40000 ALTER TABLE `pledge_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pledges`
--

DROP TABLE IF EXISTS `pledges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pledges` (
  `pledge_id` int NOT NULL AUTO_INCREMENT,
  `pledge_name` varchar(30) NOT NULL,
  `pledge_desc` varchar(200) DEFAULT NULL,
  `pledge_type` varchar(20) NOT NULL,
  `pledge_link` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`pledge_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pledges`
--

LOCK TABLES `pledges` WRITE;
/*!40000 ALTER TABLE `pledges` DISABLE KEYS */;
INSERT INTO `pledges` VALUES (3,'Plagiarism','The pledge serves as acknowledgement from the student that they will not commit plagiarism ','Signed Pledge','/Uploads/Pledges/SignedPledges/1650355918774Plagiarism Pledge.pdf'),(4,'Collaboration','This pledge discourages unauthorized collaboration','Signed Pledge','/Uploads/Pledges/SignedPledges/1650727033302Collaboration Pledge.pdf'),(5,'Plagiarism','I will not commit plagiarism on this assignment. I understand that there will be consequences should I ignore this warning','Clicked Pledge',NULL);
/*!40000 ALTER TABLE `pledges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tests`
--

DROP TABLE IF EXISTS `tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tests` (
  `test_id` int NOT NULL AUTO_INCREMENT,
  `test_name` varchar(100) DEFAULT NULL,
  `test_date` varchar(45) DEFAULT NULL,
  `course_code` varchar(15) DEFAULT NULL,
  `creator_id` int DEFAULT NULL,
  `test_link` varchar(300) DEFAULT NULL,
  `pledge_id` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`test_id`),
  UNIQUE KEY `test_id_UNIQUE` (`test_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tests`
--

LOCK TABLES `tests` WRITE;
/*!40000 ALTER TABLE `tests` DISABLE KEYS */;
INSERT INTO `tests` VALUES (1,'Test12022','07/20/2022','APPM2007',4,'./Uploads/Pledges/Test/Test12022','3'),(2,'Test12022','07/20/2022','APPM2007',4,'./Uploads/Pledges/Test/Test12022APPM2007','3'),(3,'Test1','30/04/2022','COMS3003',4,'./Uploads/Pledges/Test/Test1COMS3003','3'),(4,'Test1','30/04/2022','COMS3007',4,'./Uploads/Pledges/Test/Test1COMS3007','5');
/*!40000 ALTER TABLE `tests` ENABLE KEYS */;
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

-- Dump completed on 2022-05-04 11:54:03
