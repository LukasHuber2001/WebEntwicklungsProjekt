-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: May 05, 2024 at 11:16 AM
-- Server version: 8.4.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `php_docker`
--

-- --------------------------------------------------------

--
-- Table structure for table `Artikel`
--

CREATE TABLE `Artikel` (
  `art_num` int NOT NULL,
  `name` varchar(256) NOT NULL,
  `gender` varchar(256) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `size` varchar(256) NOT NULL,
  `color` varchar(256) NOT NULL,
  `category` varchar(256) NOT NULL,
  `image_url` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Artikel`
--

INSERT INTO `Artikel` (`art_num`, `name`, `gender`, `price`, `size`, `color`, `category`, `image_url`) VALUES
(1, 'Monkey Basketball shorts men', 'Männer', 20, 'S, M, L, XL, XXL', 'Grün, Violett', 'Hosen', 'https://cdn.pixabay.com/photo/2017/08/11/14/19/honor-2631271_1280.jpg\r\n'),
(2, 'Zen Socken', 'Männer, Frauen, Unisex', 13, 'one-size', 'Violett, Grün, Orange', 'Accessories', '\"https://cdn.pixabay.com/photo/2017/08/11/14/19/honor-2631271_1280.jpg'),
(3, 'Monkeys Polo', 'Männer', 22, 'S,M,L,XL,XXL', 'Orange,Schwarz', 'Tshirt', 'https://cdn.pixabay.com/photo/2017/08/11/14/19/honor-2631271_1280.jpg'),
(4, 'T-Red', 'Männer,Frauen,Unisex', 20, 'S,M,L,XL,XXL', 'Rot', 'Tshirt', 'https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_1280.png'),
(5, 'Braune Herrenjacke', 'Männer', 80, 'M,L,XL,XXL', 'Braun', 'Jacke', 'https://cdn.pixabay.com/photo/2017/09/07/04/54/khaki-2723896_1280.jpg'),
(6, 'Brilliantenarmband', 'Frauen', 30, 'S,M,L', 'Silber', 'Accessoires', 'https://cdn.pixabay.com/photo/2016/11/11/17/34/diamond-1817291_1280.png'),
(7, 'T-Shirt Striped', 'Männer,Frauen,Unisex', 40, 'S,M,L,XL,XXL', 'Schwarz-Weiß,Rot-Blau', 'Tshirt', 'https://cdn.pixabay.com/photo/2017/08/11/14/19/honor-2631271_1280.jpg'),
(8, 'Baggy Jeans', 'Männer', 80, 'M,L,XL,XXL', 'Black,Gray', 'Hose', 'https://cdn.pixabay.com/photo/2017/08/11/14/19/honor-2631271_1280.jpg'),
(9, 'Hoodie mit Aufdruck', 'Männer,Frauen,Unisex', 100, 'L,XL,XXL,3XL', 'Schwarz,Grau,Dunkelblau', 'Hoodie', 'https://cdn.pixabay.com/photo/2017/08/11/14/19/honor-2631271_1280.jpg'),
(10, 'Anzug', 'Männer', 240, 'M,L,XL', 'Schwarz,Blau,Grau', 'Anzug', 'https://cdn.pixabay.com/photo/2017/08/11/14/19/honor-2631271_1280.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Artikel`
--
ALTER TABLE `Artikel`
  ADD PRIMARY KEY (`art_num`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
