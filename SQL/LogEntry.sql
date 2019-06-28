ALTER PROCEDURE [dbo].[LogEntry]
	@process NVARCHAR(256),
	@step NVARCHAR(256),
	@comment NVARCHAR(256) AS
	
	INSERT INTO [dbo].[LOG] (
		[timestamp],
		[process],
		[step],
		[comment]
	) VALUES (
		GETDATE(),
		@process,
		@step,
		@comment
	)
	



