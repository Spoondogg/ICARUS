/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000) [id]
      ,[subsections]
      ,[element]
      ,[label]
      ,[Discriminator]
      ,[authorId]
      ,[status]
      ,[shared]
      ,[dateCreated]
      ,[dateLastModified]
      ,[attributesId]
      ,[dataId]
      ,[descriptionId]
      ,[showHeader]
      ,[collapsed]
      ,[hasTab]
      ,[hasSidebar]
  FROM [JAC].[ICARUS].[Containers]
  WHERE [id] = 2945

  /****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000) [id]
      ,[formId]
      ,[version]
      ,[authorId]
      ,[xmlResults]
      ,[jsonResults]
      ,[shared]
      ,[status]
      ,[dateCreated]
  FROM [JAC].[ICARUS].[FormPosts]
  WHERE [id] = 99

  UPDATE [ICARUS].[FormPosts]
  SET [xmlResults].modify('replace value of (/root/header/text())[1] with (".")')
  WHERE [id] = 99