export interface CourseModule {
    CourseId: number;
    ModuleId:number;
    CourseName: string;
    ModuleName: string;
    ModuleDescription: string;
    SequenceNo: string;    
    CreatedBy: string;
    Status: string;
    
}
export interface ModuleVideoRequest {
  course_id: number;
  module_id: number;
  video_title: string;
  video_url?: string;
  duration_in_seconds?: string;
  sequence_no?: number;
  created_by: string;
}

export interface ModuleVideoResponse {
  video_id: number;
  course_id: number;
  module_id: number;
  video_title: string;
  video_url?: string;
  duration_in_seconds?: string;
  sequence_no?: number;
  created_by: string;
  created_at: string;
  updated_by?: string;
  updated_at?: string;
  status: string;
}