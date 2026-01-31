-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 28 يناير 2026 الساعة 06:52
-- إصدار الخادم: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gameswebsit_db`
--

-- --------------------------------------------------------

--
-- بنية الجدول `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` char(255) NOT NULL,
  `role` enum('admin','user') NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT current_timestamp(),
  `reset_code` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- إرجاع أو استيراد بيانات الجدول `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `reg_date`, `reset_code`) VALUES
(1, 'jamal', 'jmalaldynalqady145@gmail.com', '$2y$10$U4Kvi/gOCoRznobLZmfIlerodQKIYXPOiX.dr8P54RV9AAWV5qnVK', 'user', '2026-01-27 06:08:10', NULL),
(2, 'ali', 'ali@fake.com', '$2y$10$/YB0TM9sOeArC2tarQNWCOT79dgzPqg1RWSsU.hBcNoJhCiAxtW0C', 'admin', '2026-01-27 08:42:51', NULL),
(3, 'Alaa', 'alaa@fake.com', '$2y$10$zLYMXNwjliZfpqomWc.kFOaAcPGOo0Gd2IO.j7uwAxgltlh9vmERi', 'user', '2026-01-27 20:36:58', NULL),
(4, 'osama', 'osama@gmail.com', '$2y$10$zad1NE6OjLt6Yw00UVJVd.fuUhoevSStJXGQZnCDGrLWYmKhh6LP6', 'admin', '2026-01-27 20:43:19', NULL),
(5, 'osama', 'osama779@gmail.com', '$2y$10$29AFvx2Ggx2VDbDlVcJ9s.k/lPzEE1VmHBWYUPH6okTIO9j7lZLlC', 'user', '2026-01-27 20:45:27', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
