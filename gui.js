// Simple GUI script for testing Tampermonkey loader
console.log("GUI script loaded from GitHub!");

// Tạo GUI giống phong cách Roblox
const robloxGui = document.createElement('div');
robloxGui.style.position = 'fixed';
robloxGui.style.bottom = '20px';
robloxGui.style.left = '20px';
robloxGui.style.width = '200px';
robloxGui.style.backgroundColor = '#1e1e1e';
robloxGui.style.color = '#ffffff';
robloxGui.style.padding = '10px';
robloxGui.style.zIndex = '10000';
robloxGui.style.border = '2px solid #00bfff';
robloxGui.style.borderRadius = '8px';
robloxGui.style.boxShadow = '0 0 10px rgba(0, 191, 255, 0.5)';

// Tiêu đề
const title = document.createElement('h3');
title.textContent = 'Roblox-Style GUI';
title.style.textAlign = 'center';
title.style.color = '#00bfff';
title.style.marginBottom = '10px';
robloxGui.appendChild(title);

// Nút test
const testBtn = document.createElement('button');
testBtn.textContent = 'Click Me!';
testBtn.style.width = '100%';
testBtn.style.padding = '8px';
testBtn.style.backgroundColor = '#32cd32';
testBtn.style.color = '#fff';
testBtn.style.border = 'none';
testBtn.style.cursor = 'pointer';
testBtn.style.borderRadius = '4px';
testBtn.onclick = function() {
    alert('Button clicked! Script from GitHub is working.');
};
robloxGui.appendChild(testBtn);

// Thêm GUI vào trang
document.body.appendChild(robloxGui);
alert('Roblox-style GUI loaded from GitHub!');
