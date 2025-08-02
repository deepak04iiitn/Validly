import { formatDistanceToNow } from 'date-fns';

const JobCard = ({ job, onApply, onViewDetails }) => {
  const {
    _id,
    title,
    company,
    location,
    salary,
    jobType,
    experience,
    skills,
    createdAt,
    applicants,
    applyLink
  } = job;

  const formatSalary = (salaryRange) => {
    if (!salaryRange?.min && !salaryRange?.max) return 'Salary not disclosed';
    if (salaryRange.min && salaryRange.max) {
      return `₹${(salaryRange.min / 1000).toFixed(0)}K - ₹${(salaryRange.max / 1000).toFixed(0)}K`;
    }
    if (salaryRange.min) return `₹${(salaryRange.min / 1000).toFixed(0)}K+`;
    if (salaryRange.max) return `Up to ₹${(salaryRange.max / 1000).toFixed(0)}K`;
  };

  const formatExperience = (expRange) => {
    if (!expRange?.min && !expRange?.max) return 'Any experience';
    if (expRange.min && expRange.max) {
      return `${expRange.min}-${expRange.max} years`;
    }
    if (expRange.min) return `${expRange.min}+ years`;
    if (expRange.max) return `Up to ${expRange.max} years`;
  };

  const getJobTypeConfig = (type) => {
    const configs = {
      'full-time': { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: '💼' },
      'part-time': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '⏰' },
      'contract': { bg: 'bg-purple-100', text: 'text-purple-800', icon: '📝' },
      'internship': { bg: 'bg-orange-100', text: 'text-orange-800', icon: '🎓' }
    };
    return configs[type] || configs['full-time'];
  };

  const typeConfig = getJobTypeConfig(jobType);
  const isNew = new Date() - new Date(createdAt) < 24 * 60 * 60 * 1000; // Less than 24 hours

  return (
    <div className="group relative">
      {/* Card Background with Gradient Border Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
      
      <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 md:p-8 hover:shadow-2xl transition-all duration-500 hover:bg-white">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors duration-300">
                  {title}
                </h3>
                <div className="flex items-center space-x-3">
                  <p className="text-lg font-semibold text-gray-700">{company}</p>
                  {isNew && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full animate-pulse">
                      ✨ NEW
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Job Type Badge */}
          <div className="flex items-center space-x-3 mt-2 md:mt-0">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${typeConfig.bg} ${typeConfig.text} shadow-lg`}>
              <span className="mr-2">{typeConfig.icon}</span>
              {jobType.charAt(0).toUpperCase() + jobType.slice(1).replace('-', ' ')}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Location</p>
              <p className="font-semibold text-gray-900">{location}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Experience</p>
              <p className="font-semibold text-gray-900">{formatExperience(experience)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-yellow-50 rounded-xl">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Salary Range</p>
              <p className="font-semibold text-gray-900">{formatSalary(salary)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Applicants</p>
              <p className="font-semibold text-gray-900">{applicants?.length || 0} applied</p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {skills?.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h4 className="font-semibold text-gray-900">Required Skills</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-medium rounded-xl border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-300"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 5 && (
                <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm font-medium rounded-xl border border-gray-300">
                  +{skills.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4 md:mb-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Posted {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => onViewDetails(_id)}
              className="cursor-pointer inline-flex items-center px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </button>
            
            <button
              onClick={() => window.open(applyLink, '_blank')}
              className="cursor-pointer inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
