import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FormNavigation({ currentStep, formSections, isStepValid, nextStep, prevStep, handleSubmit, loading }) {
    return (
        <div className="bg-gray-50 px-8 sm:px-12 py-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
                <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        currentStep === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                >
                    Previous
                </button>

                {currentStep === formSections.length - 1 ? (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 flex items-center gap-2 ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5'
                        }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                Submit Application
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid()}
                        className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 flex items-center gap-2 ${
                            isStepValid()
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                        Next Step
                        <ArrowRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}