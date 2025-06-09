-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 28 mai 2025 à 15:59
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `react-laravel-project`
--

-- --------------------------------------------------------

--
-- Structure de la table `admins`
--

CREATE TABLE `admins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `motdepasse` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `admins`
--

INSERT INTO `admins` (`id`, `username`, `email`, `motdepasse`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@example.com', '$2y$12$jZ23c8PMKmEzoTif3ghxkeTs.POxBcv9tLY5qdxjy0TkKYHa/pqW6', NULL, '2025-05-18 00:24:35', '2025-05-22 19:03:05');

-- --------------------------------------------------------

--
-- Structure de la table `blacklists`
--

CREATE TABLE `blacklists` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_entreprise` bigint(20) UNSIGNED NOT NULL,
  `nom_entreprise_post` varchar(255) NOT NULL,
  `nom_entreprise_fraud` varchar(255) NOT NULL,
  `raison` text NOT NULL,
  `preuve_file` varchar(255) DEFAULT NULL,
  `post_date` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `blacklists`
--

INSERT INTO `blacklists` (`id`, `id_entreprise`, `nom_entreprise_post`, `nom_entreprise_fraud`, `raison`, `preuve_file`, `post_date`, `created_at`, `updated_at`) VALUES
(7, 8, 'salma', 'cdfd', 'sddddddddddd', 'preuves/oKm824llOMcvrbFqOL0J9m5r8AKVWQKc2zArHx6r.pdf', '2025-05-28 13:33:24', '2025-05-28 13:33:24', '2025-05-28 12:33:24'),
(8, 1, 'Entreprise A', 'Entreprise Frauduleuse A', 'Factures falsifiées', 'preuve_a.pdf', '2025-05-28 14:34:46', '2025-05-28 13:34:46', '2025-05-28 13:34:46'),
(9, 2, 'Entreprise B', 'Entreprise Frauduleuse B', 'Non-respect des délais', 'preuve_b.pdf', '2025-05-28 14:34:46', '2025-05-28 13:34:46', '2025-05-28 13:34:46');

-- --------------------------------------------------------

--
-- Structure de la table `entreprises`
--

CREATE TABLE `entreprises` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ice` varchar(255) NOT NULL,
  `rc` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `motdepasse` varchar(255) NOT NULL,
  `date_creation` date NOT NULL DEFAULT '2025-05-17',
  `id_secteur` bigint(20) UNSIGNED NOT NULL,
  `status` enum('accepté','en attente','refusé') NOT NULL DEFAULT 'en attente',
  `admin` tinyint(1) NOT NULL DEFAULT 0,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `entreprises`
--

INSERT INTO `entreprises` (`id`, `ice`, `rc`, `username`, `address`, `email`, `motdepasse`, `date_creation`, `id_secteur`, `status`, `admin`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, '22222555', '2222222', 'amazon', 'kenitra', 'amazon@gmail.com', '$2y$12$e359VZd8w2anXry9knIeGe.idZQfGNdt44V42p1vpGeY.2XRHI.RK', '2025-05-17', 1, 'accepté', 0, NULL, '2025-05-17 22:21:39', '2025-05-17 22:21:39'),
(2, '59888', '471855', 'black', 'rabat', 'black@gmail.com', '$2y$12$LPZHBvNrl5wwindjU0IDc.BjfFfUloNJNcmHWdGvCUfOTCWmc0bZC', '2025-05-17', 1, 'en attente', 0, NULL, '2025-05-17 23:28:47', '2025-05-17 23:28:47'),
(3, '88562', '17282828', 'nbn', 'rabat', 'nb@gmail.com', '$2y$12$mQV7kc8qlHlzib1mdddUGOPHaoSLvg48axpfO3tcimHkNqAROdRua', '2025-05-17', 1, 'accepté', 0, NULL, '2025-05-17 23:42:32', '2025-05-27 21:03:49'),
(4, '5365858', '255', '255d', 'rabat', '25@gmail.com', '$2y$12$IEbhB7dlFN.5jaCKDhCHP.mfK9jzsNlhnr8mP7pbYfL5i28Yp5eha', '2025-05-17', 1, 'refusé', 0, NULL, '2025-05-18 09:25:38', '2025-05-27 21:03:45'),
(7, '0012345670001', 'RC123456', 'NomEntreprise', '123 Rue Exemple, Ville', 'entreprise@example.com', 'e10adc3949ba59abbe56e057f20f883e', '2025-05-22', 1, 'accepté', 0, NULL, '2025-05-22 20:47:54', '2025-05-22 20:47:54'),
(8, '121212121212', '12121212', 'salma', 'maroc', 'salmahaddoute@gmail.com', '$2y$12$ZGEkLi21KiIKOa.AdjRIqOms4cE2MDDyvj95fgEHx0WXNDXneVxm2', '2025-05-17', 1, 'accepté', 0, NULL, '2025-05-22 20:10:24', '2025-05-22 20:29:30');

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2016_06_01_000001_create_oauth_auth_codes_table', 1),
(4, '2016_06_01_000002_create_oauth_access_tokens_table', 1),
(5, '2016_06_01_000003_create_oauth_refresh_tokens_table', 1),
(6, '2016_06_01_000004_create_oauth_clients_table', 1),
(7, '2016_06_01_000005_create_oauth_personal_access_clients_table', 1),
(8, '2019_08_19_000000_create_failed_jobs_table', 1),
(9, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(10, '2025_05_17_191450_create_secteurs_table', 1),
(11, '2025_05_17_191528_create_entreprises_table', 1),
(12, '2025_05_17_191555_create_admins_table', 1),
(13, '2025_05_17_201718_make_date_creation_nullable_in_entreprises_table', 1),
(14, '2025_05_17_220916_hash_existing_passwords', 1),
(15, '2025_05_17_224953_create_admins_table', 2);

-- --------------------------------------------------------

--
-- Structure de la table `oauth_access_tokens`
--

CREATE TABLE `oauth_access_tokens` (
  `id` varchar(100) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `scopes` text DEFAULT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `oauth_auth_codes`
--

CREATE TABLE `oauth_auth_codes` (
  `id` varchar(100) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `scopes` text DEFAULT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `oauth_clients`
--

CREATE TABLE `oauth_clients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `secret` varchar(100) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `redirect` text NOT NULL,
  `personal_access_client` tinyint(1) NOT NULL,
  `password_client` tinyint(1) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `oauth_personal_access_clients`
