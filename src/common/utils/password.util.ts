import * as bcrypt from 'bcrypt';

class PasswordUtil {
  private SALT_ROUNDS = 10;

  public hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  };

  public async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public validatePasswordStrength(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()]/.test(password);
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  }
}

export default new PasswordUtil();
