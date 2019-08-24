USE [ICARUS];
--SELECT TOP 100 * FROM [ICARUS].[FormPosts] ORDER BY [id] DESC
-- 1)
SELECT * FROM [ICARUS].[Containers] AS [C] 
LEFT JOIN [ICARUS].[FormPosts] AS [ATTR] ON (
	[C].[attributesId] = [ATTR].[id]
)
LEFT JOIN [ICARUS].[FormPosts] AS [DATA] ON (
	[C].[dataId] = [DATA].[id]
)
WHERE [C].[id] IN (1, 1930, 2819, 2820, 2834, 2837, 2850, 2941, 2991) --, 1352, 1957)
-- 2)
SELECT TOP 15 * FROM [ICARUS].[ICARUS].[FormPosts] ORDER BY [id] DESC
-- 3)
SELECT * FROM [ICARUS].[Containers] WHERE [id] = 1
UNION 
SELECT * FROM [ICARUS].[Containers] WHERE [id] = (SELECT MAX([id]) FROM [ICARUS].[Containers])
--UPDATE [ICARUS].[Containers] SET [attributesId] = 33 WHERE [id] = 1

/*
SET IDENTITY_INSERT [ICARUS].[Containers] ON
GO
USE [ICARUS];
INSERT INTO [ICARUS].[Containers] (
	[id], [subsections], [element], 
	[Discriminator], [authorId], [status], 
	[expand], [showHeader]
) VALUES (
	1, '0', 'MAIN', 'Main', 'ryan@spoonmedia.ca', 
	1, NULL, NULL
)
*/