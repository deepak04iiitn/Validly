import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import JobForm from '../components/hiring/JobForm';
import JobCard from '../components/hiring/JobCard';
import JobSearch from '../components/hiring/JobSearch';
import { GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hiring = () => {
  const user = useSelector(state => state.user.currentUser);
  const [activeTab, setActiveTab] = useState('browse');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  const navigate = useNavigate();

  const fetchJobs = async (page = 1, search = '', filterParams = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...filterParams
      });

      const response = await fetch(`/backend/jobs?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
        setPagination(data.pagination);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchJobs(currentPage, searchQuery, filters);
    }
  }, [activeTab, currentPage, searchQuery, filters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchJobs(1, query, filters);
  };

  const handleFilter = (filterParams) => {
    setFilters(filterParams);
    setCurrentPage(1);
    fetchJobs(1, searchQuery, filterParams);
  };

  const handleApplyForJob = async (jobId) => {
    if (!user) {
      toast.error('Please login to apply for jobs');
      return;
    }

    try {
      const response = await fetch(`/backend/jobs/${jobId}/apply`, {
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
        fetchJobs(currentPage, searchQuery, filters);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error(error.message || 'Failed to apply for job');
    }
  };

  const handleViewJobDetails = (jobId) => {
    window.open(`/jobs/${jobId}`, '_blank');
  };

  const handleJobPosted = (jobId) => {
    toast.success('Job posted successfully!');
    setActiveTab('browse');
    fetchJobs(1, '', {});
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin absolute top-2 left-2 animate-reverse-spin"></div>
      </div>
      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading opportunities...</h3>
        <p className="text-gray-500">Finding the perfect matches for you</p>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="relative mx-auto w-32 h-32 mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full"></div>
        <div className="absolute inset-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">No opportunities found</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        We couldn't find any jobs matching your criteria. Try adjusting your search filters or explore different keywords.
      </p>
      <button
        onClick={() => {
          setSearchQuery('');
          setFilters({});
          fetchJobs(1, '', {});
        }}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Reset Filters
      </button>
    </div>
  );

  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={!pagination.hasPrev}
          className="group relative inline-flex items-center px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl disabled:hover:bg-white disabled:hover:border-gray-200"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={!pagination.hasNext}
          className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Next
          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-200 shadow-lg">
          <span className="text-sm font-medium text-gray-600">
            Page <span className="text-blue-600 font-bold">{pagination.currentPage}</span> of{' '}
            <span className="text-gray-900 font-bold">{pagination.totalPages}</span>
          </span>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 rounded-xl border border-blue-200">
          <span className="text-sm font-medium text-blue-700">
            <span className="font-bold">{pagination.total || 0}</span> opportunities found
          </span>
        </div>
      </div>
    </div>
  );

  const renderBrowseJobs = () => (
    <div className="space-y-8">
      <JobSearch onSearch={handleSearch} onFilter={handleFilter} />
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="space-y-6">
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <div
                  key={job._id}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <JobCard
                    job={job}
                    onApply={handleApplyForJob}
                    onViewDetails={handleViewJobDetails}
                  />
                </div>
              ))
            ) : (
              <EmptyState />
            )}
          </div>

          {pagination.totalPages > 1 && jobs.length > 0 && <PaginationControls />}
        </>
      )}
    </div>
  );

  const renderPostJob = () => {
    if (!user) {
      return (
        <div className="text-center py-16">
          <div className="relative mx-auto w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-red-100 rounded-full"></div>
            <div className="absolute inset-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Please sign in to your account to post job opportunities and connect with talented professionals.
          </p>
          <button className="cursor-pointer inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={() => navigate('/sign-in')}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In to Continue
          </button>
        </div>
      );
    }

    return <JobForm onJobPosted={handleJobPosted} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-8">
                <GraduationCap size={46} className='text-white' />
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
                Career Hub
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
                Discover extraordinary opportunities and connect with visionary companies
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Opportunities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Verified Companies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>Premium Placements</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-2xl border border-white/20">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`cursor-pointer relative px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                    activeTab === 'browse'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Explore Opportunities</span>
                  </div>
                  {activeTab === 'browse' && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
                  )}
                </button>
                
                <button
                  onClick={() => setActiveTab('post')}
                  className={`cursor-pointer relative px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                    activeTab === 'post'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Post Position</span>
                  </div>
                  {activeTab === 'post' && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'browse' ? renderBrowseJobs() : renderPostJob()}
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes reverseSpn {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-reverse-spin {
          animation: reverseSpn 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Hiring;
