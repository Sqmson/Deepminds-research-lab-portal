<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Upload Article</title>
</head>
<body>
    <h1>Upload Article</h1>
    <form action="index.php?page=upload_article" method="post" enctype="multipart/form-data">
        <label>Title: <input type="text" name="title" required></label><br>
        <label>Excerpt: <input type="text" name="excerpt"></label><br>
        <label>Author: <input type="text" name="author"></label><br>
        <label>Category: <input type="text" name="category"></label><br>
        <label>Tags (comma separated): <input type="text" name="tags"></label><br>
        <label>Image: <input type="file" name="image" accept="image/*"></label><br>
        <label>Content:<br><textarea name="content" rows="10" cols="60" required></textarea></label><br>
        <button type="submit">Upload</button>
    </form>
</body>
</html>
