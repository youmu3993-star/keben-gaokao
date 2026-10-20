CREATE TYPE "Role" AS ENUM ('STUDENT','REVIEWER','ADMIN');
CREATE TABLE "User" ("id" TEXT PRIMARY KEY,"email" TEXT NOT NULL UNIQUE,"name" TEXT NOT NULL,"passwordHash" TEXT NOT NULL,"role" "Role" NOT NULL DEFAULT 'STUDENT',"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "Session" ("id" TEXT PRIMARY KEY,"userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,"expiresAt" TIMESTAMP(3) NOT NULL);
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");
CREATE TABLE "Paper" ("id" TEXT PRIMARY KEY,"year" INTEGER NOT NULL,"name" TEXT NOT NULL,"family" TEXT NOT NULL,"variant" TEXT NOT NULL,"sourceUrl" TEXT,"note" TEXT NOT NULL);
CREATE UNIQUE INDEX "Paper_year_name_variant_key" ON "Paper"("year","name","variant");
CREATE TABLE "ExamQuestion" ("id" TEXT PRIMARY KEY,"paperId" TEXT NOT NULL REFERENCES "Paper"("id") ON DELETE RESTRICT ON UPDATE CASCADE,"number" TEXT NOT NULL,"category" TEXT NOT NULL,"title" TEXT NOT NULL,"sourceUrl" TEXT NOT NULL,"sourceTitle" TEXT NOT NULL,"authorization" TEXT NOT NULL DEFAULT 'UNKNOWN',"authorizationEvidence" TEXT,"verification" TEXT NOT NULL DEFAULT 'PENDING',"verificationEvidence" TEXT,"verifiedBy" TEXT,"verifiedAt" TIMESTAMP(3),"body" TEXT,"reference" TEXT,"annotationIds" TEXT[] NOT NULL,"version" INTEGER NOT NULL DEFAULT 1);
CREATE UNIQUE INDEX "ExamQuestion_paperId_number_key" ON "ExamQuestion"("paperId","number");
CREATE INDEX "ExamQuestion_category_verification_authorization_idx" ON "ExamQuestion"("category","verification","authorization");
CREATE TABLE "Attempt" ("id" TEXT PRIMARY KEY,"userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,"exerciseId" TEXT NOT NULL,"answer" TEXT NOT NULL,"assessment" JSONB NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"reviewStatus" TEXT NOT NULL DEFAULT 'NONE',"assignedTo" TEXT,"finalPoints" JSONB);
CREATE INDEX "Attempt_userId_createdAt_idx" ON "Attempt"("userId","createdAt");
CREATE INDEX "Attempt_reviewStatus_idx" ON "Attempt"("reviewStatus");
CREATE TABLE "Review" ("id" TEXT PRIMARY KEY,"attemptId" TEXT NOT NULL REFERENCES "Attempt"("id") ON DELETE CASCADE ON UPDATE CASCADE,"reviewerId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,"reason" TEXT NOT NULL,"points" JSONB NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "StudyRecord" ("id" TEXT PRIMARY KEY,"userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,"annotationId" TEXT NOT NULL,"action" TEXT NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX "StudyRecord_userId_annotationId_idx" ON "StudyRecord"("userId","annotationId");
CREATE TABLE "Mastery" ("id" TEXT PRIMARY KEY,"userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,"annotationId" TEXT NOT NULL,"evidenceCount" INTEGER NOT NULL,"ratio" DOUBLE PRECISION NOT NULL,"updatedAt" TIMESTAMP(3) NOT NULL);
CREATE UNIQUE INDEX "Mastery_userId_annotationId_key" ON "Mastery"("userId","annotationId");
CREATE TABLE "Audit" ("id" TEXT PRIMARY KEY,"actorId" TEXT NOT NULL,"action" TEXT NOT NULL,"entityId" TEXT NOT NULL,"details" JSONB NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "RateBucket" ("id" TEXT PRIMARY KEY,"count" INTEGER NOT NULL,"resetAt" TIMESTAMP(3) NOT NULL);


