export interface Course {
    course_id: number;
    course_name: string;
    course_description: string;
    video_path: string;
    actual_price: number;
    discounted_price: number;
    discount_percentage: number;
    is_public: boolean;
    created_by: string;
    status: string;
    created_on?: string;
}