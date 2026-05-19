const fs = require('fs');

let content = fs.readFileSync('src/components/MetricCard.tsx', 'utf8');

// Replace isFieldReadOnly with (readOnly || isAssessment) for midTerm fields
content = content.replace(/readOnly=\{isFieldReadOnly\}(\s*onChange=\{\(e\) => \{\s*if \(isFieldReadOnly\) return;\s*const newMetrics = \[\.\.\.metrics\];\s*newMetrics\[index\]\.midTermResult = e\.target\.value;)/, 'readOnly={readOnly || isAssessment}$1'.replace('if (isFieldReadOnly)', 'if (readOnly || isAssessment)'));

content = content.replace(/readOnly=\{isFieldReadOnly\}(\s*onChange=\{\(e\) => \{\s*if \(isFieldReadOnly\) return;\s*const newMetrics = \[\.\.\.metrics\];\s*newMetrics\[index\]\.midTermProgress = e\.target\.value;)/, 'readOnly={readOnly || isAssessment}$1'.replace('if (isFieldReadOnly)', 'if (readOnly || isAssessment)'));

content = content.replace(/onChange=\{\(e\) => \{\s*if \(isFieldReadOnly\) return;\s*const newMetrics = \[\.\.\.metrics\];\s*newMetrics\[index\]\.midTermStatus = e\.target\.value as any;/, 'onChange={(e) => {\\n                          if (readOnly || isAssessment) return;\\n                          const newMetrics = [...metrics];\\n                          newMetrics[index].midTermStatus = e.target.value as any;');

content = content.replace(/readOnly=\{isFieldReadOnly\}(\s*onChange=\{\(e\) => \{\s*if \(isFieldReadOnly\) return;\s*const newMetrics = \[\.\.\.metrics\];\s*newMetrics\[index\]\.midTermReason = e\.target\.value;)/, 'readOnly={readOnly || isAssessment}$1'.replace('if (isFieldReadOnly)', 'if (readOnly || isAssessment)'));

fs.writeFileSync('src/components/MetricCard.tsx', content);
console.log('Fixed midTerm readOnly logic');
