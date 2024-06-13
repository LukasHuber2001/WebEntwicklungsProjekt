-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 13. Jun 2024 um 11:54
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
  `email` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Daten für Tabelle `users`
--

INSERT INTO `users` (`id`, `vorname`, `nachname`, `adresse`, `adresse2`, `ort`, `plz`, `land`, `username`, `password`, `isAdmin`, `email`) VALUES
(1, 'Lukas', 'Huber', 'Leithastraße', NULL, 'Wien', '1200', 'AT', 'admin', 'admin', 1, 'admin@gmail.com'),
(11, 'test', 'test', 'test', 'test', 'test', '213', 'AT', 'test', '$2y$10$5a7ccNp0YM8Yy', NULL, 'testtesttest@gmail.c'),
(12, 'final', 'test', 'test', 'test', 'test', '1200', 'AT', 'test', '$2y$10$IGl3vLgWF0qHQ', NULL, 'correctEmailFormat@g'),
(13, 'abc', 'abc', 'abc', 'avb', 'wien', '1200', 'AT', 'test', '$2y$10$2YLgOYESydQYn', NULL, 'realEmail@gmail.com');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `id` int(32) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
