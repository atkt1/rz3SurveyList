import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Play, Pause, Plus } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Survey } from '@/lib/types/survey';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { formatDate } from '@/lib/utils/date';

interface SurveyListProps {
  surveys: Survey[];
  onDelete: (id: string) => Promise<void>;
  onToggleStatus: (id: string, currentStatus: 'ACTIVE' | 'PAUSED') => Promise<void>;
  isLoading?: boolean;
}

export function SurveyList({ 
  surveys, 
  onDelete, 
  onToggleStatus,
  isLoading 
}: SurveyListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const handleEditClick = (surveyId: string) => {
    navigate(`/dashboard/surveys/edit/${surveyId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={cn(
          "text-2xl font-bold",
          isDark ? "text-white" : "text-gray-900"
        )}>
          Surveys
        </h1>
        <Button
          onClick={() => navigate('/dashboard/surveys/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Survey
        </Button>
      </div>

      <div className={cn(
        "rounded-xl border overflow-hidden",
        isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn(
                "border-b text-sm",
                isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"
              )}>
                <th className="px-6 py-4 text-left font-medium">Survey Name</th>
                <th className="px-6 py-4 text-left font-medium">Created Date</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {surveys.map((survey) => (
                <tr 
                  key={survey.id}
                  className={cn(
                    isDark ? "divide-gray-700" : "divide-gray-200"
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={survey.logo_path}
                          alt={survey.survey_name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <div className={cn(
                          "font-medium",
                          isDark ? "text-white" : "text-gray-900"
                        )}>
                          {survey.survey_name}
                        </div>
                        <div className={cn(
                          "text-sm",
                          isDark ? "text-gray-400" : "text-gray-500"
                        )}>
                          {survey.survey_style}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={cn(
                    "px-6 py-4",
                    isDark ? "text-gray-300" : "text-gray-700"
                  )}>
                    {formatDate(survey.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      survey.survey_status === 'ACTIVE'
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    )}>
                      {survey.survey_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(survey.id)}
                        className={cn(
                          "p-2 rounded-lg transition-all duration-200",
                          "hover:scale-105",
                          isDark 
                            ? "text-blue-400 hover:bg-blue-500/10"
                            : "text-blue-600 hover:bg-blue-50"
                        )}
                        title="Edit survey"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleStatus(survey.id, survey.survey_status)}
                        className={cn(
                          "p-2 rounded-lg transition-all duration-200",
                          "hover:scale-105",
                          isDark 
                            ? "text-yellow-400 hover:bg-yellow-500/10"
                            : "text-yellow-600 hover:bg-yellow-50"
                        )}
                        title={survey.survey_status === 'ACTIVE' ? "Pause survey" : "Activate survey"}
                      >
                        {survey.survey_status === 'ACTIVE' 
                          ? <Pause className="w-4 h-4" />
                          : <Play className="w-4 h-4" />
                        }
                      </button>
                      <button
                        onClick={() => setDeleteId(survey.id)}
                        className={cn(
                          "p-2 rounded-lg transition-all duration-200",
                          "hover:scale-105",
                          isDark 
                            ? "text-red-400 hover:bg-red-500/10"
                            : "text-red-600 hover:bg-red-50"
                        )}
                        title="Delete survey"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await onDelete(deleteId);
            setDeleteId(null);
          }
        }}
      />
    </div>
  );
}