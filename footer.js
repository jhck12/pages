// footer.js - Dynamic Footer Component
document.addEventListener('DOMContentLoaded', function() {
  // Create footer element
  const footer = document.createElement('footer');
  
  // Style the footer
  footer.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background-color: #000000;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-family: Arial, sans-serif;
    z-index: 1000;
  `;
  
  // Add content
  footer.innerHTML = 'Built via Vibecoding';
  
  // Add to page
  document.body.appendChild(footer);
  
  // Adjust body padding to prevent content overlap
  document.body.style.paddingBottom = '20px';
});