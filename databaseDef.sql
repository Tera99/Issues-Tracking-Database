DROP TABLE IF EXISTS `part_issue`; DROP TABLE IF EXISTS `issue`; DROP TABLE IF EXISTS `test`;
DROP TABLE IF EXISTS `part_owner`; DROP TABLE IF EXISTS `part`;
DROP TABLE IF EXISTS `owner`;
# owner
CREATE TABLE `owner` (
`id` int(11) NOT NULL AUTO_INCREMENT, `last_name` varchar(255) NOT NULL, `first_name` varchar(255) NOT NULL, PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
# part
CREATE TABLE `part` (
`id` int(11) NOT NULL AUTO_INCREMENT, `desc` varchar(255) NOT NULL, `due_date` date,
`critical_path` ENUM ('y','n'),
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
 # part_owner
CREATE TABLE `part_owner` (
`po_id` int(11) AUTO_INCREMENT, `part_id` int(11),
`owner_id` int(11),
PRIMARY KEY(`po_id`),
FOREIGN KEY (`part_id`) REFERENCES `part` (`id`) ON DELETE CASCADE,
FOREIGN KEY (`owner_id`) REFERENCES `owner` (`id`) ON DELETE CASCADE ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
# test
CREATE TABLE `test`(
`id` int(11) AUTO_INCREMENT, `part_id` int(11) NOT NULL, `desc` varchar(255) NOT NULL, `due_date` date,
`note` text,
PRIMARY KEY (`id`),
FOREIGN KEY (`part_id`) REFERENCES `part` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
# issue
CREATE TABLE `issue` (
`id` int(11) AUTO_INCREMENT, `desc` varchar(255) NOT NULL, `priority` ENUM('1','2','3','4','5'), `status` varchar(255), PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
# part_issue
/* maybe this should cascade?? Do we want */ CREATE TABLE `part_issue` (
`pi_id` int(11) AUTO_INCREMENT, `part_id` int(11),
`issue_id` int(11),
PRIMARY KEY(`pi_id`),
FOREIGN KEY (`part_id`) REFERENCES `part`(`id`) ON DELETE CASCADE,
FOREIGN KEY (`issue_id`) REFERENCES `issue`(`id`) ON DELETE CASCADE ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/* seeding tables with sample data */
# owner data
INSERT INTO `owner` (`last_name`, `first_name`) VALUES ("Arendelle","Elsa"),("Beauty","Belle"), ("Lightyear","Buzz"),("McQueen","Lightning");
# part data
INSERT INTO `part` (`desc`, `due_date`, `critical_path`) VALUES ("gripper", 20170701, "Y"),("shutter", 20170630, "Y"),
("load lock", 20170615, "Y"),("lift", 20170913, "N"),
("end affector", 20171210, "N"),("deceleration lens", 20180215, "Y");
# part_owner data
INSERT INTO `part_owner` (`part_id`, `owner_id`) VALUES (1,1),(2,2),(3,2),(4,4),(5,3),(6,1);
# test data
INSERT INTO `test` (`desc`, `part_id`, `due_date`, `note`) VALUES ("cluster tool processing", 1, 20170722, "in progress"),
("suction system test", 2, 20171010, "waiting for vacuume module"), ("robot optimization", 5, 20171112, "don arigato mr roboto"),
("wafer handling analysis", 1, 20180111, "due next year"),
("load lock calibration", 3, 20170606, "lock and load!"),
("dynamic lift balancing", 6, 20171013, "contact supplier: 512-222-7876"), ("pitch adjustment", 6, 20170923, "n/a"),
("robot calibration", 4, 20170820, "waiting on software group"),
("linkage evaluation", 3, 20170516, "you are a rock star!!");
# issue data
INSERT INTO `issue` (`desc`,`priority`,`status`) VALUES ("unbalanced load", 1, "in progress"),
("no charge", 2, "waiting"),
("out of calibration", 3, "on hold"),
("squeaking noise", 1, "is there a mouse?"),
("no seal", 2, "checking lid gasket"),
("breaking wafers", 4, "in progress"),
("out of alignment", 5, "waiting on balancing tool"), ("excessive vibration", 3, "dampener on order"), ("overheating", 4, "new coolant pump on order");
# part_issue
INSERT INTO `part_issue` (`part_id`,`issue_id`) VALUES (1,1),(1,6),(1,7),(2,8),(3,5),
(4,4),(4,7),(5,1),(5,4),(5,8),
(6,9),(6,7),(6,2),(6,3);
