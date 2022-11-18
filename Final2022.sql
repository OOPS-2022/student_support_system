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
-- Table structure for table `actions`
--

DROP TABLE IF EXISTS `actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actions` (
  `action_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `tables` varchar(45) DEFAULT NULL,
  `table_id` int DEFAULT NULL,
  `seen` varchar(45) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `action_desc` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`action_id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actions`
--

LOCK TABLES `actions` WRITE;
/*!40000 ALTER TABLE `actions` DISABLE KEYS */;
INSERT INTO `actions` VALUES (1,1608780,'pledge_submissions',3,'true','2022-05-18','You are required to sign this pledge'),(2,1608780,'test',5,'true','2022-05-10','A new test has been uploaded'),(3,1,'meeting',13,'true','2022-05-19','Hearing has been scheduled'),(4,1,'meeting',13,'true','2022-05-19','Hearing has been scheduled'),(5,1,'logged_offence',21,'false','2022-05-19','An offence has been logged against you.'),(6,1,'logged_offence',22,'true','2022-05-19','An offence has been logged against you.'),(7,1,'logged_offence',23,'true','2022-05-19','An offence has been logged against you.'),(8,1,'logged_offence',24,'false','2022-05-19','An offence has been logged against you.'),(9,1,'logged_offence',25,'false','2022-05-19','An offence has been logged against you.'),(10,1,'sessions',3,'true','2022-05-25','A new session has been uploaded'),(11,3,'sessions',3,'false','2022-05-25','A new session has been uploaded'),(12,1,'sessions',4,'false','2022-05-29','A new session has been uploaded'),(13,3,'sessions',4,'false','2022-05-29','A new session has been uploaded'),(14,1,'sessions',5,'false','2022-05-29','A new session has been uploaded'),(15,3,'sessions',5,'false','2022-05-29','A new session has been uploaded'),(16,NULL,'sessions',6,'false','2022-05-29','A new session has been uploaded'),(17,NULL,'sessions',8,'false','2022-05-29','A new session has been uploaded'),(18,1,'sessions',11,'false','2022-06-02','A new session has been uploaded'),(19,3,'sessions',11,'false','2022-06-02','A new session has been uploaded'),(20,3,'sessions',15,'false','2022-06-03','A new session has been uploaded'),(21,1,'sessions',15,'false','2022-06-03','A new session has been uploaded'),(22,1,'sessions',16,'false','2022-06-03','A new session has been uploaded'),(23,3,'sessions',16,'false','2022-06-03','A new session has been uploaded'),(24,1,'meeting',23,'false','2022-06-03','Hearing has been scheduled'),(25,1,'logged_offences',23,'false','2022-06-03','Your offence ticket has been updated'),(26,1,'logged_offences',25,'false','2022-06-03','Your offence ticket has been updated'),(27,3,'sessions',17,'false','2022-06-03','A new session has been uploaded'),(28,1,'sessions',17,'false','2022-06-03','A new session has been uploaded'),(29,3,'sessions',18,'false','2022-06-03','A new session has been uploaded'),(30,1,'sessions',18,'false','2022-06-03','A new session has been uploaded'),(31,1,'sessions',19,'false','2022-06-03','A new session has been uploaded'),(32,3,'sessions',19,'false','2022-06-03','A new session has been uploaded'),(33,1,'logged_offence',27,'false','2022-08-19','An offence has been logged against you.'),(34,1,'logged_offence',28,'false','2022-08-19','An offence has been logged against you.'),(35,6,'logged_offence',29,'false','2022-08-19','An offence has been logged against you.'),(36,6,'logged_offence',30,'false','2022-08-19','An offence has been logged against you.'),(37,6,'meeting',30,'false','2022-08-21','Hearing has been scheduled'),(38,6,'logged_offences',30,'false','2022-08-21','Your offence ticket has been updated'),(39,1,'logged_offence',31,'false','2022-08-21','An offence has been logged against you.'),(40,6,'logged_offence',32,'false','2022-08-31','An offence has been logged against you.'),(41,3,'sessions',21,'false','2022-09-06','A new session has been uploaded'),(42,1,'sessions',21,'false','2022-09-06','A new session has been uploaded'),(43,1,'sessions',22,'false','2022-09-06','A new session has been uploaded'),(44,3,'sessions',22,'false','2022-09-06','A new session has been uploaded'),(45,1,'sessions',23,'false','2022-09-06','A new session has been uploaded'),(46,3,'sessions',23,'false','2022-09-06','A new session has been uploaded'),(47,1,'sessions',24,'false','2022-09-06','A new session has been uploaded'),(48,3,'sessions',24,'false','2022-09-06','A new session has been uploaded'),(49,3,'sessions',25,'false','2022-09-06','A new session has been uploaded'),(50,1,'sessions',25,'false','2022-09-06','A new session has been uploaded'),(51,6,'meeting',32,'false','2022-09-06','Hearing has been scheduled'),(52,6,'logged_offences',32,'false','2022-09-06','Your offence ticket has been updated'),(53,6,'meeting',32,'false','2022-09-06','Hearing has been scheduled'),(54,6,'logged_offences',32,'false','2022-09-06','Your offence ticket has been updated'),(55,6,'logged_offences',32,'false','2022-09-06','Your offence ticket has been updated'),(56,6,'logged_offences',32,'false','2022-09-06','Your offence ticket has been updated'),(57,6,'logged_offence',32,'false','2022-09-06','An offence has been logged against you.'),(58,6,'logged_offence',32,'false','2022-09-06','An offence has been logged against you.'),(59,6,'logged_offence',33,'false','2022-09-06','An offence has been logged against you.'),(60,1,'logged_offence',34,'false','2022-09-07','An offence has been logged against you.'),(61,1,'logged_offence',35,'false','2022-09-07','An offence has been logged against you.'),(62,1,'logged_offence',35,'false','2022-09-07','An offence has been logged against you.'),(63,1,'logged_offence',35,'false','2022-09-07','An offence has been logged against you.'),(64,1,'logged_offence',35,'false','2022-09-07','An offence has been logged against you.'),(65,6,'logged_offence',35,'false','2022-09-07','An offence has been logged against you.'),(66,6,'logged_offence',36,'false','2022-09-26','An offence has been logged against you.'),(67,7,'logged_offence',37,'false','2022-09-26','An offence has been logged against you.'),(68,1,'logged_offence',38,'false','2022-10-06','An offence has been logged against you.'),(69,1,'schedule',1,'false',NULL,'Daily reminder to look at schedule'),(70,6,'schedule',2,'false',NULL,'Daily reminder to look at schedule');
/*!40000 ALTER TABLE `actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `checklist`
--

DROP TABLE IF EXISTS `checklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checklist` (
  `check_id` int NOT NULL,
  `question_number` int NOT NULL,
  `question_details` varchar(45) NOT NULL,
  `session_id` int NOT NULL,
  PRIMARY KEY (`check_id`,`session_id`,`question_number`),
  KEY `session_id_idx` (`session_id`),
  CONSTRAINT `session_id` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checklist`
--

LOCK TABLES `checklist` WRITE;
/*!40000 ALTER TABLE `checklist` DISABLE KEYS */;
INSERT INTO `checklist` VALUES (1,1,'Do you understand maths',1),(1,2,'Do you understand algebra',1),(1,3,'Did you learn how to do 1+1',1),(2,0,'One',7),(2,1,'Two',7),(3,0,'Een1',7),(3,1,'q111',7),(4,0,'1',7),(4,1,'2',7),(4,2,'3',7),(5,1,'11',7),(5,2,'22',7),(6,2,'Question 2!',7),(6,3,'Question 3',7),(7,1,'q1',7),(7,2,'q2',7),(8,1,'111 test',24),(8,2,'222',24),(9,1,'Hello',25),(9,2,'Do you understand?',25),(10,1,'Q1',7),(10,2,'Q2',7),(11,1,'1',7),(11,2,'2',7),(12,1,'q1',7),(12,2,'q2',7),(13,1,'q1',7),(13,2,'q2',7),(14,1,'q1',7),(14,2,'q2',7),(14,3,'q3',7),(14,4,'have you learned this',7),(15,1,'q1',7),(15,2,'q2',7),(15,3,'q3',7),(16,1,'q1',7),(16,2,'q2',7),(16,3,'q3',7),(17,1,'23',7),(18,1,'23',7),(18,2,'24',7),(19,1,'1',6),(19,2,'2',6);
/*!40000 ALTER TABLE `checklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collaborators`
--

DROP TABLE IF EXISTS `collaborators`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `collaborators` (
  `ticket_id` int NOT NULL,
  `user_id` int NOT NULL,
  `role` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`ticket_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collaborators`
--

LOCK TABLES `collaborators` WRITE;
/*!40000 ALTER TABLE `collaborators` DISABLE KEYS */;
INSERT INTO `collaborators` VALUES (38,10,'observer'),(38,11,'collaborator');
/*!40000 ALTER TABLE `collaborators` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `completed_sessions`
--

DROP TABLE IF EXISTS `completed_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `completed_sessions` (
  `student_id` int NOT NULL,
  `session_id` int NOT NULL,
  `pledge_id` int NOT NULL,
  `pledge_link` varchar(300) DEFAULT NULL,
  `paragraph` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`student_id`,`session_id`,`pledge_id`),
  KEY `student_id_idx` (`student_id`),
  CONSTRAINT `student_id` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `completed_sessions`
--

LOCK TABLES `completed_sessions` WRITE;
/*!40000 ALTER TABLE `completed_sessions` DISABLE KEYS */;
INSERT INTO `completed_sessions` VALUES (3,2,0,'/Uploads/Pledges/Test/Test12022APPM2007/1608782.pdf','I understand that I must reference all work that is not my own and try my best to interpret written works to the point that I can explain it in my own words. ');
/*!40000 ALTER TABLE `completed_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_link`
--

DROP TABLE IF EXISTS `course_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_link` (
  `course_id` int NOT NULL,
  `pro_id` int NOT NULL,
  PRIMARY KEY (`course_id`,`pro_id`),
  KEY `program_id_idx` (`pro_id`),
  CONSTRAINT `course_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`),
  CONSTRAINT `pro_id` FOREIGN KEY (`pro_id`) REFERENCES `programs` (`program_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_link`
--

LOCK TABLES `course_link` WRITE;
/*!40000 ALTER TABLE `course_link` DISABLE KEYS */;
INSERT INTO `course_link` VALUES (1,1);
/*!40000 ALTER TABLE `course_link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `course_name` varchar(45) NOT NULL,
  `course_code` varchar(45) NOT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'Machine Learning','COMS3007'),(2,'Computer Graphics and Visualization','COMS3006');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `filledchecklist`
--

DROP TABLE IF EXISTS `filledchecklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `filledchecklist` (
  `checklist_id` int NOT NULL,
  `stu_id` int NOT NULL,
  `question_number` int NOT NULL,
  `checked` tinyint NOT NULL,
  PRIMARY KEY (`checklist_id`,`stu_id`,`question_number`),
  KEY `student_id_idx` (`stu_id`),
  CONSTRAINT `checklist_id` FOREIGN KEY (`checklist_id`) REFERENCES `checklist` (`check_id`),
  CONSTRAINT `stu_id` FOREIGN KEY (`stu_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `filledchecklist`
--

LOCK TABLES `filledchecklist` WRITE;
/*!40000 ALTER TABLE `filledchecklist` DISABLE KEYS */;
INSERT INTO `filledchecklist` VALUES (1,1,1,0),(1,1,2,1),(1,1,3,1),(1,3,1,1),(1,3,2,0),(1,3,3,1),(2,1,1,1),(8,1,1,1),(8,1,2,2),(8,3,1,1),(8,3,2,0),(9,1,1,1),(9,1,2,1),(9,3,1,1),(9,3,2,1);
/*!40000 ALTER TABLE `filledchecklist` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logged_offences`
--

LOCK TABLES `logged_offences` WRITE;
/*!40000 ALTER TABLE `logged_offences` DISABLE KEYS */;
INSERT INTO `logged_offences` VALUES (1,'Chegg',5,'Chegg keeps advertising answers to my test questions','PHYS1036','Not guilty',1,NULL),(2,'student',1,'During our group project, student plagiarized their portion of the work','APPM2006','Guilty',1,NULL),(3,'student1',4,'Student1 wrote a test for student 2','COMS3009','Pending',1,NULL),(4,'student',2,'Student copied my work and submitted it as their own','COMS3003','Guilty',1,NULL),(6,'Leandra',1,'tets','COMS3003',NULL,NULL,NULL),(7,'test',1,'testing','COMS3003',NULL,NULL,NULL),(8,'Me',2,'me','me',NULL,NULL,NULL),(9,'1608780',3,'testing','COMS3003',NULL,NULL,NULL),(10,'1608780',3,'new test','','Pending',4,NULL),(11,'1608780',3,'123','123','Pending',4,NULL),(12,'1608780',2,'1234','1234','Pending',4,NULL),(13,'1608780',71,'this is a test for files','12345','Pending',1,NULL),(14,'1608780',1,'this is a test for file link insert','12345','Pending',1,NULL),(15,'1608780',1,'this is a test for file link insert','12345','Pending',1,'/Uploads/Evidence/ticket15'),(16,'555',3,'354667890','23456','Pending',1,'/Uploads/Evidence/ticket16'),(17,'123456',67,'asdfghj','asdfghjk','Pending',1,NULL),(18,'123456',67,'asdfghj','asdfghjk','Pending',1,'/Uploads/Evidence/ticket18'),(19,'1608780',67,'sxdcfghjkl','sdfgh','Pending',1,NULL),(20,'1608780',67,'sxdcfghjkl','sdfgh','Pending',1,NULL),(21,'1608780',4,'asdfghjkl','asdfghjk','Pending',1,NULL),(22,'1608780',4,'asdfghjkl','asdfghjk','Pending',1,NULL),(23,'1608780',4,'asdfghjkl','asdfghjk','Not Guilty',1,NULL),(24,'1608780',4,'asdfghjkl','asdfghjk','Pending',1,NULL),(25,'1608780',2,'dfgh','sdfghj','Guilty',1,'/Uploads/Evidence/ticket25'),(26,'1608780',67,'testing split','','Pending',1,'/Uploads/Evidence/ticket26'),(27,'1608780',4,'random',NULL,'Pending',1,'/Uploads/Evidence/ticket27'),(28,'1608780',2,'asdfghjkl;dxcvbnmjhyutrf','','Pending',1,'/Uploads/Evidence/ticket28'),(29,'1608784',2,'ewserdgyuiojhgfdrsfcgbnj','','Pending',1,'/Uploads/Evidence/ticket29'),(30,'1608784',2,'ewserdgyuiojhgfdrsfcgbnj','','Not Guilty',1,'/Uploads/Evidence/ticket30'),(31,'1608784',2,'dfghjgtredfgvgbhjygtf',NULL,NULL,NULL,'/Uploads/Evidence/ticket31'),(32,'1608784',2,'test new email password','1','Guilty',1,'/Uploads/Evidence/ticket32'),(33,'1608784',67,'asdffgh','COMS3007','Pending',1,'/Uploads/Evidence/ticket33'),(34,'1608780',2,'dfghj',NULL,'pending',1,NULL),(35,'1608784',2,'sdfcgvhbjnmk test','','Pending',1,'/Uploads/Evidence/ticket35'),(36,'1608784',2,'test','COMS3007','Pending',1,'/Uploads/Evidence/ticket36'),(37,'1608785',2,'asdfghm,','','Pending',7,'/Uploads/Evidence/ticket37'),(38,'1608780',2,'zsdxfcgvhjnkl','sdfghjkl','Pending',8,'/Uploads/Evidence/ticket38');
/*!40000 ALTER TABLE `logged_offences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meetings`
--

DROP TABLE IF EXISTS `meetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meetings` (
  `meetingID` int NOT NULL AUTO_INCREMENT,
  `studNo` varchar(45) DEFAULT NULL,
  `meetDate` varchar(45) DEFAULT NULL,
  `meetLink` varchar(300) DEFAULT NULL,
  `ticket_id` int DEFAULT NULL,
  PRIMARY KEY (`meetingID`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meetings`
--

LOCK TABLES `meetings` WRITE;
/*!40000 ALTER TABLE `meetings` DISABLE KEYS */;
INSERT INTO `meetings` VALUES (1,'1608780','2023-February-12','sgftg',1),(2,'student1','2023-March-20','asdfh',3),(3,'student1','2023-March-20','asdfh',3),(4,'student1','2023-March-20','asdfh',3),(5,'student1','2023-March-20','asdfh',3),(6,'student1','2023-March-20','asdfh',3),(7,'student1','2023-March-20','asdfh',3),(8,'student1','2023-March-20','asdfh',3),(9,'1608780','2023-April-20','asdfghjkl;',13),(10,'1608780','2023-April-20','asdfghjkl;',13),(11,'1608780','2023-April-20','asdfghjkl;',13),(12,'1608780','2023-April-21','asdfghjkl;',13),(13,'1608780','2022-06-16','asdfghjkl',23),(14,'1608784','2022-08-23','asdfghjknhbvcxdsertftygyh',30),(15,'Chegg','2022-09-07','azsdxfvgbh',1),(16,'1608784','2022-09-08','asdfghjk',32),(17,'1608784','2022-09-07','dfggh',32),(18,'Chegg','2022-10-26','sdxfcgvbnm,',1);
/*!40000 ALTER TABLE `meetings` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offence_list`
--

LOCK TABLES `offence_list` WRITE;
/*!40000 ALTER TABLE `offence_list` DISABLE KEYS */;
INSERT INTO `offence_list` VALUES (1,'Plagiarism',5,'Using cited work as your own without acknowledgement'),(2,'Copying',3,'Taking work from a peer without permission'),(3,'Unauthorized Collaboration',1,'Working with a peer on individual work'),(4,'Impersonation',3,'Submitting work as another peer'),(5,'other',0,'Offence not listed'),(67,'Cheating',3,'Using unjust methods to complete work'),(71,'test',3,'This is a test for split');
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pledges`
--

LOCK TABLES `pledges` WRITE;
/*!40000 ALTER TABLE `pledges` DISABLE KEYS */;
INSERT INTO `pledges` VALUES (3,'Plagiarism','The pledge serves as acknowledgement from the student that they will not commit plagiarism ','Signed Pledge','/Uploads/Pledges/SignedPledges/1650355918774Plagiarism Pledge.pdf'),(4,'Collaboration','This pledge discourages unauthorized collaboration','Signed Pledge','/Uploads/Pledges/SignedPledges/1650727033302Collaboration Pledge.pdf'),(5,'Plagiarism','I will not commit plagiarism on this assignment. I understand that there will be consequences should I ignore this warning','Clicked Pledge',NULL),(7,'TestSigned','this is a test','Signed Pledge','/Uploads/Pledges/SignedPledges/1654234758208outline2022.pdf'),(8,'test','This is a clicked pledge test','Clicked Pledge',NULL),(9,'test pledge','adsfghjbmk','Signed Pledge','/Uploads/Pledges/SignedPledges/16624843002445. Paging (1).pdf'),(10,'test click','aSzdfcgvhjnk,','Signed Pledge','/Uploads/Pledges/SignedPledges/16624843242925. Paging (1).pdf'),(11,'another signed pledge','asdfgvhbjnm','Signed Pledge','/Uploads/Pledges/SignedPledges/1662484589142Lab-Process-API.pdf'),(12,'click test','this is a test for clicked pledge','Clicked Pledge',NULL),(13,'test click','new test for click','Clicked Pledge',NULL);
/*!40000 ALTER TABLE `pledges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programs` (
  `program_id` int NOT NULL AUTO_INCREMENT,
  `program_name` varchar(45) NOT NULL,
  PRIMARY KEY (`program_id`),
  UNIQUE KEY `program_id_UNIQUE` (`program_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programs`
--

LOCK TABLES `programs` WRITE;
/*!40000 ALTER TABLE `programs` DISABLE KEYS */;
INSERT INTO `programs` VALUES (1,'Computer Science');
/*!40000 ALTER TABLE `programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `schedule_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`schedule_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (1,1,'2022-10-19','2022-10-31'),(2,6,'2022-10-23','2022-10-31'),(3,3,'2022-10-27','2022-11-02'),(4,12,'2022-10-27','2022-10-31'),(5,13,'2022-10-28','2022-10-31'),(8,15,'2022-11-11','2022-11-13'),(9,14,'2022-11-11','2022-11-13');
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session_link`
--

DROP TABLE IF EXISTS `session_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session_link` (
  `session_id` int NOT NULL,
  `pledge_id` int NOT NULL,
  PRIMARY KEY (`session_id`,`pledge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session_link`
--

LOCK TABLES `session_link` WRITE;
/*!40000 ALTER TABLE `session_link` DISABLE KEYS */;
INSERT INTO `session_link` VALUES (1,3),(4,9),(4,10),(5,10),(8,3),(8,4),(11,3),(11,4),(15,3),(16,3),(16,4),(17,4),(17,5),(18,3),(18,4),(19,3),(19,4),(21,3),(21,4);
/*!40000 ALTER TABLE `session_link` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int NOT NULL,
  `session_type` varchar(45) NOT NULL,
  `date` varchar(45) DEFAULT NULL,
  `time` varchar(45) DEFAULT NULL,
  `session_name` varchar(45) DEFAULT NULL,
  `creator_id` int DEFAULT NULL,
  `session_folder` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (1,1,'pledge',NULL,NULL,'session1',NULL,NULL),(2,1,'test',NULL,NULL,'session2',NULL,NULL),(3,1,'Tutorial','15-07-2022','15:00','My test session2',4,NULL),(4,1,'Exam','15-05-2025','15:00','Testing',4,NULL),(5,1,'Tutorial','15-01-2023','12:00','test2',4,NULL),(6,2,'Tutorial','12-12-2022','13:00','test3',4,NULL),(7,1,'Tutorial','12-02-2022','14:00','testLinks',4,NULL),(8,2,'Tutorial','13-12-2022','17:00','testLinks2',4,NULL),(9,1,'Tutorial','15-06-2022','12h00','Test folder',4,NULL),(10,1,'Test','15-06-2022','12h00','Test folder 2',4,NULL),(11,1,'Test','12-06-2022','14:00','Test folder 3',4,'/Uploads/SubmittedSessions/Session11'),(12,1,'Tutorial','03-06-2022','12:00','test calendar',4,NULL),(13,1,'Test','03-06-2022','12:00','test bugfix',4,NULL),(14,1,'Test','03-06-2022','14:00','session14',4,NULL),(15,1,'','03-06-2022','14:00','New name test',4,'./Uploads/SubmittedSessions/Session15'),(16,1,'Test','05-06-2022','12:00','test calendar 2',4,'./Uploads/SubmittedSessions/Session16'),(17,1,'','12-06-2022',NULL,'Test folder',4,'./Uploads/SubmittedSessions/Session17'),(18,1,'Tutorial','12-06-2022','2022-09-06T22:00:00.596Z','Test new2',4,'./Uploads/SubmittedSessions/Session18'),(19,1,'Tutorial','12-06-2022',NULL,'Test result',4,'./Uploads/SubmittedSessions/Session19'),(20,1,'Exam','03-06-2022',NULL,'Test Split ',4,NULL),(21,1,'Tutorial','2022-09-07T22:00:00.000Z','2022-09-06T15:04:00.659Z','testing merge',4,NULL),(22,1,'Tutorial','2022-09-07T22:00:00.000Z','2022-09-06T15:04:00.659Z','testing merge',4,NULL),(23,1,'Tutorial','2022-09-07T22:00:00.000Z','2022-09-06T10:04:00.659Z','testing merge',4,NULL),(24,1,'Tutorial','2022-09-14T22:00:00.000Z','2022-09-06T03:59:00.690Z','test newest',4,NULL),(25,1,'Tutorial','2022-09-12T22:00:00.000Z','2022-09-06T04:00:00.320Z','test test test',4,NULL);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_link`
--

DROP TABLE IF EXISTS `student_link`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_link` (
  `user_id` int NOT NULL,
  `program_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`program_id`),
  KEY `program_id_idx` (`program_id`),
  CONSTRAINT `program_id` FOREIGN KEY (`program_id`) REFERENCES `programs` (`program_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_link`
--

LOCK TABLES `student_link` WRITE;
/*!40000 ALTER TABLE `student_link` DISABLE KEYS */;
INSERT INTO `student_link` VALUES (1,1),(3,1);
/*!40000 ALTER TABLE `student_link` ENABLE KEYS */;
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
-- Table structure for table `time_table`
--

DROP TABLE IF EXISTS `time_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `time_table` (
  `schedule_id` int NOT NULL,
  `weekday` smallint NOT NULL,
  `time` varchar(5) NOT NULL,
  `details` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`schedule_id`,`weekday`,`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time_table`
--

LOCK TABLES `time_table` WRITE;
/*!40000 ALTER TABLE `time_table` DISABLE KEYS */;
INSERT INTO `time_table` VALUES (1,1,'09:00','Do AAA Assignment'),(3,1,'8','A1'),(3,2,'11','OS Assignment'),(3,2,'12','Do scrum documentation'),(4,1,'9','AAA'),(4,3,'10','OS'),(5,1,'8','OS2'),(5,2,'10','OS'),(8,1,'8','A23'),(8,2,'9','A5');
/*!40000 ALTER TABLE `time_table` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test@gmail.com','test','test','test','0793694302','1608780','student'),(2,'test1@gmail.com','test1','test1','test1','0793694302','1608781','admin'),(3,'student@gmail.com','student','student','student','0793694302','1608782','student'),(4,'admin@gmail.com','admin','admin','admin','0793694302','1608783','admin'),(6,'leandra.brits.1998@gmail.com','Leandra','Brits','leandra','0793694302','1608784','student'),(7,'1608780@students.wits.ac.za','Leandra','Brits','random','0793694302','1608785','student'),(8,'support@gmail.com','Supp','Staff','123','0793694302','s16089780','support'),(9,'staff@gmail.com','Staff','Supp','456','0793694302','s1608781','support'),(10,'observer@gmail.com','Ob','Server','1234','0793694302','s1608782','support'),(11,'collab@gmail.com','Coll','Lab','4321','0793694302','s1608783','support'),(12,'123@gmail.com','123','123','123','123','123','student'),(13,'1234@gmail.com','1234','1234','1234','1234','1234','student'),(14,'12@gmail.com','12','12','12','12','12','student'),(15,'1@gmail.com','1','1','1','1','1','student');
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

-- Dump completed on 2022-11-18 10:48:06
