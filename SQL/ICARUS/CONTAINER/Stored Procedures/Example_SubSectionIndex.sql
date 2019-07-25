/** Examples on how to work with the ContainerSubSectionIndex View */

-- Get number of children by Container
SELECT [id], COUNT([childId]) AS [childCount]
FROM [CONTAINER].[SubSectionIndex]
GROUP BY [id]
HAVING COUNT([childId]) > 5
ORDER BY COUNT([childId]) DESC

-- Get Container use count
SELECT [childId] AS [id], COUNT([id]) AS [useCount]
FROM [CONTAINER].[SubSectionIndex]
GROUP BY [childId]
HAVING COUNT([id]) > 1
ORDER BY [useCount] DESC