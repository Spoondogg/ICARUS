/**	Remove FormPosts marked for deletion after 5 days
	that belong to this user
	EXEC [ICARUS].[PurgeFormPosts] 'ryan@spoonmedia.ca'
*/
ALTER PROCEDURE [ICARUS].[PurgeFormPosts] 
	@authorId NVARCHAR(128),
	@daysOld INT = 5
AS BEGIN

	DECLARE @result INT = 0;

	SET @result = (
		SELECT COUNT(*) FROM [ICARUS].[FormPosts]
		WHERE [status] = -1
		AND [authorId] = @authorId
	);

	DELETE FROM [ICARUS].[FormPosts]
	WHERE [status] = -1
	AND [authorId] = @authorId

	SELECT @result AS [result]

END 
GO