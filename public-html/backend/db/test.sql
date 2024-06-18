-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 18. Jun 2024 um 22:38
-- Server-Version: 10.4.28-MariaDB
-- PHP-Version: 8.2.4

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
(1, 'T-Red', 'Männer,Frauen,Unisex', 19.99, 'S,M,L,XL,XXL', 'Red', 'Tshirt', '../../backend/data/pictures/products/art1.png'),
(2, 'Leathermen', 'Männer', 79.99, 'M,L,XL,XXL', 'Brown', 'Jacke', '../../backend/data/pictures/products/art2.png'),
(3, 'Diamond Wristband', 'Frauen', 29.99, 'S,M,L', 'Silver', 'Accessoires', '../../backend/data/pictures/products/art3.png'),
(4, 'Monkey Basketball shorts men', 'Männer', 19.99, 'S,M,L,XL,XXL', 'Green,Violet', 'Hosen', '../../backend/data/pictures/products/art4.png'),
(5, 'Zen Socks', 'Männer,Frauen,Unisex', 12.99, 'one-size', 'Violet, Yellow, Orange', 'Accessories', '../../backend/data/pictures/products/art5.png'),
(6, 'Monkeys Polo ', 'Männer', 21.99, 'S,M,L,XL,XXL', 'Green, Violet', 'Tshirt', '../../backend/data/pictures/products/art6.png'),
(7, 'T-Shirt Striped', 'Männer,Frauen,Unisex', 39.99, 'S,M,L,XL,XXL', 'Black, White', 'Tshirt', '../../backend/data/pictures/products/art7.png'),
(8, 'Baggy Jeans', 'Männer', 79.99, 'M,L,XL,XXL', 'Blue', 'Hose', '../../backend/data/pictures/products/art8.png'),
(9, 'Hoodie with Print', 'Männer,Frauen,Unisex', 99.99, 'L,XL,XXL,3XL', 'Dark Grey', 'Hoodie', '../../backend/data/pictures/products/art9.png'),
(10, 'The 007', 'Männer', 239.99, 'M,L,XL', 'Black', 'Anzug', '../../backend/data/pictures/products/art10.png');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `orders`
--

CREATE TABLE `orders` (
  `a_id` int(10) NOT NULL,
  `r_id` int(10) NOT NULL,
  `id` int(11) NOT NULL,
  `preis` float NOT NULL,
  `anzahl` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Daten für Tabelle `orders`
--

INSERT INTO `orders` (`a_id`, `r_id`, `id`, `preis`, `anzahl`) VALUES
(2, 20, 39, 79.99, 1),
(5, 20, 40, 12.99, 1),
(8, 20, 41, 79.99, 1),
(9, 20, 42, 99.99, 2),
(10, 21, 43, 239.99, 1),
(7, 21, 44, 39.99, 1),
(4, 21, 45, 19.99, 1),
(6, 21, 46, 21.99, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `receipt`
--

CREATE TABLE `receipt` (
  `id` int(10) NOT NULL,
  `datum` datetime NOT NULL,
  `user_id` int(10) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `ort` varchar(20) NOT NULL,
  `land` varchar(20) NOT NULL,
  `plz` varchar(6) NOT NULL,
  `adresse` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Daten für Tabelle `receipt`
--

INSERT INTO `receipt` (`id`, `datum`, `user_id`, `total`, `ort`, `land`, `plz`, `adresse`) VALUES
(18, '2024-06-18 22:11:29', 20, 250.00, 'Wien', 'AT', '1200', 'Leithastraße 25'),
(19, '2024-06-18 22:12:49', 20, 579.92, 'Wien', 'AT', '1200', 'Leithastraße 25'),
(20, '2024-06-18 22:13:51', 20, 372.95, 'Wien', 'AT', '1200', 'Leithastraße 25'),
(21, '2024-06-18 22:14:13', 20, 321.96, 'Wien', 'AT', '1200', 'Leithastraße 25');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `id` int(250) NOT NULL,
  `vorname` varchar(250) NOT NULL,
  `nachname` varchar(250) NOT NULL,
  `adresse` varchar(250) NOT NULL,
  `ort` varchar(250) NOT NULL,
  `plz` varchar(250) NOT NULL,
  `land` varchar(250) NOT NULL,
  `username` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  `email` varchar(250) NOT NULL,
  `aktiv` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`id`, `vorname`, `nachname`, `adresse`, `ort`, `plz`, `land`, `username`, `password`, `isAdmin`, `email`, `aktiv`) VALUES
(1, 'admin', 'admin', 'Wienerstraße', 'schwechat', '2320', 'AT', 'admin', '$2y$10$r0o2jT1HdO.M8p4EHHlPxeIE1ZwpSpORdXXqXcNqH6JitUJSuVUmW', 1, 'admin@gmail.com', 1),
(20, 'Lukas', 'Huber', 'Leithastraße 25', 'Wien', '1200', 'AT', 'lukashuber', '$2y$10$aRHpeOHkgBQfUNdc.AJgP.vQK6lZc9bdYeq0FrZIysPDlTdNdb0ea', 0, 'LukasHuber@gmail.com', 1);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT für Tabelle `receipt`
--
ALTER TABLE `receipt`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `id` int(250) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`r_id`) REFERENCES `receipt` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`a_id`) REFERENCES `artikel` (`art_num`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
