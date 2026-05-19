/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ProcessStageBarProps {
  steps: string[];
  activeStep: number;
  setActiveStep: (step: number) => void;
  viewMode?: 'department' | 'executive' | 'stakeholder';
}

export const ProcessStageBar: React.FC<ProcessStageBarProps> = ({
  steps,
  activeStep,
  setActiveStep,
  viewMode = 'department'
}) => {
  const isExecutive = viewMode === 'executive';

  return (
    <div className="h-12 bg-white border-b border-slate-200 flex items-center px-6 flex-shrink-0 z-10 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto w-full flex items-center justify-center h-full">
        <div className="flex items-center bg-slate-50/80 p-1 rounded-xl border border-slate-100 shadow-inner">
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <div 
                className={`flex items-center gap-2.5 px-4 py-1.5 rounded-lg cursor-pointer transition-all ${
                  i === activeStep 
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-100' 
                    : i < activeStep 
                      ? 'text-blue-500 hover:text-blue-600' 
                      : 'text-slate-400 hover:text-slate-600'
                }`}
                onClick={() => setActiveStep(i)}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  i === activeStep 
                    ? 'bg-blue-600 text-white' 
                    : i < activeStep 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-slate-200 text-slate-500'
                }`}>
                  {i + 1}
                </div>
                <span className="text-[12px] font-bold whitespace-nowrap tracking-wide">{step}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-10 h-px bg-slate-200/60 mx-1"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
