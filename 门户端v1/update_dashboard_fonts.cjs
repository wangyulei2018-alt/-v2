const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/DepartmentDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/text-\[13px\]/g, 'text-[12px]');
content = content.replace(/text-\[12px\]/g, 'text-[11px]');

fs.writeFileSync(filePath, content);
console.log('Done');