--

CREATE TABLE `oauth_personal_access_clients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `oauth_refresh_tokens`
--

CREATE TABLE `oauth_refresh_tokens` (
  `id` varchar(100) NOT NULL,
  `access_token_id` varchar(100) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `observations`
--

CREATE TABLE `observations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reclamation_id` bigint(20) UNSIGNED NOT NULL,
  `rc` varchar(255) DEFAULT NULL,
  `ice` varchar(255) DEFAULT NULL,
  `nom_entreprise_post` varchar(255) DEFAULT NULL,
  `nom_entreprise_fraud` varchar(255) DEFAULT NULL,
  `reclamation` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `observations`
--

INSERT INTO `observations` (`id`, `reclamation_id`, `rc`, `ice`, `nom_entreprise_post`, `nom_entreprise_fraud`, `reclamation`, `created_at`, `updated_at`) VALUES
(14, 8, 'RC321654', 'ICE202400002', 'DISTRIBOMAROC', 'LOGISTIC PRO', 'nnnn', '2025-05-04 23:07:18', '2025-05-04 23:07:18'),
(15, 10, NULL, NULL, 'Entreprise Alpha', 'Entreprise Beta', 'Aucune preuve suffisante fournie pour valider la réclamation.', '2025-05-05 00:00:00', '2025-05-05 00:00:00'),
(16, 11, NULL, NULL, 'Entreprise Gamma', 'Entreprise Delta', 'Réclamation rejetée faute de détails concrets.', '2025-05-05 00:00:00', '2025-05-05 00:00:00'),
(17, 9, 'RC987123', 'ICE202400003', 'ELECTROHOME', 'GLOBAL ELECTRONICS', 'hh', '2025-05-06 01:07:39', '2025-05-06 01:07:39'),
(18, 9, 'RC987123', 'ICE202400003', 'ELECTROHOME', 'GLOBAL ELECTRONICS', 'nllllllll', '2025-05-06 01:51:52', '2025-05-06 01:51:52'),
(19, 7, 'RC789456', 'ICE202400001', 'SARL TechnoPlus', 'STAR SERVICES', 'jj', '2025-05-06 19:04:31', '2025-05-06 19:04:31'),
(20, 9, 'RC987123', 'ICE202400003', 'ELECTROHOME', 'GLOBAL ELECTRONICS', 'nnn', '2025-05-06 20:15:12', '2025-05-06 20:15:12'),
(21, 10, '', '', 'Entreprise Alpha', 'Entreprise Beta', 'nn', '2025-05-19 00:39:36', '2025-05-19 00:39:36'),
(22, 10, '', '', 'Entreprise Alpha', 'Entreprise Beta', 'ww', '2025-05-19 19:02:29', '2025-05-19 19:02:29'),
(23, 12, '123456789', '987654321', 'Entreprise ABC', 'hhh', 'hhh', '2025-05-19 19:02:47', '2025-05-19 19:02:47'),
(24, 15, '12121212', '121212121212', 'salma', 'xx', 'bbbbbbbbbbb', '2025-05-27 21:04:48', '2025-05-27 21:04:48'),
(25, 13, '12121212', '121212121212', 'salma', 'cccc', 'vvvvvvv', '2025-05-28 11:13:15', '2025-05-28 11:13:15'),
(26, 19, '12121212', '121212121212', 'salma', 'ddddd', 'bbb', '2025-05-28 11:13:58', '2025-05-28 11:13:58');

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\Admin', 1, 'admin-token', '897b96fb6d7dbf684b916e458bb97cb5a0d3d321793f5995b28fed68c7b4bbde', '[\"*\"]', NULL, NULL, '2025-05-18 00:25:03', '2025-05-18 00:25:03'),
(2, 'App\\Models\\Admin', 1, 'admin-token', '8fa244ffe3d23c7739ad15528cb1af468771c5eba7ecd79087e67bde301f647d', '[\"*\"]', NULL, NULL, '2025-05-18 00:25:12', '2025-05-18 00:25:12'),
(3, 'App\\Models\\Admin', 1, 'admin-token', 'f6797a208ebc2064e169eb63b5cb20c3c3a9e9c4b217641aef22f56d8bccc4ad', '[\"*\"]', NULL, NULL, '2025-05-18 08:57:34', '2025-05-18 08:57:34'),
(4, 'App\\Models\\Admin', 1, 'admin-token', '00827dae80cc821848372bf500ac892e9178ac46a4a3c7dc748b9209316e5a0e', '[\"*\"]', NULL, NULL, '2025-05-18 08:58:13', '2025-05-18 08:58:13'),
(5, 'App\\Models\\Admin', 1, 'admin-token', '91b773f8e0265f9490699622e1c11a5bbe2f4a37795df709332b38ca85bd92ac', '[\"*\"]', NULL, NULL, '2025-05-18 09:17:59', '2025-05-18 09:17:59'),
(6, 'App\\Models\\Admin', 1, 'admin-token', '6a8c96a9b192a7923343ec786d82cfe88e22a15c6f3ac8b460fb2973759de6ee', '[\"*\"]', NULL, NULL, '2025-05-18 09:19:18', '2025-05-18 09:19:18'),
(7, 'App\\Models\\Admin', 1, 'admin-token', '3e3bd3aa40214bb6fe0000c6f021dfc83d9f10d1676a13a0364bf9e5cac25d2c', '[\"*\"]', NULL, NULL, '2025-05-18 09:20:01', '2025-05-18 09:20:01'),
(8, 'App\\Models\\Admin', 1, 'admin-token', '84e10a45fb71d86aab996ac817f3021cf6ecab645ac73b22815f3a8007ee6342', '[\"*\"]', NULL, NULL, '2025-05-18 09:23:39', '2025-05-18 09:23:39'),
(9, 'App\\Models\\Admin', 1, 'admin-token', 'bda96764f6436d7af5938f082715644194f278c30659863a5b20822984d10214', '[\"*\"]', '2025-05-22 19:20:08', NULL, '2025-05-22 15:51:41', '2025-05-22 19:20:08'),
(10, 'App\\Models\\Admin', 1, 'admin-token', 'fe81739eab7103b845fa6b06605af16daf718869a7447352daf5ddbba511f2c9', '[\"*\"]', NULL, NULL, '2025-05-22 15:52:00', '2025-05-22 15:52:00'),
(11, 'App\\Models\\Admin', 1, 'admin-token', '6ba15ea3cb407d85c7e061a865a1dfdb35f9956e758e423ffd07f7590f63a7d9', '[\"*\"]', '2025-05-22 18:57:46', NULL, '2025-05-22 15:55:07', '2025-05-22 18:57:46'),
(12, 'App\\Models\\Admin', 1, 'admin-token', '07a50c4616d06dec51d7ed568b8e732f7db9d37caa91dd83a1c47c87bffbd441', '[\"*\"]', NULL, NULL, '2025-05-22 16:20:16', '2025-05-22 16:20:16'),
(13, 'App\\Models\\Admin', 1, 'admin-token', 'ef5bd4d12a41fb27dcbc81989e92cdf3503e5e5aed685a5acb8ebf21a25b2f00', '[\"*\"]', '2025-05-22 19:04:11', NULL, '2025-05-22 16:21:15', '2025-05-22 19:04:11'),
(14, 'App\\Models\\Admin', 1, 'auth_token', 'd942b5cc047ad22c64328bc6691a00d09cc697c874d6632e2de575c96a047623', '[\"*\"]', '2025-05-22 19:20:09', NULL, '2025-05-22 19:13:30', '2025-05-22 19:20:09'),
(15, 'App\\Models\\Admin', 1, 'auth_token', '2e8c8695bc122ee71bc9c7f6183de88de2850738f9f0bd4c84f3204a79612324', '[\"*\"]', '2025-05-22 19:41:09', NULL, '2025-05-22 19:40:35', '2025-05-22 19:41:09'),
(16, 'App\\Models\\Admin', 1, 'auth_token', 'e21f3e1af52331ab414ef99cd3c69973fefaed64dbd49654b6e25454e0b6baaa', '[\"*\"]', '2025-05-22 19:42:23', NULL, '2025-05-22 19:41:18', '2025-05-22 19:42:23'),
(17, 'App\\Models\\Admin', 1, 'auth_token', '97fdc263d218a6278e52415bde70b4169591f171d97ea730b3057154c3693ac1', '[\"*\"]', '2025-05-22 19:43:04', NULL, '2025-05-22 19:42:36', '2025-05-22 19:43:04'),
(18, 'App\\Models\\Admin', 1, 'auth_token', 'c202e18e87c651360eb47bcd1245a110b618f298af8a71f3e4f60e2c93a7c43c', '[\"*\"]', '2025-05-22 19:50:59', NULL, '2025-05-22 19:50:35', '2025-05-22 19:50:59'),
(19, 'App\\Models\\Admin', 1, 'auth_token', '0b68b908a4b97e5b5975f36d3ef5519744f3029515b7643242be9dbb97cb562a', '[\"*\"]', NULL, NULL, '2025-05-22 19:55:25', '2025-05-22 19:55:25'),
(20, 'App\\Models\\Admin', 1, 'auth_token', '01d1999a00c1d1e11cd9928aece4c29fd0c749b74452a26a18b1ab78450a3a50', '[\"*\"]', NULL, NULL, '2025-05-22 20:02:14', '2025-05-22 20:02:14'),
(21, 'App\\Models\\Admin', 1, 'auth_token', '288bf5a1b838009ab364c7413ba24abd51e62afca3ee07b147e68606bc50e822', '[\"*\"]', '2025-05-22 20:21:41', NULL, '2025-05-22 20:16:52', '2025-05-22 20:21:41'),
(22, 'App\\Models\\Admin', 1, 'auth_token', 'efa0961a953a609613985e31627db418c86d8b4351c9f79e1352cb7530ca1a14', '[\"*\"]', '2025-05-22 20:29:26', NULL, '2025-05-22 20:22:45', '2025-05-22 20:29:26'),
(23, 'App\\Models\\Entreprise', 8, 'auth_token', 'aad198b67cd288301fcece8895953088d941e34e6e8e9680c46228cffe6e5ab2', '[\"*\"]', '2025-05-22 20:55:13', NULL, '2025-05-22 20:35:22', '2025-05-22 20:55:13'),
(25, 'App\\Models\\Entreprise', 8, 'auth_token', '65c787820e41673f6c76336c4d50f39613afce6af68ba098a6158c354e280c6a', '[\"*\"]', '2025-05-27 21:03:17', NULL, '2025-05-22 21:44:38', '2025-05-27 21:03:17'),
(26, 'App\\Models\\Admin', 1, 'auth_token', 'db9d16e1567873b473f1b6ff4bafaa18b33113917d97ba7206ed50c6ea954a6b', '[\"*\"]', '2025-05-28 12:33:21', NULL, '2025-05-27 21:03:27', '2025-05-28 12:33:21'),
(27, 'App\\Models\\Entreprise', 8, 'auth_token', '180d98de1f014144df4f54181f485ba483bc421be25248ada8939072897216da', '[\"*\"]', '2025-05-28 12:53:59', NULL, '2025-05-27 21:09:35', '2025-05-28 12:53:59');

-- --------------------------------------------------------

--
-- Structure de la table `reclamations`
--

CREATE TABLE `reclamations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_entreprise` bigint(20) UNSIGNED NOT NULL,
  `rc` varchar(255) NOT NULL,
  `ice` varchar(255) NOT NULL,
  `nom_entreprise_post` varchar(255) NOT NULL,
  `nom_entreprise_fraud` varchar(255) NOT NULL,
  `raison` text NOT NULL,
  `preuve_file` varchar(255) NOT NULL,
  `status` enum('en attente','validé','rejeté') NOT NULL DEFAULT 'en attente',
  `post_date` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reclamations`
