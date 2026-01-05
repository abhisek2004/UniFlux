import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';
import { Star, Send, MessageSquare, Bug, Lightbulb, HelpCircle, MessageCircle } from 'lucide-react';

const UserFeedback: React.FC = () => {
    const { showToast } = useToast();
    const { currentUser } = useApp();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [formData, setFormData] = useState({
        category: 'suggestion',
        message: '',
        email: currentUser?.email || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        { id: 'suggestion', label: 'Suggestion', icon: Lightbulb, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
        { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
        { id: 'question', label: 'Question', icon: HelpCircle, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
        { id: 'compliment', label: 'Compliment', icon: MessageCircle, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            showToast('error', 'Rating Required', 'Please provide a star rating.');
            return;
        }

        if (!formData.message.trim()) {
            showToast('error', 'Message Required', 'Please tell us more about your feedback.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            showToast('success', 'Feedback Received', 'Thank you for your valuable feedback! We appreciate it.');

            // Reset form
            setRating(0);
            setFormData({
                ...formData,
                category: 'suggestion',
                message: ''
            });
        } catch (error) {
            showToast('error', 'Submission Failed', 'Something went wrong. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Feedback</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Your feedback helps us make CampusCore better for everyone.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="md:flex">
                    {/* Left Side: Illustration/Stats */}
                    <div className="md:w-1/3 bg-primary-600 p-8 text-white hidden md:flex flex-col justify-center">
                        <div className="mb-6">
                            <MessageSquare className="h-16 w-16 opacity-20 absolute -mt-4 -ml-4" />
                            <h2 className="text-2xl font-bold relative z-10">We're Listening</h2>
                        </div>
                        <p className="text-primary-100 mb-8">
                            Whether it's a feature request, a bug report, or a compliment, we read every single piece of feedback.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-sm">
                                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                                <span>Average Response: 24 Hours</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm">
                                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                                <span>98% Satisfaction Rate</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="flex-1 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                    What kind of feedback do you have?
                                </label>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                    {categories.map((cat) => {
                                        const Icon = cat.icon;
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, category: cat.id })}
                                                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${formData.category === cat.id
                                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                                        : 'border-transparent bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-lg mb-2 ${cat.color}`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Star Rating */}
                            <div className="py-4 border-y border-gray-100 dark:border-gray-700 text-center">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-left">
                                    How would you rate your experience?
                                </label>
                                <div className="flex justify-center space-x-2">
                                    {[...Array(5)].map((_, index) => {
                                        const starValue = index + 1;
                                        return (
                                            <button
                                                key={index}
                                                type="button"
                                                className="focus:outline-none transform transition-transform hover:scale-110"
                                                onMouseEnter={() => setHover(starValue)}
                                                onMouseLeave={() => setHover(0)}
                                                onClick={() => setRating(starValue)}
                                            >
                                                <Star
                                                    className={`h-10 w-10 ${starValue <= (hover || rating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300 dark:text-gray-600'
                                                        }`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                                {rating > 0 && (
                                    <p className="mt-2 text-sm font-medium text-primary-600">
                                        {rating === 5 ? 'Excellent!' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                                    </p>
                                )}
                            </div>

                            {/* Email (Readonly) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Your Registered Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-500 italic"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tell us more <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Share your thoughts, describe a bug, or suggest an improvement..."
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-white font-bold transition-all ${isSubmitting
                                        ? 'bg-primary-400 cursor-not-allowed'
                                        : 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-primary-500/30'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        <span>Submit Feedback</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">100% Anonymous Option</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Bug className="h-5 w-5" />
                    <span className="text-sm font-medium">Auto-Bug Ticket Generation</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5" />
                    <span className="text-sm font-medium">Feature Priority System</span>
                </div>
            </div>
        </div>
    );
};

export default UserFeedback;
