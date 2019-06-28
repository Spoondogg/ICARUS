USE [ICARUS];
SELECT TOP 3 * FROM [ICARUS].[Containers] 
WHERE [element] = 'ARTICLE' AND [id] = 3111
ORDER BY [id] DESC;

SELECT TOP 5 * FROM [ICARUS].[FormPosts] ORDER BY [id] DESC;

SELECT * FROM [ICARUS].[FormPosts]
WHERE [id] = 62

/*
UPDATE [ICARUS].[Containers]
SET [Discriminator] = 'ARTICLE'
WHERE [id] = 3109
*/