--

INSERT INTO `reclamations` (`id`, `id_entreprise`, `rc`, `ice`, `nom_entreprise_post`, `nom_entreprise_fraud`, `raison`, `preuve_file`, `status`, `post_date`, `created_at`, `updated_at`) VALUES
(7, 1, 'RC789456', 'ICE202400001', 'SARL TechnoPlus', 'STAR SERVICES', 'Non-paiement de la facture F2024-056 après 3 relances', 'facture_F2024-056.pdf', 'en attente', '2025-05-04 23:06:06', '2025-05-04 23:06:06', '2025-05-19 18:18:50'),
(8, 1, 'RC321654', 'ICE202400002', 'DISTRIBOMAROC', 'LOGISTIC PRO', 'Retard de 15 jours sur la livraison commande LC-4555', 'preuves/27csXIPcJMa9BnfJjbRTe91x4UFGijpcbRhtK0Gh.png', 'validé', '2024-03-15 14:30:00', '2025-05-04 23:06:27', '2025-05-27 21:07:31'),
(9, 1, 'RC987123', 'ICE202400003', 'ELECTROHOME', 'GLOBAL ELECTRONICS', '30% des produits livrés sont non fonctionnels', 'photos_defauts.zip', 'validé', '2024-02-28 09:15:00', '2025-05-04 23:06:47', '2025-05-22 19:43:43'),
(10, 1, '', '', 'Entreprise Alpha', 'Entreprise Beta', 'Fraude suspectée sur une transaction', 'Uploads/proof1.jpg', 'rejeté', '0000-00-00 00:00:00', '2025-05-05 00:00:00', '2025-05-19 19:02:29'),
(11, 2, '', '', 'Entreprise Gamma', 'Entreprise Delta', 'Mauvaise qualité des services fournis', 'Uploads/proof2.pdf', 'validé', '0000-00-00 00:00:00', '2025-05-05 00:00:00', '2025-05-06 01:51:33'),
(12, 1, '123456789', '987654321', 'Entreprise ABC', 'hhh', 'w', 'preuves/f2XUbVjU5ehcOWd1HEKzQCZBnNU1TbPe5vl0JHJe.png', 'rejeté', '2025-05-19 19:49:32', '2025-05-19 18:49:32', '2025-05-19 19:02:47'),
(13, 8, '12121212', '121212121212', 'salma', 'cccc', 'cccccccccccccc', 'preuves/iq0QIhKYCI9aNFQIpBovn1v2MwctafISxeDhP6gU.png', 'validé', '2025-05-22 22:48:07', '2025-05-22 20:48:09', '2025-05-28 12:26:25'),
(14, 8, '12121212', '121212121212', 'salma', 'xxxxx', 'xxxxxxxxxx', 'preuves/JdiJqVNJorNLflRalpNbCI0xNQitCmw2RTtGEoqP.png', 'validé', '2025-05-22 22:53:11', '2025-05-22 20:53:13', '2025-05-27 21:04:41'),
(15, 8, '12121212', '121212121212', 'salma', 'xx', 'xxxxxxxxxxxxx', 'preuves/69fIkmDp7vcmVv6gxVTPRC90L3sTQF4mYnhyASEV.png', 'rejeté', '2025-05-22 23:00:50', '2025-05-22 21:00:51', '2025-05-27 21:04:48'),
(16, 8, '12121212', '121212121212', 'salma', 'cc', 'dddddddd', 'preuves/Cd999zCbo4hNrqVUKkoZcJL2W0xYJ4Tq1bVA8BOf.png', 'validé', '2025-05-22 23:35:12', '2025-05-22 21:35:13', '2025-05-27 21:07:03'),
(17, 8, '12121212', '121212121212', 'salma', 'CCCCCCCCCCCCC', 'cccccccccc', 'preuves/yIq6kDEct3PaJbTofDqeD4IZ0a0zHfHNaUkNYoBO.pdf', 'validé', '2025-05-22 23:35:56', '2025-05-22 21:35:57', '2025-05-27 21:04:37'),
(18, 8, '12121212', '121212121212', 'salma', 'ZZ', 'ZZ', 'preuves/wDdIsQ8j6U3gPmV2Ki3yrIVJ6kD7DBHSKtk1z8Go.pdf', 'validé', '2025-05-28 12:40:00', '2025-05-28 10:40:02', '2025-05-28 12:26:23'),
(19, 8, '12121212', '121212121212', 'salma', 'ddddd', 'ccccccccccccccc', 'preuves/VAlxaseBEMN0nAFhcMBL5IvQYyYhgdUJnYEAzoeH.pdf', 'rejeté', '2025-05-28 12:49:17', '2025-05-28 10:49:19', '2025-05-28 11:13:58'),
(20, 8, '12121212', '121212121212', 'salma', 'cdfd', 'sddddddddddd', 'preuves/oKm824llOMcvrbFqOL0J9m5r8AKVWQKc2zArHx6r.pdf', 'validé', '2025-05-28 14:33:00', '2025-05-28 12:33:01', '2025-05-28 12:33:24');

