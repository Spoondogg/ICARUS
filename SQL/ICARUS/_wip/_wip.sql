USE [ICARUS];
WITH [CONTAINERS] AS (
	SELECT [Discriminator], COUNT(*) AS [Count], 
	MIN([id]) AS [oldestId], MAX([id]) AS [newestId]
	FROM [ICARUS].[Containers] GROUP BY [Discriminator]
)
SELECT * FROM [CONTAINERS] AS [I]
LEFT JOIN [ICARUS].[Containers] AS [C] ON (
	[I].[newestId] = [C].[id]
)
ORDER BY [I].[Discriminator]


SELECT * FROM [ICARUS].[Containers] WHERE [id] IN (2834,3150)

SELECT TOP 10 * FROM [ICARUS].[Containers] WHERE [attributesId] > 0

--UPDATE [ICARUS].[Containers] SET [Discriminator] = 'TEXTBLOCK' WHERE [id] = 2834
--SET [attributesId] = 0 WHERE [id] = 2820


SELECT * FROM [ICARUS].[FormPosts] 
WHERE [id] = 2834