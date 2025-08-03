import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function ProgressBar({ currentStep, formSections, setCurrentStep }) {
    return (
        <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border-b border-slate-200/50 shadow-sm backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                <div className="relative">
                    <div className="relative w-full h-3 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out rounded-full"
                            style={{ width: `${((currentStep + 1) / formSections.length) * 100}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between items-start mt-6 sm:mt-8 gap-1 sm:gap-2">
                        {formSections.map((section, index) => {
                            const isActive = index === currentStep;
                            const isCompleted = index < currentStep;
                            const IconComponent = section.icon;
                            
                            return (
                                <div 
                                    key={index} 
                                    className="flex flex-col items-center group cursor-pointer transition-all duration-300 hover:scale-105 flex-1 min-w-0"
                                    onClick={() => isCompleted && setCurrentStep(index)}
                                >
                                    <div
                                        className={`relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                                            isCompleted
                                                ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white'
                                                : isActive
                                                ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white'
                                                : 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-500 group-hover:from-slate-300 group-hover:to-slate-400'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 drop-shadow-sm" />
                                        ) : (
                                            <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 drop-shadow-sm" />
                                        )}
                                    </div>

                                    <span
                                        className={`mt-2 sm:mt-3 md:mt-4 text-[10px] xs:text-xs sm:text-sm lg:text-base font-semibold text-center transition-all duration-300 leading-tight px-1 ${
                                            isActive 
                                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600' 
                                                : isCompleted 
                                                ? 'text-emerald-600' 
                                                : 'text-slate-500 group-hover:text-slate-700'
                                        }`}
                                    >
                                        <span className="block sm:hidden">
                                            {section.title.length > 8 ? section.title.substring(0, 6) + '...' : section.title}
                                        </span>
                                        <span className="hidden sm:block">
                                            {section.title}
                                        </span>
                                    </span>
                                    
                                    {isActive && (
                                        <div className="mt-1 w-1 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="hidden md:block absolute top-[44px] sm:top-[52px] md:top-[60px] lg:top-[68px] left-0 right-0 px-4 sm:px-6 md:px-8 lg:px-12">
                        <div className="flex justify-between items-center">
                            {formSections.slice(0, -1).map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-0.5 flex-1 mx-1 sm:mx-2 lg:mx-4 transition-all duration-500 ${
                                        index < currentStep
                                            ? 'bg-gradient-to-r from-emerald-300 to-green-400'
                                            : 'bg-slate-200'
                                    }`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 sm:mt-6 md:mt-8 gap-3 sm:gap-0">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-xs sm:text-sm md:text-base font-medium text-slate-600">
                            Current: <span className="font-semibold text-slate-800">{formSections[currentStep]?.title}</span>
                        </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100/80 backdrop-blur-sm rounded-full border border-slate-200/50">
                        <span className="text-xs sm:text-sm font-medium text-slate-600">
                            {currentStep + 1} of {formSections.length}
                        </span>
                        <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                        <span className="text-xs sm:text-sm font-medium text-slate-500">
                            {Math.round(((currentStep + 1) / formSections.length) * 100)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}