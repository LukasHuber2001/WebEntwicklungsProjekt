-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 15. Jun 2024 um 16:56
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `test`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `artikel`
--

CREATE TABLE `artikel` (
  `art_num` int(10) NOT NULL,
  `name` varchar(256) NOT NULL,
  `gender` varchar(256) NOT NULL,
  `price` float NOT NULL,
  `size` varchar(256) NOT NULL,
  `color` varchar(256) NOT NULL,
  `category` varchar(256) NOT NULL,
  `image_url` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Daten für Tabelle `artikel`
--

INSERT INTO `artikel` (`art_num`, `name`, `gender`, `price`, `size`, `color`, `category`, `image_url`) VALUES
(1, 'T-Red', 'Männer,Frauen,Unisex', 19.99, 'S,M,L,XL,XXL', 'Rot', 'Tshirt', 'https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_1280.png'),
(2, 'Braune Herrenjacke', 'Männer', 79.99, 'M,L,XL,XXL', 'Braun', 'Jacke', 'https://cdn.pixabay.com/photo/2017/09/07/04/54/khaki-2723896_1280.jpg'),
(3, 'Brilliantenarmband', 'Frauen', 29.99, 'S,M,L', 'Silber', 'Accessoires', '  https://cdn.pixabay.com/photo/2016/11/11/17/34/diamond-1817291_1280.png'),
(4, 'Monkey Basketball shorts mens', 'Männer', 19.99, 'S,M,L,XL,XXL', 'Grün,Violett', 'Hosen', 'https://cdn.pixabay.com/photo/2017/08/11/14/19/honor-2631271_1280.jpg'),
(5, 'Zen Socken', 'Männer,Frauen,Unisex', 12.99, 'one-size', 'Violett,Grün,Orange', 'Accessories', 'https://cdn.pixabay.com/photo/2017/08/11/14/19/honor-2631271_1280.jpg'),
(6, 'Monkeys Polo ', 'Männer', 21.99, 'S,M,L,XL,XXL', 'Orange,Schwarz', 'Tshirt', 'https://cdn.pixabay.com/photo/2017/08/11/14/19/honor-2631271_1280.jpg'),
(7, 'T-Shirt Striped', 'Männer,Frauen,Unisex', 39.99, 'S,M,L,XL,XXL', 'Schwarz-Weiß,Rot-Blau', 'Tshirt', 'https://cdn.pixabay.com/photo/2017/08/11/14/19/honor-2631271_1280.jpg'),
(8, 'Baggy Jeans', 'Männer', 79.99, 'M,L,XL,XXL', 'Black,Gray', 'Hose', 'https://cdn.pixabay.com/photo/2017/08/11/14/19/honor-2631271_1280.jpg'),
(9, 'Hoodie mit Aufdruck', 'Männer,Frauen,Unisex', 99.99, 'L,XL,XXL,3XL', 'Schwarz,Grau,Dunkelblau', 'Hoodie', 'https://cdn.pixabay.com/photo/2017/08/11/14/19/honor-2631271_1280.jpg'),
(10, 'Anzug', 'Männer', 239.99, 'M,L,XL', 'Schwarz,Blau,Grau', 'Anzug', 'https://cdn.pixabay.com/photo/2017/08/11/14/19/honor-2631271_1280.jpg');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `orders`
--

CREATE TABLE `orders` (
  `user_id` int(10) NOT NULL,
  `a_id` int(10) NOT NULL,
  `r_id` int(10) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `receipt`
--

CREATE TABLE `receipt` (
  `id` int(10) NOT NULL,
  `timestamp` datetime NOT NULL,
  `user_id` int(10) NOT NULL,
  `total` int(10) NOT NULL,
  `status` varchar(10) NOT NULL,
  `artikel` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `id` int(32) NOT NULL,
  `vorname` varchar(20) NOT NULL,
  `nachname` varchar(20) NOT NULL,
  `adresse` varchar(20) NOT NULL,
  `adresse2` varchar(20) DEFAULT NULL,
  `ort` varchar(20) NOT NULL,
  `plz` varchar(6) NOT NULL,
  `land` varchar(3) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  `email` varchar(20) NOT NULL,
  `aktiv` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`id`, `vorname`, `nachname`, `adresse`, `adresse2`, `ort`, `plz`, `land`, `username`, `password`, `isAdmin`, `email`, `aktiv`) VALUES
(1, 'Lukas', 'Huber', 'Leithastraße', NULL, 'Wien', '1200', 'AT', 'admin', 'admin', 1, 'admin@gmail.com', 1),
(11, 'test', 'test', 'test', 'test', 'test', '213', 'AT', 'test', '$2y$10$5a7ccNp0YM8Yy', NULL, 'testtesttest@gmail.c', 0),
(12, 'final', 'test', 'test', 'test', 'test', '1200', 'AT', 'test', '$2y$10$IGl3vLgWF0qHQ', NULL, 'correctEmailFormat@g', 0),
(13, 'abc', 'abc', 'abc', 'avb', 'wien', '1200', 'AT', 'test', '$2y$10$2YLgOYESydQYn', NULL, 'realEmail@gmail.com', 0),
(14, 'test', 'test', 'test', 'test', 'test', '1200', 'AT', 'newUser', '$2y$10$3fLf65SdATM7M', NULL, 'newEmail@gmail.com', 0);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `artikel`
--
ALTER TABLE `artikel`
  ADD PRIMARY KEY (`art_num`);

--
-- Indizes für die Tabelle `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `test` (`user_id`),
  ADD KEY `r_id` (`r_id`),
  ADD KEY `a_id` (`a_id`);

--
-- Indizes für die Tabelle `receipt`
--
ALTER TABLE `receipt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `receipt`
--
ALTER TABLE `receipt`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `id` int(32) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`r_id`) REFERENCES `receipt` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`a_id`) REFERENCES `artikel` (`art_num`),
  ADD CONSTRAINT `test` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints der Tabelle `receipt`
--
ALTER TABLE `receipt`
  ADD CONSTRAINT `receipt_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `orders` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
