'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const questions = [
  {
    key: 'exhibition_name',
    title: '관람한 전시회명을 알려주세요',
    placeholder: '예: 현대미술의 새로운 시선, 인상주의 걸작전 등'
  },
  {
    key: 'first_impression',
    title: '전시장에 처음 들어갔을 때의 첫인상은 어땠나요?',
    placeholder: '전시장의 분위기, 첫 느낌 등을 자유롭게 써주세요'
  },
  {
    key: 'memorable_work',
    title: '가장 기억에 남는 작품이나 순간이 있다면?',
    placeholder: '특별히 인상 깊었던 작품이나 경험을 구체적으로 설명해주세요'
  },
  {
    key: 'emotional_response',
    title: '전시를 보며 어떤 감정이나 생각이 들었나요?',
    placeholder: '작품을 감상하면서 느꼈던 감정, 떠오른 생각들을 써주세요'
  },
  {
    key: 'overall_experience',
    title: '전체적인 전시 관람 경험은 어떠셨나요?',
    placeholder: '만족도, 아쉬웠던 점, 추천하고 싶은 점 등을 자유롭게 써주세요'
  }
];

interface FormData {
  exhibition_name: string;
  first_impression: string;
  memorable_work: string;
  emotional_response: string;
  overall_experience: string;
}

export default function Survey() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const router = useRouter();

  const currentAnswer = watch(questions[currentStep]?.key as keyof FormData);

  const submitSurvey = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: data })
      });

      if (response.ok) {
        toast.success('설문조사가 완료되었습니다!');
        setTimeout(() => router.push('/results'), 1500);
      } else {
        throw new Error('제출 실패');
      }
    } catch (error) {
      toast.error('제출 중 오류가 발생했습니다');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>질문 {currentStep + 1}/{questions.length}</span>
            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(submitSurvey)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {questions[currentStep].title}
              </h2>

              <textarea
                {...register(questions[currentStep].key as keyof FormData, {
                  required: '이 질문에 대한 답변을 입력해주세요',
                  minLength: { value: 10, message: '최소 10자 이상 입력해주세요' }
                })}
                placeholder={questions[currentStep].placeholder}
                className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />

              {errors[questions[currentStep].key as keyof FormData] && (
                <p className="text-red-500 text-sm mt-2">
                  {errors[questions[currentStep].key as keyof FormData]?.message}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              이전
            </button>

            {currentStep === questions.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || !currentAnswer || currentAnswer.length < 10}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                제출하기
              </motion.button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                disabled={!currentAnswer || currentAnswer.length < 10}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                다음
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}