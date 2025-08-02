import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow, format } from 'date-fns';
import { Hourglass } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const user = useSelector(state => state.user.currentUser);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/backend/jobs/${id}`);
        const data = await response.json();
        if (data.success) {
          setJob(data.job);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError(err.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // Handle job application
  const handleApply = async () => {
    if (!user) {
      toast.error('Please login to apply for jobs');
      return;
    }

    setApplying(true);
    try {
      const response = await fetch(`/backend/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          resume: 'https://example.com/resume.pdf',
          coverLetter: 'I am interested in this position...'
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Application submitted successfully!');
        setJob(prev => ({
          ...prev,
          applicants: [...(prev.applicants || []), { userId: user._id, appliedAt: new Date() }]
        }));
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('Error applying for job:', err);
      toast.error(err.message || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

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

  // Format job description with proper HTML rendering
  const formatDescription = (description) => {
    if (!description) return '';
    
    // Convert line breaks to <br> tags
    let formatted = description.replace(/\n/g, '<br>');
    
    // Convert bullet points (-, *, •) to HTML lists
    formatted = formatted.replace(/^[\s]*[-\*•]\s*(.+)$/gm, '<li>$1</li>');
    
    // Wrap consecutive list items in <ul> tags
    formatted = formatted.replace(/(<li>.*<\/li>)/gs, '<ul class="formatted-list">$1</ul>');
    
    // Convert numbered lists (1., 2., etc.) to HTML ordered lists
    formatted = formatted.replace(/^[\s]*(\d+)\.\s*(.+)$/gm, '<li>$2</li>');
    formatted = formatted.replace(/(<li>(?:(?!<ul|<\/ul>).)*<\/li>)/gs, (match) => {
      if (!match.includes('formatted-list')) {
        return `<ol class="formatted-ordered-list">${match}</ol>`;
      }
      return match;
    });
    
    // Make text between **text** bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Make text between *text* italic
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert headings (## Heading)
    formatted = formatted.replace(/^##\s*(.+)$/gm, '<h3 class="formatted-heading">$1</h3>');
    
    // Convert sub-headings (### Sub-heading)
    formatted = formatted.replace(/^###\s*(.+)$/gm, '<h4 class="formatted-subheading">$1</h4>');
    
    // Convert URLs to clickable links
    formatted = formatted.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="formatted-link">$1</a>');
    
    // Wrap paragraphs
    const paragraphs = formatted.split('<br><br>').filter(p => p.trim());
    formatted = paragraphs.map(p => {
      // Don't wrap if it's already a heading or list
      if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<ol')) {
        return p;
      }
      return `<p class="formatted-paragraph">${p}</p>`;
    }).join('');
    
    return formatted;
  };

  const getJobTypeConfig = (type) => {
    const configs = {
      'full-time': { bg: 'bg-emerald-500', text: 'text-white', bgLight: 'bg-emerald-100', textLight: 'text-emerald-800', icon: '💼' },
      'part-time': { bg: 'bg-blue-500', text: 'text-white', bgLight: 'bg-blue-100', textLight: 'text-blue-800', icon: '⏰' },
      'contract': { bg: 'bg-purple-500', text: 'text-white', bgLight: 'bg-purple-100', textLight: 'text-purple-800', icon: '📝' },
      'internship': { bg: 'bg-orange-500', text: 'text-white', bgLight: 'bg-orange-100', textLight: 'text-orange-800', icon: '🎓' }
    };
    return configs[type] || configs['full-time'];
  };

  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin absolute top-2 left-2 animate-reverse-spin"></div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading opportunity details...</h3>
          <p className="text-gray-600">Gathering the latest information for you</p>
        </div>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-orange-100 rounded-full"></div>
          <div className="absolute inset-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>
    </div>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState />;

  const typeConfig = getJobTypeConfig(job.jobType);
  const isNew = new Date() - new Date(job.createdAt) < 24 * 60 * 60 * 1000;
  const hasApplied = job.applicants?.some(app => app.userId === user?._id);
  const deadlinePassed = job.applicationDeadline && new Date(job.applicationDeadline) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <div className="relative pt-24 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="flex justify-center items-center space-x-4 mb-6">
                {isNew && (
                  <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-full animate-pulse shadow-lg">
                    ✨ NEW OPPORTUNITY
                  </span>
                )}
                <span className={`inline-flex items-center px-4 py-2 ${typeConfig.bg} ${typeConfig.text} text-sm font-bold rounded-full shadow-lg`}>
                  <span className="mr-2">{typeConfig.icon}</span>
                  {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1).replace('-', ' ')}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {job.title}
              </h1>
              
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-semibold">{job.company}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{job.location}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="font-semibold">{formatSalary(job.salary)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-10 relative z-10 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Quick Stats Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-medium">Experience</p>
                <p className="font-bold text-gray-900">{formatExperience(job.experience)}</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-medium">Applicants</p>
                <p className="font-bold text-gray-900">{job.applicants?.length || 0}</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 font-medium">Posted</p>
                <p className="font-bold text-gray-900 text-sm">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Hourglass className='text-white' />
                </div>
                <p className="text-sm text-gray-600 font-medium">Deadline</p>
                <p className="font-bold text-gray-900 text-sm">
                  {job.applicationDeadline ? format(new Date(job.applicationDeadline), 'MMM dd') : 'Open'}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Cards */}
          <div className="space-y-8">
            {/* Job Description */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="flex items-center mb-6">
                <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-gray-900">Job Description</h2>
              </div>
              <div className="prose max-w-none">
                <div 
                  className="formatted-content text-gray-700 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: formatDescription(job.description) }}
                />
              </div>
            </div>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-4"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Requirements</h2>
                </div>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-lg leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Skills */}
            {job.skills?.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full mr-4"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Required Skills</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-semibold rounded-xl border border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 shadow-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="flex items-center mb-6">
                <div className="w-3 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
              </div>
              
              {!job.contactEmail && !job.contactPhone ? (
                <div className="text-center py-8">
                  <div className="relative mx-auto w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-slate-100 rounded-full"></div>
                    <div className="absolute inset-3 bg-gradient-to-r from-gray-400 to-slate-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Contact Details Provided</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    The employer has not provided specific contact information. Please use the apply button to submit your application through the provided link.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {job.contactEmail && (
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">{job.contactEmail}</p>
                      </div>
                    </div>
                  )}

                  {job.contactPhone && (
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Phone</p>
                        <p className="font-semibold text-gray-900">{job.contactPhone}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 mt-12">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600 mb-1">
                  Posted by {job.postedBy?.username || 'Unknown'}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => window.open(job.applyLink, '_blank')}
                  disabled={deadlinePassed}
                  className={`cursor-pointer inline-flex items-center px-8 py-3 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    hasApplied 
                      ? 'bg-green-500 text-white cursor-default' 
                      : deadlinePassed
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                  }`}
                >
                  {hasApplied ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Applied
                    </>
                  ) : deadlinePassed ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Deadline Passed
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Apply Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes reverseSpn {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-reverse-spin {
          animation: reverseSpn 1s linear infinite;
        }

        .formatted-content .formatted-paragraph {
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        .formatted-content .formatted-heading {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 2rem 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .formatted-content .formatted-subheading {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin: 1.5rem 0 0.75rem 0;
        }

        .formatted-content .formatted-list {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .formatted-content .formatted-list li {
          margin-bottom: 0.5rem;
          color: #4b5563;
          position: relative;
        }

        .formatted-content .formatted-list li::marker {
          color: #3b82f6;
          font-weight: bold;
        }

        .formatted-content .formatted-ordered-list {
          margin: 1rem 0;
          padding-left: 1.5rem;
          counter-reset: item;
        }

        .formatted-content .formatted-ordered-list li {
          margin-bottom: 0.5rem;
          color: #4b5563;
          counter-increment: item;
        }

        .formatted-content .formatted-ordered-list li::marker {
          color: #3b82f6;
          font-weight: bold;
        }

        .formatted-content .formatted-link {
          color: #3b82f6;
          text-decoration: underline;
          font-weight: 500;
        }

        .formatted-content .formatted-link:hover {
          color: #1d4ed8;
        }

        .formatted-content strong {
          font-weight: 700;
          color: #1f2937;
        }

        .formatted-content em {
          font-style: italic;
          color: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default JobDetails;
