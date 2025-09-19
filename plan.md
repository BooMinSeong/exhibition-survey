# 전시경험 설문조사 웹 서비스

## 1. 프로젝트 생성 및 설정

```bash
# 프로젝트 생성
npx create-next-app@latest exhibition-survey --typescript --tailwind --app
cd exhibition-survey

# 추가 패키지 설치
npm install react-hook-form lucide-react framer-motion react-hot-toast
```

## 2. package.json
```json
{
  "name": "exhibition-survey",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.2.7",
    "typescript": "^5",
    "react-hook-form": "^7.47.0",
    "lucide-react": "^0.263.1",
    "framer-motion": "^10.16.4",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.7",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38"
  }
}
```

## 3. 데이터 저장 파일 구조

### public/data/surveys.json
```json
{
  "surveys": [
    {
      "id": 1,
      "responses": {
        "exhibition_name": "현대미술의 새로운 시선",
        "first_impression": "전시장에 들어서자마자 압도되는 규모와 색감에 놀랐습니다.",
        "memorable_work": "가장 기억에 남는 작품은 입구의 대형 설치미술이었어요. 빛과 그림자의 조화가 인상적이었습니다.",
        "emotional_response": "작품들을 보면서 평소 느끼지 못했던 감정들이 올라왔어요. 특히 슬픔과 기쁨이 동시에 느껴지는 묘한 경험이었습니다.",
        "overall_experience": "전체적으로 매우 만족스러운 경험이었습니다. 다음에도 이런 전시가 있다면 꼭 참여하고 싶어요."
      },
      "timestamp": "2025-09-20T10:30:00Z"
    }
  ],
  "metadata": {
    "total_responses": 1,
    "created_at": "2025-09-20T00:00:00Z"
  }
}
```

## 4. API Routes

### pages/api/surveys.js
```javascript
import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'public', 'data', 'surveys.json')

// 데이터 파일이 없으면 생성
function ensureDataFile() {
  if (!fs.existsSync(dataFile)) {
    const initialData = {
      surveys: [],
      metadata: {
        total_responses: 0,
        created_at: new Date().toISOString()
      }
    }
    fs.mkdirSync(path.dirname(dataFile), { recursive: true })
    fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2))
  }
}

export default function handler(req, res) {
  ensureDataFile()
  
  try {
    if (req.method === 'GET') {
      // 모든 설문조사 데이터 반환
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
      res.status(200).json(data)
    }
    
    if (req.method === 'POST') {
      // 새로운 설문조사 응답 추가
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
      
      const newSurvey = {
        id: Date.now(),
        responses: req.body.responses,
        timestamp: new Date().toISOString()
      }
      
      data.surveys.push(newSurvey)
      data.metadata.total_responses = data.surveys.length
      
      fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
      res.status(201).json({ success: true, id: newSurvey.id })
    }
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
```

## 5. 메인 페이지 컴포넌트

### pages/index.js
```javascript
import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { ArrowRight, Users, MessageSquare } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  
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
  )
}
```

## 6. 설문조사 페이지

### pages/survey.js
```javascript
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

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
]

export default function Survey() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const router = useRouter()
  
  const currentAnswer = watch(questions[currentStep]?.key)
  
  const submitSurvey = async (data) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: data })
      })
      
      if (response.ok) {
        toast.success('설문조사가 완료되었습니다!')
        setTimeout(() => router.push('/results'), 1500)
      } else {
        throw new Error('제출 실패')
      }
    } catch (error) {
      toast.error('제출 중 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8"
      >
        {/* 진행률 표시 */}
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
                {...register(questions[currentStep].key, { 
                  required: '이 질문에 대한 답변을 입력해주세요',
                  minLength: { value: 10, message: '최소 10자 이상 입력해주세요' }
                })}
                placeholder={questions[currentStep].placeholder}
                className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              
              {errors[questions[currentStep].key] && (
                <p className="text-red-500 text-sm mt-2">
                  {errors[questions[currentStep].key].message}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* 네비게이션 버튼 */}
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
                disabled={isSubmitting || !currentAnswer}
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
  )
}
```

## 7. 결과 페이지

### pages/results.js
```javascript
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageSquare, Clock, Users } from 'lucide-react'

export default function Results() {
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    fetchSurveys()
  }, [])
  
  const fetchSurveys = async () => {
    try {
      const response = await fetch('/api/surveys')
      const data = await response.json()
      setSurveys(data.surveys || [])
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
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
        
        {/* 새 설문 버튼 */}
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
  )
}
```

## 8. 배포 단계

### Vercel 배포
```bash
# GitHub에 푸시 후
# vercel.com에서 프로젝트 연결
# 자동 빌드 및 배포

# 또는 Vercel CLI 사용
npm install -g vercel
vercel --prod
```

## 9. 폴더 구조 최종
```
exhibition-survey/
├── pages/
│   ├── api/
│   │   └── surveys.js          # API 엔드포인트
│   ├── _app.js                 # 앱 설정
│   ├── index.js                # 메인 페이지
│   ├── survey.js               # 설문조사 페이지
│   └── results.js              # 결과 페이지
├── public/
│   └── data/
│       └── surveys.json        # 데이터 저장소
├── styles/
│   └── globals.css             # 전역 스타일
└── package.json
```

이 구조로 완전히 작동하는 설문조사 웹사이트가 완성됩니다!
