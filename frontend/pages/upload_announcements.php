<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action="actions/upload_announcement.php" method="POST" enctype="multipart/form-data">
    <label>Title: <input type="text" name="title" required></label><br>
    <label>Description:<br><textarea name="description" rows="4" required></textarea></label><br>
    <label>Attach Document (PDF, DOCX, XLSX, PPTX): <input type="file" name="document"></label><br>
    <button type="submit">Post Announcement</button>
</form>

</body>
</html>