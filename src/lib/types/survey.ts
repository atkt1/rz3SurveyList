import { z } from 'zod';

export const surveySchema = z.object({
  survey_name: z.string().min(1, 'Survey name is required'),
  survey_style: z.string().min(1, 'Survey type is required'),
  minimum_review_length: z.string().min(1, 'Minimum review length is required'),
  minimum_star_rating: z.string().min(1, 'Minimum star rating is required'),
  time_delay: z.string().min(1, 'Time delay is required'),
  logo: z.instanceof(File)
    .refine((file) => file.size <= 750 * 1024, 'Logo must be less than 750KB')
    .nullable()
    .optional(),
  logoUrl: z.string().optional(),
  product_ids: z.array(z.string()).min(1, 'At least one product must be selected'),
});

export type SurveyFormData = z.infer<typeof surveySchema>;

export interface Survey {
  id: string;
  survey_name: string;
  survey_style: string;
  minimum_review_length: string;
  minimum_star_rating: string;
  time_delay: string;
  logo_path: string;
  created_at: string;
  survey_status: 'ACTIVE' | 'PAUSED';
  url: string;
  qr_code: string;
  user_id: string;
}