--
-- Déclencheurs `reclamations`
--
DELIMITER $$
CREATE TRIGGER `reclamation_to_blacklist` AFTER UPDATE ON `reclamations` FOR EACH ROW BEGIN
    IF NEW.status = 'accepter' AND OLD.status != 'accepter' THEN
        INSERT INTO blacklists (
            id_entreprise,
            nom_entreprise_post,
            nom_entreprise_fraud,
            raison,
            preuve_file,
            post_date
        )
        VALUES (
            NEW.id_entreprise,
            NEW.nom_entreprise_post,
            NEW.nom_entreprise_fraud,
            NEW.raison,
            NEW.preuve_file,
            NEW.post_date
        );
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trigger_copy_to_blacklists` AFTER UPDATE ON `reclamations` FOR EACH ROW BEGIN
  -- Vérifie si le statut a changé et est maintenant 'validé' ou 'accepté'
  IF (OLD.status != NEW.status) AND (NEW.status = 'validé' OR NEW.status = 'accepté') THEN
    INSERT INTO blacklists (
      id_entreprise,
      nom_entreprise_post,
      nom_entreprise_fraud,
      raison,
      preuve_file,
      post_date,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id_entreprise,
      NEW.nom_entreprise_post,
      NEW.nom_entreprise_fraud,
      NEW.raison,
      NEW.preuve_file,
      NEW.post_date,
      NOW(),
      NOW()
    );
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `secteurs`
--

CREATE TABLE `secteurs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `secteurs`
--

