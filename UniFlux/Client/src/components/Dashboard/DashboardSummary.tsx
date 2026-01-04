import React from 'react';
import { Clock, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SummaryWidgetProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ElementType;
    color: string;
    type?: 'neutral' | 'success' | 'warning' | 'info';
}

const SummaryWidget: React.FC<SummaryWidgetProps> = ({ title, value, subtitle, icon: Icon, color, type = 'neutral' }) => {
    const typeColors = {
        neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 overflow-hidden">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h4>
                <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white truncate">{value}</span>
                </div>
                {subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{subtitle}</p>
                )}
            </div>
        </div>
    );
};

interface DashboardSummaryProps {
    nextClass?: {
        subject: string;
        time: string;
        room?: string;
    };
    attendanceStatus: {
        percentage: number;
        status: 'Good' | 'Fair' | 'Low';
    };
    recentNotice?: string;
    pendingGrievances: number;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
    nextClass,
    attendanceStatus,
    recentNotice,
    pendingGrievances
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Next Class */}
            <SummaryWidget
                title="Next Class"
                value={nextClass?.subject || 'No classes today'}
                subtitle={nextClass?.time}
                icon={Clock}
                color="bg-indigo-500"
                type="info"
            />

            {/* Attendance Status */}
            <SummaryWidget
                title="Attendance Status"
                value={`${attendanceStatus.percentage}%`}
                subtitle={attendanceStatus.status}
                icon={BookOpen}
                color="bg-blue-500"
                type={attendanceStatus.status === 'Low' ? 'warning' : 'success'}
            />

            {/* Latest Notice */}
            <SummaryWidget
                title="Latest Notice"
                value={recentNotice || 'No new notices'}
                subtitle="Check board for more"
                icon={AlertCircle}
                color="bg-purple-500"
                type="info"
            />

            {/* Pending Support */}
            <SummaryWidget
                title="Pending Grievances"
                value={pendingGrievances.toString()}
                subtitle={pendingGrievances > 0 ? "Under review" : "All resolved"}
                icon={CheckCircle2}
                color="bg-emerald-500"
                type={pendingGrievances > 0 ? 'warning' : 'success'}
            />
        </div>
    );
};

export default DashboardSummary;
