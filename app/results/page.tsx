'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, Clock, Users } from 'lucide-react';

interface Survey {
  id: number;
  responses: {
    exhibition_name: string;
    first_impression: string;
    memorable_work: string;
    emotional_response: string;
    overall_experience: string;
  };
  timestamp: string;
}

interface SurveyData {
  surveys: Survey[];
  metadata: {
    total_responses: number;
    created_at: string;
  };
}

export default function Results() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await fetch('/api/surveys');
      const data: SurveyData = await response.json();
      setSurveys(data.surveys || []);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">설문조사 결과</h1>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <Users className="w-4 h-4" />
              총 {surveys.length}명의 응답
            </p>
          </div>
        </motion.div>

        {surveys.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-2xl shadow-sm"
          >
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">아직 응답이 없습니다</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {surveys.map((survey, index) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    응답 #{surveys.length - index}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(survey.timestamp)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">관람 전시회</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {survey.responses.exhibition_name}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">첫인상</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {survey.responses.first_impression}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">기억에 남는 순간</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {survey.responses.memorable_work}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">감정과 생각</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {survey.responses.emotional_response}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">전체 경험</h3>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {survey.responses.overall_experience}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => router.push('/survey')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            나도 참여하기
          </button>
        </motion.div>
      </div>
    </div>
  );
}