INSERT INTO `secteurs` (`id`, `nom`, `created_at`, `updated_at`) VALUES
(1, 'nnn', NULL, NULL),
(5, 'bbb', '2025-05-19 00:39:10', '2025-05-19 00:39:10'),
(6, 'dd', '2025-05-19 00:39:15', '2025-05-19 00:39:15'),
(7, 'x', '2025-05-22 19:41:52', '2025-05-22 19:41:52');

-- --------------------------------------------------------

--
-- Structure de la table `techniciens`
--

CREATE TABLE `techniciens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cin` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `id_secteur` bigint(20) UNSIGNED DEFAULT NULL,
  `id_entreprise` bigint(20) UNSIGNED NOT NULL,
  `telephone` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `techniciens`
--

INSERT INTO `techniciens` (`id`, `cin`, `nom`, `adresse`, `email`, `id_secteur`, `id_entreprise`, `telephone`, `created_at`, `updated_at`) VALUES
(1, 'AA123456', 'Ali Benbrahim', 'Casablanca', 'ali.benbrahim@example.com', 1, 1, '0612345678', '2025-05-01 16:07:56', '2025-05-01 16:07:56'),
(2, 'BB234567', 'Fatima Zahra', 'Rabat', 'fatima.zahra@example.com', 2, 2, '0623456789', '2025-05-01 16:07:56', '2025-05-01 16:07:56'),
(3, 'CC345678', 'Omar Elhassani', 'Fès', 'omar.elhassani@example.com', 1, 1, '0634567890', '2025-05-01 16:07:56', '2025-05-01 16:07:56'),
(4, 'DD456789', 'Sara Idrissi', 'Tanger', 'sara.idrissi@example.com', 3, 3, '0645678901', '2025-05-01 16:07:56', '2025-05-01 16:07:56'),
(5, 'EE567890', 'Youssef Amrani', 'Agadir', 'youssef.amrani@example.com', 2, 2, '0656789012', '2025-05-01 16:07:56', '2025-05-01 16:07:56'),
(6, 'g0297h', 'j', 'uj', 'j@gmail.com', 1, 1, 'i', '2025-05-17 11:18:41', '2025-05-17 11:18:41'),
(7, 'x121212', 'haddoute', 'maroc', 'salmahaddoute@gmail.com', 6, 1, '0602706976', '2025-05-22 21:47:49', '2025-05-22 21:47:49'),
(8, 'xx', 'xxxxxxx', 'xxxxxx', 'xyz@gmail.com', 5, 1, '0602706976', '2025-05-28 12:11:48', '2025-05-28 12:11:48'),
(9, 'x12121233', 'salma', 'salma', 'salma@gmail.com', 1, 8, '0602706344', '2025-05-28 12:18:10', '2025-05-28 12:18:10');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_username_unique` (`username`),
  ADD UNIQUE KEY `admins_email_unique` (`email`);

--
-- Index pour la table `blacklists`
--
ALTER TABLE `blacklists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `blacklists_id_entreprise_foreign` (`id_entreprise`);

