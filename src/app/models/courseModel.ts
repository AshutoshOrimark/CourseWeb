export interface Course {
    course_id: number;
    category_id: number;
    course_name: string;
    course_description: string;
    course_info: string;
    course_language: string;
    banner_image: string;
    author: string;
    rating: number;
    actual_price: number;
    discounted_price: number;
    discount_percentage: number;
    is_premium: boolean;
    is_best_seller: boolean;
    video_path: string;
    is_public: boolean;
    created_by: string;
    status: string;
    created_on?: string;
}