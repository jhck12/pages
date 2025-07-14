<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Page Admin</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
        textarea { height: 300px; font-family: monospace; }
        button { background: #4CAF50; color: white; border: none; padding: 10px 15px; cursor: pointer; }
        button:hover { background: #45a049; }
        #status { margin-top: 15px; padding: 10px; border-radius: 4px; }
        .success { background: #dff0d8; color: #3c763d; }
        .error { background: #f2dede; color: #a94442; }
    </style>
</head>
<body>
    <h1>Simple Page Admin</h1>
    
    <div class="form-group">
        <label for="pageName">Filename (e.g., my-page.html):</label>
        <input type="text" id="pageName" placeholder="my-page.html" required>
        <small>Will be saved to: <code>pages/blogs/YOUR-FILE.html</code></small>
    </div>
    
    <div class="form-group">
        <label for="pageContent">HTML Content:</label>
        <textarea id="pageContent" required>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Page</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #4CAF50; }
    </style>
</head>
<body>
    <h1>Welcome to my new page!</h1>
    <p>Your content goes here</p>
</body>
</html>
        </textarea>
    </div>
    
    <div class="form-group">
        <label for="commitMessage">Commit Message:</label>
        <input type="text" id="commitMessage" value="Added new blog page" required>
    </div>
    
    <button id="saveButton">Save to GitHub & Deploy</button>
    
    <div id="status"></div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('saveButton').addEventListener('click', async function() {
                const filename = document.getElementById('pageName').value;
                const pageContent = document.getElementById('pageContent').value;
                const commitMessage = document.getElementById('commitMessage').value;
                
                // Auto-fix filename if needed
                let finalFilename = filename;
                if (!finalFilename.endsWith('.html')) {
                    finalFilename += '.html';
                }
                const fullPath = `pages/blogs/${finalFilename}`;
                
                const statusEl = document.getElementById('status');
                statusEl.textContent = `Saving ${fullPath}...`;
                statusEl.className = '';
                
                try {
                    // First get the GitHub token from Netlify Function
                    const tokenResponse = await fetch('/.netlify/functions/get-token');
                    const { token } = await tokenResponse.json();
                    
                    if (!token) {
                        throw new Error('Failed to get GitHub token');
                    }

                    // Now commit to GitHub using the token from environment variables
                    const githubResponse = await fetch(`https://api.github.com/repos/jhck12/pages/contents/${fullPath}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `token ${token}`,
                            'Accept': 'application/vnd.github.v3+json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            message: commitMessage,
                            content: btoa(unescape(encodeURIComponent(pageContent))),
                            branch: 'blogs'
                        })
                    });

                    if (!githubResponse.ok) {
                        throw new Error(`GitHub API error: ${await githubResponse.text()}`);
                    }

                    // Trigger Netlify build (using hardcoded values as per your request)
                    const netlifyResponse = await fetch('https://api.netlify.com/api/v1/sites/dadc669a-98ef-4631-9b37-ec6bafa5fd56/builds', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer nfp_WMtGCmpoNa5cQUi37dirinGS3jXu98gM7cc2'
                        }
                    });

                    if (!netlifyResponse.ok) {
                        throw new Error(`Netlify API error: ${await netlifyResponse.text()}`);
                    }

                    statusEl.textContent = 'Success! Page updated and deployment triggered.';
                    statusEl.className = 'success';
                } catch (error) {
                    statusEl.textContent = 'Error: ' + error.message;
                    statusEl.className = 'error';
                    console.error('Error:', error);
                }
            });
        });
    </script>
</body>
</html>
