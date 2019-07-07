/**	Get MAIN Containers without any children that are beyond
	the minimum age (10 days) and sets their status for deletion
	@returns A list of Containers without any children
	EXEC [ICARUS].[PurgeEmptyMains] -1
*/
ALTER PROCEDURE [ICARUS].[PurgeEmptyMains] 
	@minAge INT = 10 -- days old
AS BEGIN
	UPDATE [ICARUS].[Containers]
	SET [status] = -1
	WHERE DATEDIFF("D", [dateLastModified], GETDATE()) > @minAge
	AND [Discriminator] = 'Main'
	AND [subsections] = '0'
END
GO