--
-- Index pour la table `entreprises`
--
ALTER TABLE `entreprises`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `entreprises_ice_unique` (`ice`),
  ADD UNIQUE KEY `entreprises_rc_unique` (`rc`),
  ADD UNIQUE KEY `entreprises_username_unique` (`username`),
  ADD UNIQUE KEY `entreprises_email_unique` (`email`),
  ADD KEY `entreprises_id_secteur_foreign` (`id_secteur`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `oauth_access_tokens`
--
ALTER TABLE `oauth_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_access_tokens_user_id_index` (`user_id`);

--
-- Index pour la table `oauth_auth_codes`
--
ALTER TABLE `oauth_auth_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_auth_codes_user_id_index` (`user_id`);

--
-- Index pour la table `oauth_clients`
--
ALTER TABLE `oauth_clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_clients_user_id_index` (`user_id`);

--
-- Index pour la table `oauth_personal_access_clients`
--
ALTER TABLE `oauth_personal_access_clients`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `oauth_refresh_tokens`
--
ALTER TABLE `oauth_refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`);

--
-- Index pour la table `observations`
--
ALTER TABLE `observations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `observations_reclamation_id_foreign` (`reclamation_id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Index pour la table `reclamations`
--
ALTER TABLE `reclamations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reclamations_id_entreprise_foreign` (`id_entreprise`);

--
-- Index pour la table `secteurs`
--
ALTER TABLE `secteurs`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `techniciens`
--
ALTER TABLE `techniciens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `techniciens_cin_unique` (`cin`),
  ADD UNIQUE KEY `techniciens_email_unique` (`email`),
  ADD KEY `techniciens_id_secteur_foreign` (`id_secteur`),
  ADD KEY `techniciens_id_entreprise_foreign` (`id_entreprise`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `blacklists`
--
ALTER TABLE `blacklists`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `entreprises`
--
ALTER TABLE `entreprises`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT pour la table `oauth_clients`
--
ALTER TABLE `oauth_clients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `oauth_personal_access_clients`
--
ALTER TABLE `oauth_personal_access_clients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `observations`
--
ALTER TABLE `observations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT pour la table `reclamations`
--
ALTER TABLE `reclamations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `secteurs`
--
ALTER TABLE `secteurs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `techniciens`
--
ALTER TABLE `techniciens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `entreprises`
--
ALTER TABLE `entreprises`
  ADD CONSTRAINT `entreprises_id_secteur_foreign` FOREIGN KEY (`id_secteur`) REFERENCES `secteurs` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
