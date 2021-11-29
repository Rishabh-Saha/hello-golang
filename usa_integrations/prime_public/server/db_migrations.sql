CREATE TABLE IF NOT EXISTS `brand_mapping` (
  `BrandMappingID` bigint(19) NOT NULL,
  `BrandID` bigint(19) NOT NULL COMMENT 'ServifyBrandID',
  `ClientID` bigint(19) NOT NULL,
  `BrandReferenceID` varchar(30) COLLATE utf8_bin NOT NULL,
  `CreatedDate` datetime NOT NULL,
  `UpdatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
CREATE TABLE IF NOT EXISTS `status_mapping` (
  `StatusMappingID` bigint(20) NOT NULL,
  `ClientID` bigint(20) NOT NULL,
  `StatusCode` varchar(255) COLLATE utf8_bin NOT NULL,
  `ExternalStatus` varchar(255) COLLATE utf8_bin NOT NULL,
  `Status` varchar(255) COLLATE utf8_bin NOT NULL,
  `StatusID` bigint(20) NOT NULL,
  `Active` tinyint(1) NOT NULL,
  `UpdatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


--- 25th November 2019 
--- for oneplus benefits

CREATE TABLE IF NOT EXISTS `client_whitelisted_apis` (
  `ClientWhitelistedApiID` tinyint(4) NOT NULL AUTO_INCREMENT,
  `ExternalClientID` tinyint(2) NOT NULL DEFAULT '0',
  `ApiId` mediumint(4) NOT NULL DEFAULT '0',
  `RestAction` varchar(150) NOT NULL DEFAULT 'ALL',
  `Active` tinyint(1) NOT NULL DEFAULT '1',
  `Archived` tinyint(1) NOT NULL DEFAULT '0',
  `CreatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ClientWhitelistedApiID`),
  UNIQUE KEY `whitelisted_api` (`ExternalClientID`,`ApiId`,`RestAction`,`Active`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_bin;



ALTER TABLE external_clients 
ADD `ApiWhitelisting` tinyint(1) NOT NULL,
ADD `PartnerID` tinyint(4) NOT NULL;



CREATE TABLE IF NOT EXISTS `api_list` (
  `ApiId` mediumint(4) NOT NULL AUTO_INCREMENT,
  `ApiName` varchar(255) NOT NULL DEFAULT '' COMMENT 'Api Name',
  `Active` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1- Active , 0- InActive',
  `Archived` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`ApiId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8_bin;

--- 27th November 2019
--- for ip and domain whitelisting feature

ALTER TABLE `external_clients` 
ADD `SourceWhitelisting` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'IP and domain whitelisting' AFTER `ApiWhitelisting` ;