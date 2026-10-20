import type { Category } from './content';
export type User={id:string;email:string;name:string;passwordHash:string;role:'STUDENT'|'REVIEWER'|'ADMIN';createdAt:string};
export type Session={id:string;userId:string;expiresAt:string};
export type PointResult={id:string;earned:number;max:number;evidence:string;feedback:string;confidence:number};
export type Assessment={points:PointResult[];total:number;max:number;confidence:number;summary:string;mode:'AI'|'DEMO';model:string;promptVersion:string;reviewRequired:boolean;failureReason:string|null};
export type Attempt={id:string;userId:string;exerciseId:string;answer:string;assessment:Assessment;createdAt:string;reviewStatus:'NONE'|'PENDING'|'IN_REVIEW'|'COMPLETED';assignedTo:string|null;finalPoints:PointResult[]|null};
export type Review={id:string;attemptId:string;reviewerId:string;reason:string;points:PointResult[];createdAt:string};
export type StudyRecord={id:string;userId:string;annotationId:string;action:'READ'|'SAVE'|'REVISIT';createdAt:string};
export type Mastery={id:string;userId:string;annotationId:string;evidenceCount:number;ratio:number;updatedAt:string};
export type ExamQuestion={id:string;paperId:string;number:string;category:Category;title:string;sourceUrl:string;sourceTitle:string;authorization:'UNKNOWN'|'APPROVED'|'DENIED';authorizationEvidence:string|null;verification:'PENDING'|'VERIFIED'|'REJECTED';verificationEvidence:string|null;verifiedBy:string|null;verifiedAt:string|null;body:string|null;reference:string|null;annotationIds:string[];knowledgePoints:string[];learningAnalysis:string|null;commonMistake:string|null;version:number;displayBasis?:'LICENSED'|'USER_MATERIAL'|'RESTRICTED';sourceLocator?:string|null};
export type Paper={id:string;year:number;name:string;family:'LEGACY'|'NEW'|'NATIONAL';variant:string;sourceUrl:string|null;note:string};
export type Audit={id:string;actorId:string;action:string;entityId:string;details:unknown;createdAt:string};
export type RateBucket={id:string;count:number;resetAt:string};
export type Store={users:User[];sessions:Session[];attempts:Attempt[];reviews:Review[];studyRecords:StudyRecord[];masteries:Mastery[];questions:ExamQuestion[];audits:Audit[];rateBuckets:RateBucket[]};
export type PublicUser=Omit<User,'passwordHash'>;

