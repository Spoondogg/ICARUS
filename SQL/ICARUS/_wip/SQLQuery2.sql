USE [ICARUS];
SELECT COUNT(*) AS [s], [element]
FROM [ICARUS].[Containers]
GROUP BY [element]

SELECT * FROM [ICARUS].[Containers]
WHERE [element] = 'JUMBOTRON'