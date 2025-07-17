import React, { useState, useEffect } from 'react';
import { Users, Plus, Link, MapPin, Calendar, Award, AlertTriangle, Layers, ListChecks } from 'lucide-react';

const skillsList = [
  'React', 'Node.js', 'AI/ML', 'UI/UX', 'Backend', 'Frontend', 'Blockchain', 'Mobile', 'Data Science', 'Cloud', 'Other'
];
const statusList = ['Open', 'Full', 'In Progress'];
const locationList = ['Online', 'Offline', 'Hybrid'];

export default function HackathonPostForm({ onSubmit, disabled, initialValues }) {
  const [form, setForm] = useState({
    hackathonName: '',
    hackathonLink: '',
    teammatesRequired: '',
    skills: [],
    prize: '',
    location: '',
    city: '',
    startDate: '',
    endDate: '',
    description: '',
    status: 'Open',
  });
  useEffect(() => {
    if (initialValues) {
      // Ensure date is in YYYY-MM-DD format
      const formatDate = (date) => {
        if (!date) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date; // already correct
        const d = new Date(date);
        if (!isNaN(d)) return d.toISOString().slice(0, 10);
        return '';
      };
      setForm({
        hackathonName: initialValues.hackathonName || '',
        hackathonLink: initialValues.hackathonLink || '',
        teammatesRequired: initialValues.teammatesRequired || '',
        skills: initialValues.skills || [],
        prize: initialValues.prize || '',
        location: initialValues.location || '',
        city: initialValues.city || '',
        startDate: formatDate(initialValues.startDate),
        endDate: formatDate(initialValues.endDate),
        description: initialValues.description || '',
        status: initialValues.status || 'Open',
      });
    }
  }, [initialValues]);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setForm((prev) => ({ ...prev, skills: selected }));
  };

  const validate = () => {
    let temp = {};
    temp.hackathonName = form.hackathonName ? '' : 'Required';
    temp.hackathonLink = form.hackathonLink ? '' : 'Required';
    temp.teammatesRequired = form.teammatesRequired ? '' : 'Required';
    temp.skills = form.skills.length > 0 ? '' : 'Select at least one skill';
    temp.location = form.location ? '' : 'Required';
    temp.startDate = form.startDate ? '' : 'Required';
    temp.endDate = form.endDate ? '' : 'Required';
    temp.description = form.description ? '' : 'Required';
    setErrors(temp);
    return Object.values(temp).every((x) => x === '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      onSubmit && onSubmit(form);
      setTimeout(() => setSubmitted(false), 2000);
      setForm({
        hackathonName: '',
        hackathonLink: '',
        teammatesRequired: '',
        skills: [],
        prize: '',
        location: '',
        city: '',
        startDate: '',
        endDate: '',
        description: '',
        status: 'Open',
      });
      setErrors({});
    }
  };

  return (
    <>
      {/* Premium Gradient Header */}
      <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-t-3xl p-8 flex items-center gap-4 overflow-hidden">
        <div className="p-4 bg-white/20 backdrop-blur-sm rounded-3xl">
          <Users className="text-white w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Post a Hackathon Team Request</h2>
          <p className="text-indigo-100 text-lg font-medium">Find your dream team or attract top talent for your hackathon!</p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-8 bg-white/90 backdrop-blur-xl rounded-b-3xl p-12 shadow-2xl">
        {/* Hackathon Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-slate-700 text-lg">
            <Award className="w-5 h-5 text-violet-600" />
            Hackathon Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="hackathonName"
            value={form.hackathonName}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full px-6 py-4 rounded-2xl border-2 ${errors.hackathonName ? 'border-red-400' : 'border-slate-200'} focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/80 text-lg font-medium`}
            required
            placeholder="e.g. Hack the Future 2024"
          />
          {errors.hackathonName && <span className="text-xs text-red-500 font-semibold flex items-center gap-1"><AlertTriangle className="w-4 h-4" />{errors.hackathonName}</span>}
        </div>
        {/* Hackathon Link */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-slate-700 text-lg">
            <Link className="w-5 h-5 text-green-600" />
            Hackathon Link <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="hackathonLink"
            value={form.hackathonLink}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full px-6 py-4 rounded-2xl border-2 ${errors.hackathonLink ? 'border-red-400' : 'border-slate-200'} focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/80 text-lg font-medium`}
            required
            placeholder="https://example.com"
          />
          {errors.hackathonLink && <span className="text-xs text-red-500 font-semibold flex items-center gap-1"><AlertTriangle className="w-4 h-4" />{errors.hackathonLink}</span>}
        </div>
        {/* Teammates Required */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-slate-700 text-lg">
            <Users className="w-5 h-5 text-blue-600" />
            Number of Teammates Required <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="teammatesRequired"
            value={form.teammatesRequired}
            onChange={handleChange}
            min={1}
            max={10}
            disabled={disabled}
            className={`w-full px-6 py-4 rounded-2xl border-2 ${errors.teammatesRequired ? 'border-red-400' : 'border-slate-200'} focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/80 text-lg font-medium`}
            required
            placeholder="e.g. 3"
          />
          {errors.teammatesRequired && <span className="text-xs text-red-500 font-semibold flex items-center gap-1"><AlertTriangle className="w-4 h-4" />{errors.teammatesRequired}</span>}
        </div>
        {/* Skills Required */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-slate-700 text-lg">
            <Layers className="w-5 h-5 text-indigo-600" />
            Skills Required <span className="text-red-500">*</span>
          </label>
          <select
            multiple
            name="skills"
            value={form.skills}
            onChange={handleSkillsChange}
            disabled={disabled}
            className={`w-full px-6 py-4 rounded-2xl border-2 ${errors.skills ? 'border-red-400' : 'border-slate-200'} focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/80 text-lg font-medium`}
            style={{ minHeight: '3rem' }}
            required
          >
            {skillsList.map((skill) => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
          <div className="text-xs text-slate-500 mt-1">Hold <span className="font-bold">Ctrl</span> (Windows) or <span className="font-bold">Cmd</span> (Mac) to select multiple skills.</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {form.skills.map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold shadow-sm border border-violet-200">{skill}</span>
            ))}
          </div>
          {errors.skills && <span className="text-xs text-red-500 font-semibold flex items-center gap-1"><AlertTriangle className="w-4 h-4" />{errors.skills}</span>}
        </div>
        {/* Prize (optional) */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-slate-700 text-lg">
            <Award className="w-5 h-5 text-yellow-500" />
            Prize or Rewards (optional)
          </label>
          <input
            type="text"
            name="prize"
            value={form.prize}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/80 text-lg font-medium"
            placeholder="e.g. $5000, Swags, Internship, etc."
          />
        </div>
        {/* Location */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-slate-700 text-lg">
            <MapPin className="w-5 h-5 text-pink-600" />
            Location <span className="text-red-500">*</span>
          </label>
          <select
            name="location"
            value={form.location}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full px-6 py-4 rounded-2xl border-2 ${errors.location ? 'border-red-400' : 'border-slate-200'} focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/80 text-lg font-medium`}
            required
          >
            <option value="">Select location</option>
            {locationList.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          {errors.location && <span className="text-xs text-red-500 font-semibold flex items-center gap-1"><AlertTriangle className="w-4 h-4" />{errors.location}</span>}
        </div>
        {/* City (if needed) */}
        {(form.location === 'Offline' || form.location === 'Hybrid') && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-bold text-slate-700 text-lg">
              <MapPin className="w-5 h-5 text-pink-400" />
              City / Country
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              disabled={disabled}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/80 text-lg font-medium"
              placeholder="e.g. Bangalore, India"
            />
          </div>
        )}
        {/* Dates */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 space-y-2">
            <label className="flex items-center gap-2 font-bold text-slate-700 text-lg">
              <Calendar className="w-5 h-5 text-blue-500" />
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              disabled={disabled}
              className={`w-full px-6 py-4 rounded-2xl border-2 ${errors.startDate ? 'border-red-400' : 'border-slate-200'} focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/80 text-lg font-medium`}
              required
            />
            {errors.startDate && <span className="text-xs text-red-500 font-semibold flex items-center gap-1"><AlertTriangle className="w-4 h-4" />{errors.startDate}</span>}
          </div>
          <div className="flex-1 space-y-2">
            <label className="flex items-center gap-2 font-bold text-slate-700 text-lg">
              <Calendar className="w-5 h-5 text-indigo-500" />
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              disabled={disabled}
              className={`w-full px-6 py-4 rounded-2xl border-2 ${errors.endDate ? 'border-red-400' : 'border-slate-200'} focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/80 text-lg font-medium`}
              required
            />
            {errors.endDate && <span className="text-xs text-red-500 font-semibold flex items-center gap-1"><AlertTriangle className="w-4 h-4" />{errors.endDate}</span>}
          </div>
        </div>
        {/* Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-slate-700 text-lg">
            <ListChecks className="w-5 h-5 text-purple-600" />
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={disabled}
            rows={3}
            className={`w-full px-6 py-4 rounded-2xl border-2 ${errors.description ? 'border-red-400' : 'border-slate-200'} focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/80 text-lg font-medium`}
            required
            placeholder="Describe your team, project, or what you're looking for..."
          />
          {errors.description && <span className="text-xs text-red-500 font-semibold flex items-center gap-1"><AlertTriangle className="w-4 h-4" />{errors.description}</span>}
        </div>
        {/* Status */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-slate-700 text-lg">
            <Layers className="w-5 h-5 text-slate-500" />
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={disabled}
            className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all bg-white/80 text-lg font-medium"
          >
            {statusList.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        {/* Error Message (if any) */}
        {Object.values(errors).some(Boolean) && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 text-red-700 font-bold text-lg flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            Please fix the errors above before submitting.
          </div>
        )}
        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitted || disabled}
          className="group relative w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-8 py-6 rounded-3xl font-bold text-xl hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <span className="relative z-10 flex items-center justify-center gap-3">
            {initialValues && initialValues._id ? (
              <><ListChecks className="w-6 h-6" />{submitted ? 'Updated!' : 'Update'}</>
            ) : (
              <><Plus className="w-6 h-6" />{submitted ? 'Posted!' : 'Post Team Request'}</>
            )}
          </span>
        </button>
      </form>
    </>
  );
} 