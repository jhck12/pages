 // Critical CSS loader - put this in <head>
  (function() {
    // 1. Try localStorage cache first
    const cachedCss = localStorage.getItem('cached_global_css');
    if (cachedCss) {
      const style = document.createElement('style');
      style.id = 'temp-css';
      style.textContent = cachedCss;
      document.head.appendChild(style);
    }

    // 2. Initialize Firebase and listen for updates
    const firebaseConfig = {
      apiKey: "AIzaSyAR2sGQx5Mxz_TZRfRyecWva346jBYel-8",
      authDomain: "chatapp-fa81d.firebaseapp.com",
      databaseURL: "https://chatapp-fa81d-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "chatapp-fa81d",
      storageBucket: "chatapp-fa81d.firebasestorage.app",
      messagingSenderId: "308333202130",
      appId: "1:308333202130:web:b9c4fc84eff5bb065f3b0b"
    };

    // Load Firebase async
    Promise.all([
      loadScript('https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js'),
      loadScript('https://www.gstatic.com/firebasejs/10.4.0/firebase-database-compat.js')
    ]).then(() => {
      firebase.initializeApp(firebaseConfig);
      
      // Real-time listener for CSS updates
      firebase.database().ref('global_css').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data?.css) {
          updateCss(data.css);
        }
      });
    });

    function updateCss(css) {
      // Remove temporary CSS if exists
      document.getElementById('temp-css')?.remove();
      
      // Apply new CSS
      let style = document.getElementById('global-css');
      if (!style) {
        style = document.createElement('style');
        style.id = 'global-css';
        document.head.appendChild(style);
      }
      style.textContent = css;
      
      // Cache locally
      localStorage.setItem('cached_global_css', css);
      
      // Hide loader
      document.getElementById('css-loader').style.display = 'none';
    }

    function loadScript(url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    // Timeout fallback (hide loader after 3s max)
    setTimeout(() => {
      document.getElementById('css-loader').style.display = 'none';
    }, 3000);
  })();


// Load global CSS from Firebase
  firebase.database().ref('global_css/css').once('value').then(snapshot => {
    const globalCss = snapshot.val();
    if (globalCss) {
      const styleTag = document.createElement('style');
      styleTag.id = 'global-css-styles';
      styleTag.textContent = globalCss;
      document.head.appendChild(styleTag);
    }
  }).catch(error => {
    console.log("Error loading global CSS:", error);
  });
