ALTER TABLE "ExamQuestion" ADD COLUMN "knowledgePoints" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "ExamQuestion" ADD COLUMN "learningAnalysis" TEXT;
ALTER TABLE "ExamQuestion" ADD COLUMN "commonMistake" TEXT;

