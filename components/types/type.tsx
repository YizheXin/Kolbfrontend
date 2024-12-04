// types/type.ts

// Basic folder and bucket types
export interface FolderItem {
  prefix: string;
  type: 'folder';  // Literal type to ensure consistency
  itemCount: number;
}

export interface Bucket {
  name: string;
  displayName: string;
  itemCount: number;
  type: 'folder';  // Matching the FolderItem type
  lastModified?: string;
}

// GCP Storage related types
export interface StorageFile {
  name: string;
  metadata: {
    timeCreated?: string;
    updated?: string;
    size?: string;
  };
  bucket: string;
  id?: string;
  generation?: string;
  contentType?: string;
}

export interface FileMetadata {
  contentType?: string;
  updated?: string;
  evaluation?: {
    patterns?: string[];
    isFinished?: boolean;
    lastModified?: string;
  };
}

export interface FileItem {
  name: string;
  timeCreated: string;
  size: string;
  type: string;
  url: string;
  metadata?: FileMetadata;
}

// File types for the application
export interface MindMapFile {
  name: string;
  blobPath: string;
  url: string;
  timeCreated: string;
  size: string;
  metadata?: {
    evaluation?: {
      patterns?: string[];
      isFinished?: boolean;
      lastModified?: string;
    }
  }
}

// Base API Response type
export interface BaseApiResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Storage API specific types
export interface StorageApiResponse {
  prefixes?: string[];
  nextPageToken?: string;
}

export interface FileResponse {
  success: boolean;
  data?: {
    file: MindMapFile;
  } | null;
  message?: string;
}
// Combined response types
export interface GetFoldersResponse extends BaseApiResponse {
  folders: FolderItem[];
}

export interface FileListResponse extends BaseApiResponse {
  files: FileItem[];
}

// Evaluation related types
export interface PatternState {
  [key: string]: boolean;
}

export interface EvaluationStatus {
  isFinished: boolean;
  patterns: Record<string, boolean>;
}

export interface FileStatus {
  [key: string]: EvaluationStatus | null;
}


// Type guards
export function isStorageFile(file: unknown): file is StorageFile {
  return (
    typeof file === 'object' &&
    file !== null &&
    'name' in file &&
    'metadata' in file &&
    typeof file.name === 'string'
  );
}

export function isMindMapFile(file: unknown): file is MindMapFile {
  return (
    typeof file === 'object' &&
    file !== null &&
    'name' in file &&
    'blobPath' in file &&
    'url' in file &&
    'timeCreated' in file &&
    'size' in file
  );
}

// Additional type guard for API responses
export function isFileListResponse(response: unknown): response is FileListResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    'message' in response &&
    'files' in response &&
    Array.isArray(response.files)
  );
}