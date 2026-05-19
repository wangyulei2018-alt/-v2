const fs = require('fs');

let content = fs.readFileSync('src/components/MetricCard.tsx', 'utf8');

// 1. Add departmentPath to EmployeeInfo and ReviewerInfo
content = content.replace(/export interface EmployeeInfo \{[\s\S]*?\}/, `export interface EmployeeInfo {
  id: string;
  name: string;
  title?: string;
  empId?: string;
  avatar?: string;
  departmentPath?: string;
}`);

content = content.replace(/export interface ReviewerInfo \{[\s\S]*?\}/, `export interface ReviewerInfo {
  id: string;
  name: string;
  weight: number;
  isManager?: boolean;
  avatar?: string;
  title?: string;
  empId?: string;
  departmentPath?: string;
}`);

// 2. Define isFieldReadOnly
content = content.replace(/const isMidTerm = activeStep === 1;/, `const isMidTerm = activeStep === 1;\n  const isFieldReadOnly = readOnly || isAssessment || (isMidTerm && viewMode === 'department');`);

// 3. Update checkboxes in thead and tbody
content = content.replace(/\{!readOnly && !isAssessment && viewMode !== 'stakeholder' && <input type="checkbox"/g, `{!readOnly && !isAssessment && viewMode !== 'stakeholder' && !isMidTerm && <input type="checkbox"`);

// 4. Update thead columns
content = content.replace(/<th className="px-1 py-3 font-medium w-\[6%\]">指标类型<\/th>/, `{!isMidTerm && <th className="px-1 py-3 font-medium w-[6%]">指标类型</th>}`);
content = content.replace(/<th className="px-1 py-3 font-medium w-\[6%\]">计算公式<\/th>/, `{!isMidTerm && <th className="px-1 py-3 font-medium w-[6%]">计算公式</th>}`);
content = content.replace(/\{!readOnly && !isAssessment && <th className="px-1 py-3 font-medium w-12 text-center">操作<\/th>\}/, `{!readOnly && !isAssessment && !isMidTerm && <th className="px-1 py-3 font-medium w-12 text-center">操作</th>}`);

// 5. Update tbody fields readOnly
content = content.replace(/readOnly=\{readOnly \|\| isAssessment\}(\s*onChange=\{\(e\) => \{\s*if \(readOnly \|\| isAssessment\))/g, `readOnly={isFieldReadOnly}$1`);
content = content.replace(/if \(readOnly \|\| isAssessment\) return;/g, `if (isFieldReadOnly) return;`);
content = content.replace(/disabled=\{readOnly \|\| isAssessment\}/g, `disabled={isFieldReadOnly}`);
content = content.replace(/className=\{\`w-full h-full border border-slate-200 rounded p-1.5 \$\{fontSize\} focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none \$\{readOnly \|\| isAssessment \? 'bg-slate-50 text-slate-500 cursor-default' : ''\}\`\}/g, `className={\`w-full h-full border border-slate-200 rounded p-1.5 \${fontSize} focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none \${isFieldReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : ''}\`}`);
content = content.replace(/className=\{\`w-10 p-1 text-center border border-slate-200 rounded outline-none focus:border-blue-500 \$\{fontSize\} \$\{readOnly \|\| isAssessment \? 'bg-slate-50 text-slate-500 cursor-default' : ''\}\`\}/g, `className={\`w-10 p-1 text-center border border-slate-200 rounded outline-none focus:border-blue-500 \${fontSize} \${isFieldReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : ''}\`}`);
content = content.replace(/className=\{\`w-full border border-slate-200 rounded p-1.5 \$\{fontSize\} h-\[80px\] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white \$\{readOnly \|\| isAssessment \? 'bg-slate-50 text-slate-500 cursor-default appearance-none' : ''\}\`\}/g, `className={\`w-full border border-slate-200 rounded p-1.5 \${fontSize} h-[80px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white \${isFieldReadOnly ? 'bg-slate-50 text-slate-500 cursor-default appearance-none' : ''}\`}`);

// For lastYear and yoyGrowth:
content = content.replace(/className=\{\`w-full h-full border border-slate-200 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none \$\{readOnly \? 'bg-slate-50 text-slate-500 cursor-default' : ''\}\`\}/g, `className={\`w-full h-full border border-slate-200 rounded p-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none \${isFieldReadOnly ? 'bg-slate-50 text-slate-500 cursor-default' : ''}\`}`);
content = content.replace(/readOnly=\{readOnly\}(\s*onChange=\{\(e\) => \{\s*if \(readOnly\))/g, `readOnly={isFieldReadOnly}$1`);
content = content.replace(/if \(readOnly\) return;/g, `if (isFieldReadOnly) return;`);

// 6. Wrap type and formula in {!isMidTerm && ...}
const tdTypeRegex = /<td className="px-1 py-3 align-middle">\s*<select[^>]*value=\{metric\.type\}[\s\S]*?<\/td>/;
content = content.replace(tdTypeRegex, match => `{!isMidTerm && (\n              ${match}\n            )}`);

const tdFormulaRegex = /<td className="px-1 py-3 align-middle">\s*<div className="relative group h-\[80px\]">\s*<textarea[^>]*value=\{metric\.formula\}[\s\S]*?<\/td>/;
content = content.replace(tdFormulaRegex, match => `{!isMidTerm && (\n              ${match}\n            )}`);

// 7. Update Reviewer and Provider buttons and X icons
content = content.replace(/\{!readOnly && !isAssessment && \(\s*<button \n\s*onClick=\{\(\) => \{\s*const newMetrics = \[\.\.\.metrics\];\s*newMetrics\[index\]\.providers = /g, `{!isFieldReadOnly && (\n                        <button \n                          onClick={() => {\n                            const newMetrics = [...metrics];\n                            newMetrics[index].providers = `);

content = content.replace(/\{!readOnly && !isAssessment && \(\s*<button \n\s*onClick=\{\(\) => \{\s*setEditingMetricId\(metric\.id\);\s*setIsProviderModalOpen\(true\);\s*\}\}\s*className="text-blue-600/g, `{!isFieldReadOnly && (\n                  <button \n                    onClick={() => {\n                      setEditingMetricId(metric.id);\n                      setIsProviderModalOpen(true);\n                    }}\n                    className="text-blue-600`);

// For reviewers:
content = content.replace(/\{!readOnly && \(\s*<button \n\s*onClick=\{\(\) => \{\s*const newMetrics = \[\.\.\.metrics\];\s*newMetrics\[index\]\.reviewers = /g, `{!isFieldReadOnly && (\n                                <button \n                                  onClick={() => {\n                                    const newMetrics = [...metrics];\n                                    newMetrics[index].reviewers = `);

content = content.replace(/\{!readOnly && \(\s*<button \n\s*onClick=\{\(\) => \{\s*setEditingMetricId\(metric\.id\);\s*setIsReviewerModalOpen\(true\);\s*\}\}\s*className="text-blue-600/g, `{!isFieldReadOnly && (\n                          <button \n                            onClick={() => {\n                              setEditingMetricId(metric.id);\n                              setIsReviewerModalOpen(true);\n                            }}\n                            className="text-blue-600`);

// 8. Remove Action column td if isMidTerm
const actionTdRegex = /\{!readOnly && !isAssessment && \(\s*<td className="px-1 py-3 text-center align-middle">[\s\S]*?<\/td>\s*\)\}/;
content = content.replace(actionTdRegex, match => match.replace(`{!readOnly && !isAssessment && (`, `{!readOnly && !isAssessment && !isMidTerm && (`));

// 9. Add New Metric button
const addNewMetricRegex = /\{!readOnly && !isAssessment && \(\s*<button \n\s*onClick=\{handleAddMetric\}/;
content = content.replace(addNewMetricRegex, `{!readOnly && !isAssessment && !isMidTerm && (\n        <button \n          onClick={handleAddMetric}`);

// 10. Add title attribute to provider and reviewer spans
content = content.replace(/<span key=\{p\.id\} className="bg-blue-50 text-blue-600 px-1\.5 py-0\.5 rounded text-\[10px\] flex items-center gap-1 border border-blue-100">/g, `<span key={p.id} title={p.departmentPath || p.title} className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 border border-blue-100 cursor-help">`);

content = content.replace(/<span className="text-\[11px\] font-bold text-slate-700 truncate">\{r\.name\}<\/span>/g, `<span className="text-[11px] font-bold text-slate-700 truncate cursor-help" title={r.departmentPath || r.title}>{r.name}</span>`);

fs.writeFileSync('src/components/MetricCard.tsx', content);
console.log('MetricCard.tsx updated successfully');
