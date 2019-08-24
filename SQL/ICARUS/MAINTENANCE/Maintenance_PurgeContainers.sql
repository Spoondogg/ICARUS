/**	Remove Containers marked for deletion after 5 days
	that belong to this user
	EXEC [ICARUS].[PurgeContainers] 'ryan@spoonmedia.ca', 0 -- Delete ALL immediately
*/
ALTER PROCEDURE [ICARUS].[PurgeContainers] 
	@authorId NVARCHAR(128),
	@daysOld INT = 5
AS BEGIN

	DECLARE @result INT = 0;

	SET @result = (
		SELECT COUNT(*) FROM [ICARUS].[Containers]
		WHERE [status] = -1 AND DATEDIFF(DD,[dateLastModified],GETDATE()) >= 0
		AND [authorId] = @authorId
	);

	DELETE FROM [ICARUS].[Containers]
	WHERE [status] = -1 AND DATEDIFF(DD,[dateLastModified],GETDATE()) >= @daysOld
	AND [authorId] = @authorId

	SELECT @result AS [result]

END 
GO