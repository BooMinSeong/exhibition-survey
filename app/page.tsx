'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Users, MessageSquare } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center"
      >
        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            전시경험 설문조사
          </h1>
          <p className="text-gray-600">
            당신의 전시 관람 경험을 공유해주세요
          </p>
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/survey')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            설문조사 시작하기
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/results')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <Users className="w-4 h-4" />
            다른 응답 보기
          </motion.button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          익명으로 진행되며 4-5분 정도 소요됩니다
        </p>
      </motion.div>
    </div>
  );
}
