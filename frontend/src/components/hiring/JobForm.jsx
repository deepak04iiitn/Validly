import { useState } from 'react';
import PaymentModal from './PaymentModal';
import { Briefcase } from 'lucide-react';

const JobForm = ({ onJobPosted }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: [''],
    location: '',
    salary: { min: '', max: '' },
    jobType: 'full-time',
    experience: { min: '', max: '' },
    skills: [''],
    contactEmail: '',
    contactPhone: '',
    applicationDeadline: '',
    applyLink: '',
  });
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (index, value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.applyLink.trim()) newErrors.applyLink = 'Apply link is required';
    
    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const cleanedData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim()),
        skills: formData.skills.filter(skill => skill.trim()),
        salary: {
          min: formData.salary.min ? Number(formData.salary.min) : undefined,
          max: formData.salary.max ? Number(formData.salary.max) : undefined
        },
        experience: {
          min: formData.experience.min ? Number(formData.experience.min) : undefined,
          max: formData.experience.max ? Number(formData.experience.max) : undefined
        }
      };
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = (jobId) => {
    setShowPaymentModal(false);
    onJobPosted?.(jobId);
    setFormData({
      title: '',
      company: '',
      description: '',
      requirements: [''],
      location: '',
      salary: { min: '', max: '' },
      jobType: 'full-time',
      experience: { min: '', max: '' },
      skills: [''],
      contactEmail: '',
      contactPhone: '',
      applicationDeadline: '',
      applyLink: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-6">
            <Briefcase size={40} className='text-white' />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            Post Your Job
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect with top talent and find the perfect candidate for your team
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 pointer-events-none"></div>
            
            <div className="relative p-8 md:p-12 space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900">Basic Information</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">Job Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 bg-white/80 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 ${errors.title ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                      placeholder="e.g. Senior React Developer"
                    />
                    {errors.title && <p className="text-red-500 text-sm font-medium">{errors.title}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">Company *</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 bg-white/80 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 ${errors.company ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                      placeholder="e.g. Tech Solutions Inc."
                    />
                    {errors.company && <p className="text-red-500 text-sm font-medium">{errors.company}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 bg-white/80 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 ${errors.location ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                      placeholder="e.g. Mumbai, Remote, Hybrid"
                    />
                    {errors.location && <p className="text-red-500 text-sm font-medium">{errors.location}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">Job Type</label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 hover:border-gray-300"
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800">Job Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-4 bg-white/80 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 resize-none ${errors.description ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                  />
                  {errors.description && <p className="text-red-500 text-sm font-medium">{errors.description}</p>}
                </div>
              </div>

              {/* Requirements Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900">Requirements & Skills</h3>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-800">Requirements</label>
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex gap-3 group">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => handleArrayChange(index, e.target.value, 'requirements')}
                        className="flex-1 px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-gray-900 placeholder-gray-500 hover:border-gray-300"
                        placeholder="e.g. 3+ years React experience"
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'requirements')}
                          className="cursor-pointer px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('requirements')}
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Requirement
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-800">Required Skills</label>
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex gap-3 group">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleArrayChange(index, e.target.value, 'skills')}
                        className="flex-1 px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder-gray-500 hover:border-gray-300"
                        placeholder="e.g. JavaScript, React, Node.js"
                      />
                      {formData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'skills')}
                          className="cursor-pointer px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('skills')}
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Skill
                  </button>
                </div>
              </div>

              {/* Compensation & Experience Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-yellow-500 to-orange-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900">Compensation & Experience</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">Minimum Salary (₹/month)</label>
                    <input
                      type="number"
                      name="salary.min"
                      value={formData.salary.min}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-300 text-gray-900 placeholder-gray-500 hover:border-gray-300"
                      placeholder="e.g. 50000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">Maximum Salary (₹/month)</label>
                    <input
                      type="number"
                      name="salary.max"
                      value={formData.salary.max}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-300 text-gray-900 placeholder-gray-500 hover:border-gray-300"
                      placeholder="e.g. 80000"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">Minimum Experience (years)</label>
                    <input
                      type="number"
                      name="experience.min"
                      value={formData.experience.min}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500 hover:border-gray-300"
                      placeholder="e.g. 2"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">Maximum Experience (years)</label>
                    <input
                      type="number"
                      name="experience.max"
                      value={formData.experience.max}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 placeholder-gray-500 hover:border-gray-300"
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>
              </div>

              {/* Contact & Application Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-blue-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-gray-900">Contact & Application</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">Contact Email</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 bg-white/80 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 placeholder-gray-500 ${errors.contactEmail ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                      placeholder="hr@company.com"
                    />
                    {errors.contactEmail && <p className="text-red-500 text-sm font-medium">{errors.contactEmail}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">Contact Phone</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 placeholder-gray-500 hover:border-gray-300"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">Application Deadline</label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 hover:border-gray-300"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800">Apply Link *</label>
                    <input
                      type="url"
                      name="applyLink"
                      value={formData.applyLink}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 bg-white/80 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 placeholder-gray-500 ${errors.applyLink ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                      placeholder="https://careers.company.com/apply"
                    />
                    {errors.applyLink && <p className="text-red-500 text-sm font-medium">{errors.applyLink}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8 text-center">
                <button
                  type="submit"
                  className="cursor-pointer group relative inline-flex items-center justify-center px-12 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center space-x-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Post Job - Pay ₹100</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>
                <p className="text-gray-600 mt-4 text-sm">
                  Secure payment processing • 30-day job listing • Premium placement
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        jobData={formData}
      />
    </div>
  );
};

export default JobForm;
