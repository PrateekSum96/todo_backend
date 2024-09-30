import { z } from "zod";
import { ApiError } from "./ApiError.js";

export const validateInputsSignup = (userInfo) => {
  const requiredBodySignup = z.object({
    email: z.string().email("Invalid email format"),
    username: z.string().min(5, "Username must be at least 5 characters long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
  });

  const validationResultSignUp = requiredBodySignup.safeParse(userInfo);
  if (!validationResultSignUp.success) {
    const errors = validationResultSignUp.error.errors.map(
      (err) => err.message
    );
    throw new ApiError(400, errors);
  }
};

export const validateInputsLogin = (userInfo) => {
  const requiredBodyLogin = z.object({
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
  });
  const validationResultLogin = requiredBodyLogin.safeParse(userInfo);
  if (!validationResultLogin.success) {
    const errors = validationResultLogin.error.errors.map((err) => err.message);
    throw new ApiError(400, errors);
  }
};

export const validateSubTodoData = (todoDetails) => {
  const validateSubTodoDetails = z.object({
    todoName: z.string({ message: "abc" }),
    status: z.enum(["To Do", "In Progress", "Done"]),
    dueDate: z.string(),
    note: z.string(),
  });

  const isTodoDetailValid = validateSubTodoDetails.safeParse(todoDetails);

  if (!isTodoDetailValid.success) {
    throw new ApiError(400, "Input validation failed");
  }
};
