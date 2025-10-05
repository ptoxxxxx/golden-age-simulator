import { z } from "zod";

// Avatar file validation
export const avatarFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "File size must be less than 5MB",
  })
  .refine(
    (file) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type
      ),
    {
      message: "File must be a JPEG, PNG, or WebP image",
    }
  );

// Onboarding form validation
export const onboardingSchema = z.object({
  nickname: z
    .string()
    .max(50, "Nickname must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  tempoProfile: z.enum(["realistic", "fast", "custom"], {
    errorMap: () => ({ message: "Please select a valid tempo profile" }),
  }),
  avatar: z.instanceof(File).optional().refine(
    (file) => {
      if (!file) return true;
      return file.size <= 5 * 1024 * 1024;
    },
    { message: "File size must be less than 5MB" }
  ).refine(
    (file) => {
      if (!file) return true;
      return ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type
      );
    },
    { message: "File must be a JPEG, PNG, or WebP image" }
  ),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
