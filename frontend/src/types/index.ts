// Global Type Definitions

// User Types
export type UserType = 'admin' | 'faculty' | 'student';

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Admin extends BaseUser {
  userType: 'admin';
  role: 'super_admin' | 'admin';
}

export interface Faculty extends BaseUser {
  userType: 'faculty';
  employeeId: string;
  department: string;
  qualification: string;
  experience: number;
  subjects: string[];
}

export interface Student extends BaseUser {
  userType: 'student';
  rollNumber: string;
  branch: string;
  semester: number;
  batch: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
}

export type User = Admin | Faculty | Student;

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
  userType: UserType;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'number' | 'file';
  required?: boolean;
  validation?: any;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

// Branch Types
export interface Branch {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Subject Types
export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  branch: string;
  faculty?: Faculty;
  createdAt: string;
  updatedAt: string;
}

// Notice Types
export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  targetAudience: UserType[];
  attachments?: string[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

// Marks Types
export interface Marks {
  id: string;
  student: Student;
  subject: Subject;
  examType: 'midterm' | 'final' | 'assignment' | 'quiz';
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade?: string;
  semester: number;
  createdAt: string;
  updatedAt: string;
}

// Material Types
export interface Material {
  id: string;
  title: string;
  description?: string;
  subject: Subject;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedBy: Faculty;
  createdAt: string;
  updatedAt: string;
}

// Timetable Types
export interface TimeSlot {
  id: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string;
  endTime: string;
  subject: Subject;
  faculty: Faculty;
  room: string;
  semester: number;
  branch: string;
}

export interface Timetable {
  id: string;
  semester: number;
  branch: string;
  timeSlots: TimeSlot[];
  createdAt: string;
  updatedAt: string;
}

// Search & Pagination Types
export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Component Props Types
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  render?: (value: any, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface PageProps {
  title?: string;
  children?: React.ReactNode;
}

// Hook Return Types
export interface UseCrudReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: ApiResponse['pagination'] | null;
  create: (data: Partial<T>) => Promise<void>;
  update: (id: string, data: Partial<T>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  fetch: (params?: SearchParams) => Promise<void>;
  refetch: () => Promise<void>;
}

// Environment Types
export interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_NODE_ENV: 'development' | 'production' | 'test';
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}