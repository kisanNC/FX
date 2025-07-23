<!DOCTYPE html>
<html>

<head>
    <title>Upload Image Test</title>
</head>

<body>
    <h1>Upload Image to Album Image ID </h1>

    <form action="{{ url('/api/albums/images/1') }}" method="post" enctype="multipart/form-data">
        @csrf
        @method('PUT')

        <input type="file" name="image" required />
        <button type="submit">Upload</button>
    </form>
</body>

</html>