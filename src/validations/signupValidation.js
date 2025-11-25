import User from "@/models/userModel";

export const signupValidation = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    return ({ success: false, message: "All fields are required" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return {
      success: false,
      message: "Email already registered",
    };
  }

  // check for weak password
  if (isWeak(password)) {
    return {
      success: false,
      message: "Password is too weak.",
    };
  }

  return { 
    success: true, 
    message: "Validation passed" 
  };
};

export const isWeak = (password) => {
  if (typeof password !== "string") return true;

  // 1. Minimum length check
  if (password.length < 8) return true;

  // 2. Character diversity check
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;'\/]/.test(password);

  // Must have at least 3 out of 4 character types
  const charVariety = [hasLower, hasUpper, hasNumber, hasSpecial].filter(
    Boolean
  ).length;
  if (charVariety < 3) return true;

  // 3. Common passwords or dictionary patterns
  const commonPatterns = [
    "password",
    "123456",
    "123456789",
    "qwerty",
    "abc123",
    "111111",
    "letmein",
    "welcome",
    "monkey",
    "admin",
  ];
  if (commonPatterns.some((p) => password.toLowerCase().includes(p)))
    return true;

  // 4. Repeated or sequential characters
  if (/^(.)\1+$/.test(password)) return true; // same character repeated
  if (/0123|1234|2345|3456|4567|5678|6789/.test(password)) return true;
  if (/abcd|bcde|cdef|defg|efgh|fghi|ghij/.test(password.toLowerCase()))
    return true;

  return false; // passed all weak checks
};
